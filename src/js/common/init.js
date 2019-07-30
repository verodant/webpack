/**
 * Archivo que se carga en todos los aplicativos e inicializa la configuracion
 *  y scripts que deben de cargar
 */

/* Script que queremos se cargue ne todos los proyectos */
import '/common/statistics/tracking-engine-manager.js';
import { AmplitudeEvent } from "/common/statistics/engines/AmplitudeEvent.js";

new AmplitudeEvent();


import {App} from '@App-shell/CoreShell.js';
import { revenue } from '@Common/components/revenue/revenue.js';
import { header } from '@Common/components/header/header.js';

import {MenuSeo} from '@Common/components/menu_seo/menu_seo.js';
/* import { EventEmitter } from '/Core/EventEmitter.js'; */




header.setSecondaryHeaderSticky();
document.addEventListener('menuJson:loaded', () => {
    header.initHeaderAccordion();
})

header.initFooterAccordion();

const MenuJson = new MenuSeo('//www.ecestaticos.dev/build/menu.json', '#seoMenuList');


const defineIdleProperty =  require('idlize/defineIdleProperty');