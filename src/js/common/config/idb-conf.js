console.log('cargo app de BBDD');

const getFileListVersion = function () {
    return fetch('//' + STATICHOST + BASE_PATH + '/version/' + FILE_VERSION_NAME, {
        mode: 'cors'
    })
        .then(function (res) {
            return res.text()
        })
};

const BBDDCSUMNAME = 'csum';
const BBDDCSUM = indexedDB.open(BBDDCSUMNAME, 1);

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
    const db = event.target.result;
    if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', {keyPath: 'file'});
    if (!db.objectStoreNames.contains('version')) db.createObjectStore('version');
};

function getAndUpdateData(db) {
    return new Promise(function (success) {
        Promise.all([
            getFileListVersion(),
            new Promise(function (success) {
                db.transaction('version', 'readonly').objectStore('version').get('current_version').onsuccess = function (e) {
                    success(e.target.result || null);
                }
            })
        ]).then(function (values) {
            const currentVersion = values[0];
            const storedVersion = values[1];
            if (currentVersion === storedVersion) success();
            else fetch('//' + STATICHOST + BASE_PATH + '/version/' + FILE_LIST_NAME, {
                mode: 'cors'
            })
                .then(function (res) {
                    return res.json()
                })
                .then(function (jsonData) {
                    return jsonData
                }).then(function (files) {
                    const fileStore = db.transaction('files', 'readwrite').objectStore('files');
                    files.forEach(function (fileItem) {
                        fileStore.put(fileItem)
                    });
                    const versionStore = db.transaction('version', 'readwrite').objectStore('version');
                    versionStore.put(String(storedVersion), 'previus_version');
                    versionStore.put(String(currentVersion), 'current_version');
                    console.log('Actualizanda la BBDD de archivos...');
                    success();
                });
        });
    });

}