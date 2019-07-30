import _ from 'lodash';

import {TrackingEngineManager} from './js/common/statistics/tracking-engine-manager';

console.log(TrackingEngineManager);



function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack', 'topAsync',' ']);

  return element;
}

window.addEventListener('load', ()=>{
  document.body.appendChild(component());
})
