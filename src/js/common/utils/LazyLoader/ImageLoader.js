import { LazyLoader } from './LazyLoader.js';

/**
 * Constante con la estancia para singleton
 */
let INSTANCE = null;

/**
 * @description Clase para controlar la carga perezosa de imagenes
 */
export class ImageLoader extends LazyLoader {
    /**
    * @param {String} propName selector de propiedad para encontrar las imagenes
    */
    constructor(propName = 'data-src') {
        if (INSTANCE) return INSTANCE;
        super(document.querySelectorAll(`img[${propName}]`));
        INSTANCE = this;

    }

    /**
     * @desc Añade un item que observa
     * @function
     * @methodOf ImageLoader# 
     * @returns {ImageLoader}
     * @param {HTMLImageElement} item Item que se añade como observer
     */
    addItem(item) {
        if (false === item instanceof HTMLImageElement) throw Error('Este metodo solo admite <HTMLImageElement>');
        item.style.display = 'block';
        return super.addItem(item);
    }

    /**
     * @desc callback opara hacer el cambio de imagen.
     * @function
     * @methodOf ImageLoader# 
     * @param {HTMLImageElement} item item que se cargara cuando sea invocaco el metodo
     */
    _preload(item) {
        item.src = item.dataset.src;
        return this;
    }
}