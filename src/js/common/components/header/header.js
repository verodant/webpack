import { Sticky } from '@Common/components/sticky/sticky.js'
import { Accordion } from '@Common/components/accordion/accordion.js'

/**
 * @access public
 * @desc This component manage header and subheader behaviors
 * @type {function} IIFE
 */
export const header = (function() {

    /** @type {string} */
    const seoMenuActiveClass = 'seoMenu--isOpened';
    /** @type {HTMLNodeElement} */
    let menuBtn = document.querySelector('.seoMenu__openBtn');
    /** @type {HTMLNodeElement} */
    let closeBtn = document.querySelector('.seoMenu__closeButton');
    /** @type {HTMLNodeElement} */
    let seoMenu = document.querySelector('.seoMenu');

    /**
     * @type {function}
     * @emits {click} emit event when the user clicks on open menu
     */
    const openSeoMenuButton = () => seoMenu.classList.add(seoMenuActiveClass);

    /**
     * @type {function}
     * @emits {click} emit event when the user clicks on close menu
     */
    const closeSeoMenuButton = () => seoMenu.classList.remove(seoMenuActiveClass);

    /**
     * @type {function} set second header sticky
     */
    const setSecondaryHeaderSticky = () => {
        new Sticky({
            sentinel: '.innerArticle__bar',
            collider: '.secondaryHeader',
            classCollider: 'secondaryHeader--isActive',
            eventBubbling: true
        });
    };

    /**
     * @type {function} Init the subsection accordion
     */
    const initHeaderAccordion = () => {
        const triggers = document.querySelectorAll('.seoMenuList__sectionMore');
        const containers = [];
        const openClass = 'isActive';
        const targets = [];

        [...triggers].forEach( (trigger, index) => {
            containers.push(trigger.closest('.seoMenuList__item'))
            targets.push(containers[index].querySelector('.seoMenuList__subList'))
        })

        return new Accordion(containers, targets, triggers, openClass);
    }

    /**
     * @type {function} Init footer accordion
     */
    const initFooterAccordion = () => {
        const openClass = 'sectionsFooter__section--isActive';
        let triggers;
        const containers = triggers = document.querySelectorAll('.sectionsFooter__section--trigger');
        const targets =  document.querySelectorAll('.sectionsFooter__section--sections');
        return new Accordion(containers, targets, triggers, openClass);
    }

    /**
     * @type {function}
     * @listens {click} listen event to open menu
     */
    menuBtn.addEventListener('click', openSeoMenuButton);

    /**
     * @type {function}
     * @listens {click} listen event to close menu
     */
    closeBtn.addEventListener('click', closeSeoMenuButton);

    /**
     * @type {object}
     * @return {{openSeoMenuButton: function, closeSeoMenuButton: function, setSecondaryHeaderSticky: function}}
     * @example
     * const openMenu = header.openSeoMenuButton();
     */
    return {
        openSeoMenuButton,
        closeSeoMenuButton,
        setSecondaryHeaderSticky,
        initHeaderAccordion,
        initFooterAccordion
    }
})();
