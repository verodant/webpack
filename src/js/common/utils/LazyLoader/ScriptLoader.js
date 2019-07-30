import { LazyLoader } from './LazyLoader.js';

/**
 * Constante con la estancia para singleton
 */
let INSTANCE = null;

/**
 * @description Clase para controlar la carga perezosa de scripts
 */
export class ScriptLoader extends LazyLoader {
    /**
    * @param {String} propName selector de propiedad para encontrar los scripts
    */
    constructor(propName = 'data-href') {
        if (INSTANCE) return INSTANCE;
        super(document.querySelectorAll(`link[${propName}]`));
        INSTANCE = this;
    }

    /**
     * @desc Añade un item que observa
     * @function
     * @methodOf ScriptLoader# 
     * @returns {ScriptLoader}
     * @param {HTMLScriptElement} item Item que se añade como observer
     */
    addItem(item) {
        if (false === item instanceof HTMLScriptElement) throw Error('Este metodo solo admite <HTMLScriptElement>');
        super.addItem(item);
    }

    /**
     * @desc callback opara hacer el cambio del url para el script.
     * @function
     * @methodOf ScriptLoader# 
     * @param {HTMLScriptElement} item item que se cargara cuando sea invocaco el metodo
     */
    _preload(item) {
        item.href = item.dataset.href;
        return this;
    }
}