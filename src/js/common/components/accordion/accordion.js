/**
 * @export
 * @class Accordion
 * @description Componente Acordeón
 *
 */
export class Accordion {

    /**
     * Creates an instance of Accordion
     * @param {containers} Array
     * @param {targets} Array
     * @param {triggers} Array
     * @param {openClass} String
     * @memberof Accordion
     * @property {Array.<HTMLElement>} this.containers
     * @property {Array.<HTMLElement>} this.targets
     * @property {Array.<HTMLElement>} this.triggers
     * @property {string} this.openClass
     */
    constructor(containers = [], targets = [], triggers = [], openClass) {
        this.containers = containers;
        this.targets = targets;
        this.triggers = triggers;
        this.openClass = openClass;
        [...this.triggers].forEach((trigger, index) => {
            trigger.addEventListener('click', this._onClick.bind(this, index))
        })
    }

    /**
     * @memberof Accordion
     * @function
     * @param {Number} index
     */
    _onClick(index) {
        this._closeItems(index);
        this.containers[index] && this.containers[index].classList.toggle(this.openClass);
    }
    /**
     * @memberof Accordion
     * @function
     * @param {Number} excludeIndex
     */
    _closeItems(excludeIndex){
        this.containers.forEach((target, index)=> {
            if (target && index !== excludeIndex) target.classList.remove(this.openClass);
        })
    }
}
