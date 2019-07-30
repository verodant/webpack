/**
 * @export
 * @class MenuSeo
 * @description Componente MenuSeo
 * 
 */
export class MenuSeo {

    /**
     * Creates an instance of MenuSeo
     * @param {String} jsonFile  
     * @param {String} idMenu
     * @memberof MenuSeo
     * @property {object} this.jsonObject 
     */
    constructor(jsonFile, idMenu) {

        this.jsonFile = jsonFile;
        this.jsonObject = {};
        this.idMenu = idMenu;

        this._loadSubsection();

    }

    /**
     * @memberof MenuSeo
     * @function
     */
    async _readJSON() {

        let response = await fetch(this.jsonFile);
        this.jsonObject = await response.json();
    }

    /**
     * @memberof MenuSeo
     * @function
     */
    async _loadSubsection() {

        await this._readJSON(this.jsonFile);

        for(let subsection in this.jsonObject) {

            const subsectionFormatted = this.formatSubsectionName(subsection);
            const nodeListItem = document.querySelector(`.seoMenuList__item--${subsectionFormatted}`);
            const subsections = this.jsonObject[subsection].subsections;

            if (!subsections.length) continue;

            this.setIconArrow({
                listItem: nodeListItem
            });

            let subsectionsList = this.makeSubsectionsList({
                subsections: subsections,
                isActive: this.jsonObject[subsection].default
            });

            if(nodeListItem) nodeListItem.innerHTML += subsectionsList || '';

        }

        const loaded = new CustomEvent('menuJson:loaded');
        document.dispatchEvent(loaded);
    }

    formatSubsectionName(subsection) {
        return subsection.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    makeSubsectionsList(props) {
        if (props.isActive) return;

        let subsectionList = '';

        props.subsections.forEach(subsection => {

            const subsectionListItem = `<li class="seoMenuList__subListItem">
                                            <a class="seoMenuList__subListSection" href="${subsection.url}">${subsection.literal}</a>
                                        </li>`;

            subsectionList += subsectionListItem;
        });

        return `<ul class="seoMenuList__subList">${subsectionList}</ul>`;
    }

    setIconArrow(props) {
        if(!(props.listItem) || (props.listItem.querySelector('.seoMenuList__sectionMore'))) return;

        const arrow = `<span class="seoMenuList__sectionMore"></span>`;

        let menuListSection = props.listItem.querySelector('.seoMenuList__section');

        menuListSection.innerHTML += arrow;
    }
}

