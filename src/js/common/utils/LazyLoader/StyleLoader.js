import { LazyLoader } from './LazyLoader.js';

/**
 * Constante con la estancia para singleton
 */
let INSTANCE = null;

/**
 * @description Clase para controlar la carga perezosa de estilos
 */
export class StyleLoader extends LazyLoader {
    /**
    * @param {String} propName selector de propiedad para encontrar los estilos
    */
    constructor(propName = 'data-href') {
        if (INSTANCE) return INSTANCE;
        super(document.querySelectorAll(`link[${propName}]`));
        INSTANCE = this;
    }

    /**
     * @desc Añade un item que observa
     * @function
     * @methodOf StyleLoader# 
     * @returns {StyleLoader}
     * @param {HTMLLinkElement} item Item que se añade como observer
     */
    addItem(item) {
        if (false === item instanceof HTMLLinkElement) throw Error('Este metodo solo admite <HTMLLinkElement>');
        item.style.display = 'block';
        super.addItem(item);
    }

    /**
     * @desc Borra un item que observa
     * @function
     * @methodOf LazyLoader# 
     * @returns {LazyLoader}
     * @param {HTMLElement} item Item que se borrara como observer
     */
    removeItem(item) {
        item.style.display = '';
        super.removeItem(item);
        return this;
    }

    /**
     * @desc callback opara hacer el cambio de estilos.
     * @function
     * @methodOf StyleLoader# 
     * @param {HTMLLinkElement} item item que se cargara cuando sea invocaco el metodo
     */
    _preload(item) {
        item.href = item.dataset.href;
        return this;
    }
}