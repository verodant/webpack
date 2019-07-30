(function (System) {

    /**
     * Variables para esta clase
     */
    var currentScript = document.currentScript || document.querySelector('script[data-host][data-api]');
    var STATICHOST = currentScript.dataset.host;
    var BASEPATH = '/build/js';


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
                /** probar que no falle cuando se pida desde otro domino que no sea ecestaticos */
                if (url.indexOf(STATICHOST) < 0) url = url.replace(location.protocol + '//' + location.host, '');
                return url;
            })
    };

    System.import('/common/init.js');
})(System);
