
/**
 * @export
 * @class Sticky
 * @description Componente sticky
 */

export class Sticky {
    /**
     * Creates an instance of Sticky
     * @param {props} Object
     * @memberof Sticky
     * @property {object} this.observer
     * @property {HTMLNodeElement} this.sentinel
     * @property {HTMLNodeElement} this.collider
     * @property {string} this.classCollider
     * @property {boolean} this.bubbles
     */
    constructor(props = {}) {
        this.observer = {};
        this.sentinel = document.querySelector(props.sentinel);
        this.collider = document.querySelector(props.collider);
        this.classCollider = props.classCollider || 'colliding';
        this.bubbles = props.eventBubbling || false;

        this.setUpObserver({
            root: props.root || null,
            rootMargin: props.rootMargin || '0px',
            threshold: props.threshold || [1]
        });
    }

    /**
     * @memberof Sticky
     * @function
     * @param {Object} props
     */
    setUpObserver(props) {
        this.observer = new IntersectionObserver((entries, observer) => this.actions(entries, observer), props);

        this.observe();
    }

    /**
     * @memberof Sticky
     * @function
     */
    observe() {
        this.observer.observe(this.sentinel);
    }

    /**
     * @memberof Sticky
     * @function
     */
    unobserve() {
        this.observer.unobserve(this.sentinel);
    }

    /**
     * @memberof Sticky
     * @function
     * @param {Array.<IntersectionObserverEntry>} entries
     */
    actions(entries) {
        entries.forEach(entry => {
            if(entry && entry.isIntersecting) {
                this.collider.classList.remove(this.classCollider);

                this._dispatchEvent(this.collider, entry);

            } else {
                this.collider.classList.add(this.classCollider);

                this._dispatchEvent(this.collider, entry);
            }
        });
    }

    /**
     * @memberof Sticky
     * @function
     * @param {HTMLNodeElement} collider
     * @param {Object} observerEntry
     */
    _dispatchEvent(collider, observerEntry) {

        const customEvent = new CustomEvent('sticky-changed', {
            detail: {
                collider,
                observerEntry
            },
            bubbles: this.bubbles
        });

        collider.dispatchEvent(customEvent);
    }
}