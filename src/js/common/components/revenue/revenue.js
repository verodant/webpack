
/**
 * @access public
 * @desc This component manage some behaviors about ads
 * @type {function} IIFE
 */
export const revenue = (function() {
    /** @type {string} */
    const revenueCustomProp = '--revenue-margin';
    /** @type {HTMLNodeElement} */
    const root = document.documentElement;
    /** @type {HTMLNodeElement} */
    const revenueCustomPropValue = getComputedStyle(root).getPropertyValue(revenueCustomProp);

    /**
     * @private
     * @type {function} check if secondHeader is visible | sticked
     * @param {object} props - this is event props
     */
    const _testSecondHeaderSticked = props => {
        const secondHeader = props.detail.collider;

        return secondHeader.className === 'secondaryHeader';
    };

    /**
     * @type {function} set new block ads position if second header is visible or sticked
     * @param {object} props - this is event props
     */
    const setRevenueTopPosition = props => {
        const isSecondHeaderSticked = _testSecondHeaderSticked(props);

        if (isSecondHeaderSticked) {
            root.style.setProperty(revenueCustomProp, revenueCustomPropValue);
        } else {
            root.style.setProperty(revenueCustomProp, 85 + 'px');
        }
    };

    /**
     * @type {function}
     * @listens { click } listen event to set new position of ads when second header is visible
     */
    document.addEventListener('sticky-changed', setRevenueTopPosition);

    /**
     * @type {object}
     * @return {{setRevenueTopPosition: function}}
     */
    return {
        setRevenueTopPosition
    }

})();