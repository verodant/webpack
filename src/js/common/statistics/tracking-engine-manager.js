import ElementTrackingHandler from './element-tracking-handler.js';

/**
 * Constantes y variables de Modulo
 */
let INSTANCE;

/**
 * Manager del motor de analítica
 *
 * @class TrackingEngineManager
 */
export class TrackingEngineManager {
    /**
     *Creates an instance of TrackingEngineManager.
     * @memberof TrackingEngineManager
     */
    constructor() {
        if (INSTANCE) return INSTANCE;
        INSTANCE = this;
        this._setMutationObserverListener();
        this._setElementTrackingHandler(document.body);
    }

    /**
     *  Busca y añade engine de marcado a un nodo HTMLElement
     *
     * @param {HTMLElement} node
     * @memberof TrackingEngineManager
     */
    _setElementTrackingHandler(node) {
        if (!!node.querySelectorAll) {
            node = node.parentNode || node;
            Array.prototype.forEach.call(node.querySelectorAll('[data-track-analytics-event]'), element => new ElementTrackingHandler(element));
        }
    }

    /**
     * añade el ObserverMutation para q se dispare siempre que haya un cambio dentro del body
     *
     * @memberof TrackingEngineManager
     */
    _setMutationObserverListener() {
        let target = document.querySelector('body');
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                this._setElementTrackingHandler(mutation.target);
            });
        });
        let config = { subtree: true, childList: true, attributes: true, attributeFilter: ['data-track-analytics-event'] };
        observer.observe(target, config);
    }
}

new TrackingEngineManager();