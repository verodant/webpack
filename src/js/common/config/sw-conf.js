/**
 * Constantes y variables
 */
const APPSHELLFILES = []; // Listado de archivos de pre-caching para el App Shell
const CACHE_NAME = 'ElConfi-v0'; //Nombre de la cache del site
const STATICHOST = 'www.ecestaticos.dev';
const BASE_PATH = '/build';
const BASE_PATH_JS = BASE_PATH + '/js';
const BASE_PATH_cSS = BASE_PATH + '/css';
const FILE_VERSION_NAME = 'sh1-file-change-version.txt'
const FILE_LIST_NAME = 'sh1-file-change.json'

importScripts('https://' + STATICHOST + BASE_PATH + '/js/common/config/idb-conf.js');


/**
 * Captura de eventos del ciclo de vida del SW
 */
self.addEventListener('fetch', fetch__ACTION);
self.addEventListener('message', message__ACTION);
self.addEventListener('install', install__ACTION);
self.addEventListener('push', push__ACTION);

/**
 * @description Helper para comprobar si la peticion es nuestra, es de un estatico y es una peticion GET
 * @function
 * @param {Response} fetchRequest
 */
const isOwnJsOrCss = (fetchRequest) => {
    const ret = (fetchRequest.url.includes(STATICHOST) && fetchRequest.method === 'GET')
        && (fetchRequest.destination === 'script' || fetchRequest.destination === 'style')
    return ret;

}

/**
 * @description Helper que devuelve un objeto con las diferentes partes destructuradas de una url
 * @function
 * @param {String} url
 */
const getUrlObject = (url) => /(?<protocol>http[s]?:\/\/)?(?<domain>[^\/\s]+)(?<path>.*)/.exec(url).groups;

/**
 * @description Helper que Wrapea en una promesa una peticion con callback de error y de sucedido
 * @function
 * @param {*} req
 */
const promisedRequest = (req) => {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * @description Prepara el sufijo que añadimos a los js para evitar cacheos y lo pide
 * @function
 * @param {Response} fetchRequest
 * @returns {Response}
 */
const getFileWithChecksum = async (fetchRequest) => {
    const fileId = getUrlObject(fetchRequest.url).path;
    const db = await BBDDCSUM.promised;
    const objectStore = await db.transaction('files', 'readonly').objectStore('files');
    const url = await promisedRequest(objectStore.get(fileId));
    const urlWithCsum = fetchRequest.url + (fetchRequest.url.indexOf('?') < 0 ? '?' : '&') + 'csum=' + url.fileChecksum;
    return fetchAndCacheFile(urlWithCsum);
}

/**
 * @description Devueleve de la cache un archivo y si no lo tiene, lo pide al servidor
 * @function
 * @param {Response | String} url o objeto Response de una peticion
 */
const fetchAndCacheFile = async (url) => {
    return caches
        .open(CACHE_NAME)
        .then(cache => cache.match(url)
            .then(response => {
                if (response) return response;
                return fetch(url, {mode: 'cors'})
                    .then((netResponse) => {
                        cache.put(url, netResponse.clone());
                        return netResponse;
                    })
                    .catch((err) => {
                        console.error('Error al traer del servidor', err);
                        throw err;
                    })
            })
        )
}

/**
 * Acciones del ciclo de vida del SW
 */

async function fetch__ACTION(e) {
    if (isOwnJsOrCss(e.request)) e.respondWith(getFileWithChecksum(e.request));
    /** esto camputa todo para modo ofline, hay que poner estrategias para cada tipo*/
    else e.respondWith(fetchAndCacheFile(e.request));

}

async function message__ACTION(e) {

    switch (e.data) {
        case 'check-version':
            getAndUpdateData(await BBDDCSUM.promised);
            break;
        case 'preload-file':
            console.log(e);
            break;
    }
}

async function install__ACTION(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(APPSHELLFILES);
            })
    );
}

async function push__ACTION(event) {
    console.log('esto es un evento push-> ', event);
}