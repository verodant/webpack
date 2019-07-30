/**
 * Constantes y variables de Modulo
 */
const INSTANCES = new WeakMap();
const EGINESCOMMANDPATH = '/engines/commands';
/**
 *
 *
 * @export
 * @class ElementTrackingHandler
 */
export default class ElementTrackingHandler {
    /**
     * Creates an instance of ElementTrackingHandler.
     * @param {element} HTMLNodeElement
     * @memberof ElementTrackingHandler
     */
    constructor(element) {
        if (INSTANCES.has(element)) return INSTANCES.get(element);
        INSTANCES.set(element, this);
        this.element = element;
        this.setListener();
    }

    /**
     * Añade la escucha de eventos al dom
     *
     * @memberof ElementTrackingHandler
     */
    setListener() {
        this.element.addEventListener(this.event, this.sendTracking.bind(this));
    }

    /**
     * Importa cada motor de trackeo y ejecuta su track
     * 
     * @memberof ElementTrackingHandler
     */
    sendTracking() {
        this.engines.forEach(async (engineName) => {
            const engineClass = await this._importEngine(engineName);
            engineClass.execute(this.name, this.data, this.delayed);
        });
    }
    /**
     * Importa cada clase que se encargue de traquear.
     * Necesita un metodo execute en la respuesta
     * 
     * @async
     * @param {String} engineName 
     * @memberof ElementTrackingHandler
     * @return {Promise<Class>} Dinamic Import de la clase
     */
    async _importEngine(engineName) {
        const engineClass = await import(`.${EGINESCOMMANDPATH}/${engineName}Command.js`);
        return engineClass;
    }

    /**
     * Devuelve el tipo de evento sobre el que se lanza el tracking
     *
     * @readonly
     * @memberof ElementTrackingHandler
     */
    get event() {
        return this.element.dataset.trackAnalyticsEvent;
    }

    /**
     * Devuelve el nombre del evento
     *
     * @readonly
     * @memberof ElementTrackingHandler
     */
    get name() {
        return this.element.dataset.trackAnalyticsName;
    }

    /**
     * Obtiene los datos a mandar en el evento
     *
     * @readonly
     * @memberof ElementTrackingHandler
     * @return Object
     */
    get data() {
        try {
            let trackData = this.element.dataset.trackAnalyticsData;
            return trackData ? JSON.parse(trackData) : {};
        } catch (err) {
            throw new Error(`Track data format is not valid.
            Error:${err.message}`);
        }
    }

    /**
     * Indica si el evento se tiene que enviar tras navegar
     *
     * @readonly
     * @memberof ElementTrackingHandler
     * @return Object
     */
    get delayed() {
        return this.element.hasAttribute("data-track-analytics-delayed");
    }

    /**
     * Obtiene los motores de analítica
     *
     * @readonly
     * @memberof ElementTrackingHandler
     * @return Array<String>
     */
    get engines() {
        let engines = this.element.dataset.trackAnalyticsEngines;
        if (!engines) throw new Error('Tracking engine not defined');
        return engines.toLowerCase().split(',');
    }
}
