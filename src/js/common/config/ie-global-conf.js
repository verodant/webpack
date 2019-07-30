(function (System) {
    /**
     * Plyfill para Node.prototype.forEach.
     * @TODO crear proyecto con los polyfills y configuraciones para su propia admnitracion
     */
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }
    /**
     * Variables para esta clase
     */
    var currentScript = document.currentScript || document.querySelector('script[data-host][data-api]');
    var APIHOST = currentScript.dataset.api;
    var STATICHOST = currentScript.dataset.host;
    var BASEPATH = '/dist/js';

    /**
     * Gestionamos la Base de datos
     */

    var getFileListVersion = (function () {
        return fetch('//' + APIHOST + '/service/file/csum/version', {
            mode: 'cors'
        })
            .then(function (res) { return res.json() })
            .then(function (jsonData) { return jsonData.data });
    })();

    var BBDDCSUMNAME = 'csum';
    var BBDDCSUM = indexedDB.open(BBDDCSUMNAME, 1);

    BBDDCSUM.promised = new Promise(function (success) {
        BBDDCSUM.onsuccess = function (event) {
            let db = event.target.result;
            return getAndUpdateData(db).then(function () {
                success(db);
            });
        }
    });

    BBDDCSUM.onerror = function (event) {
        console.warn('hubo un error con indexedDB', event);
    };

    BBDDCSUM.onupgradeneeded = function (event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'file' });
        if (!db.objectStoreNames.contains('version')) db.createObjectStore('version');
    };

    function getAndUpdateData(db) {
        return new Promise(function (success) {
            Promise.all([
                getFileListVersion,
                new Promise(function (success) {
                    db.transaction('version', 'readonly').objectStore('version').get('current_version').onsuccess = function (e) {
                        success(e.target.result || null);
                    }
                })
            ]).then(function (values) {
                var currentVersion = values[0];
                var storedVersion = values[1];
                if (currentVersion === storedVersion) success();
                else fetch('//' + APIHOST + '/service/file/csum/list', {
                    mode: 'cors'
                })
                    .then(function (res) { return res.json() })
                    .then(function (jsonData) { return jsonData.data }).then(function (files) {
                        var fileStore = db.transaction('files', 'readwrite').objectStore('files');
                        files.forEach(function (fileItem) { fileStore.put(fileItem) });
                        var versionStore = db.transaction('version', 'readwrite').objectStore('version');
                        versionStore.put(String(storedVersion), 'previus_version');
                        versionStore.put(String(currentVersion), 'current_version');
                        console.log('Actualizanda la BBDD de archivos...');
                        success();
                    });
            });
        });

    }

    /**
     * Añadimos funcionalidad para incluir los archivos como script y
     * sin crossdomain
     */
    /* constrolamos el registro por si falla */
    var err$1;
    if (typeof window !== 'undefined')
        window.addEventListener('error', function (e) {
            err$1 = e.error;
        });

    var systemRegister = System.constructor.prototype.register;
    System.constructor.prototype.register = function (deps, declare) {
        err$1 = undefined;
        systemRegister.call(this, deps, declare);
    };

    /* Cambiamos el metodo para crear estancias para que funcione sin crossdomain*/
    System.constructor.prototype.instantiate = function (url, firstParentUrl) {
        var loader = this;
        /* return Promise.resolve(fetch('//' + STATICHOST + BASEPATH + url, {mode: 'cors',credentials: 'include'})); */
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.charset = 'utf-8';
            script.async = true;
            script.addEventListener('error', function () {
                reject(new Error('Error loading ' + url + (firstParentUrl ? ' from ' + firstParentUrl : '')));
            });

            script.addEventListener('load', function () {
                document.head.removeChild(script);
                if (err$1) return reject(err$1);
                else resolve(loader.getRegister());
            });
            script.src = '//' + STATICHOST + BASEPATH + url;
            document.head.appendChild(script);
        });
    };

    var originalResolve = System.constructor.prototype.resolve;
    System.constructor.prototype.resolve = function (actual, parent) {
        return Promise.resolve(originalResolve.call(this, actual, parent))
            .then(function (url, parent) {
                if (url.indexOf('/libraries/') > -1) return url;
                if (url.indexOf(STATICHOST) < 0) url = url = url.replace(location.protocol + '//' + location.host, '');
                return new Promise(function (success) {
                    BBDDCSUM.promised.then(function (db) {
                        db.transaction('files', 'readonly').objectStore('files').get(BASEPATH + url).onsuccess = function (e) {
                            if (!e.target.result) console.warn('no hay hash para' + url + '; si es un pollyfill omitirlo');
                            else success(url + (url.indexOf('?') < 0 ? '?' : '&') + 'csum=' + e.target.result.fileChecksum);
                        }
                    })
                })
            })
    };

    System.import('/common/init.js');
})(System);