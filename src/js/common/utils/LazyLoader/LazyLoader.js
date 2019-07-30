
/** Si no admite IntersectionObserver, incluimos el polyfill ddd  dd */
if (typeof IntersectionObserver === 'undefined') import('/common/libs/polyfill/intersection-observer.js');

/**
 * Constante con la configuración por defecto
 */
const INTERSECTION_DEFAULT_OPTIONS = {
    rootMargin: '0px 0px 50px 0px',
    threshold: 0
};

/**
 * @description Clase para controlar que cargue en diferido
 */
export class LazyLoader {
    /**
     * @param {HTMLCollection} items Items a observar
     * @param {Object} config Configuracion para el IntersectionObserver
     */
    constructor(items = [], config = {}) {
        this.items = [...items];
        this._config = config;
    }

    /** 
    * @desc Getter del estatico con la configuracion default del IntersectionObserver
    * @name LazyLoader#get:INTERSECTION_DEFAULT_OPTIONS
    * @static
    * @methodOf LazyLoader# 
    * @param {Object} config Configuracion necesaria para IntersectionObserver
    */
    static get INTERSECTION_DEFAULT_OPTIONS() { return INTERSECTION_DEFAULT_OPTIONS; }

    /** 
    * @desc Getter para devolver la configuracion necesaria para IntersectionObserver.
    * @name LazyLoader#get:config
    * @function
    * @methodOf LazyLoader# 
    * @param {Object} config Configuracion necesaria para IntersectionObserver
    */
    get config() { return Object.assign({}, INTERSECTION_DEFAULT_OPTIONS, this._config); }

    /** 
    * @desc Setter para cambiar la configuracion necesaria para IntersectionObserver.
    * @name LazyLoader#set:status
    * @function
    * @methodOf Subject# 
    * @param {Object} config Objecto de configuracion para IntersectionObserver
    */
    set config(config) { this._config = config }

    /** 
    * @desc Getter para devolver la estancia de IntersectionObserver.
    * @name LazyLoader#get:observer
    * @function
    * @methodOf LazyLoader# 
    * @param {IntersectionObserver} observer Devuelve el IntersectionObserver
    */
    get observer() {
        return this._observer || (this._observer = new IntersectionObserver((entries, self) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this._preload(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, this.config))
    }

    /**
     * @desc callback que sucedera cuando se cumpla la coincidencia de la interseccion.
     * @function
     * @methodOf LazyLoader# 
     * @param {HTMLElement} item item que se cargara cuando sea invocaco el metodo
     */
    _preload(item) {
        console.warn('no hay callback setteado');
    }

    /**
     * @desc Setter para cambiar la funcion de callback.
     * @function
     * @methodOf LazyLoader# 
     * @param {HTMLElement} item item que se cargara cuando sea invocaco el metodo
     */
    setCallback(fn) {
        if (false === fn instanceof Function) throw Error('se necesita una <Function> como callback');
        this._preload = fn;
    }

    /**
     * @desc Añade un item que observa
     * @function
     * @methodOf LazyLoader# 
     * @returns {LazyLoader}
     * @param {HTMLElement} item Item que se añade como observer
     */
    addItem(item) {
        if (false === item instanceof HTMLElement) throw Error('no se puede observar un elemnto que no sea un <HTMLElement>');
        if (!this.items.includes(item)) this.items.push(item);
        this.observer.observe(item);
        return this;
    }

    /**
     * @desc Borra un item que observa
     * @function
     * @methodOf LazyLoader# 
     * @returns {LazyLoader}
     * @param {HTMLElement} item Item que se borrara como observer
     */
    removeItem(item) {
        this.items = this.items.filter(node => node != item);
        this.observer.unobserve(item);
        return this;
    }

    /**
     * @desc ejecuta el script y añade todos los items que haya en items
     * @function
     * @returns {LazyLoader}
     * @methodOf LazyLoader# 
     */
    run() {
        this.items.forEach(item => { this.addItem(item) });
        return this;
    }

}