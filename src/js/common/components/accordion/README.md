# Componente 'acordeón'
Este componente se encarga de 

### Requisitos:
1. Un elemento que actue de trigger del accordeon
2. Un elemento contenedor que reciba una clase de activación de la visibilidad

### Propiedades
1. **containers**: Recibe la clase de activación para que actúe el CSS.
2. **targets** (ver TODO): Elemento real que recibe css inline si fuera necesario.
3. **triggers**: Elemento que recibe la acción del click y desencadena el acordeón.
4. **openClass**: Clase que reciben los containers.


### Implementación:

```javascript
import { Accordion } from '/common/components/accordion/accordion.js';

const accordion = new Accordion(containers, targets, triggers, openClass);
```

### Consideraciones
Hayq ue crear el array de containers y targets según los triggers existentes para que haya concordancia entre todos los arrays y que la clase pueda relacionarlos mediante index

### TODO:
Activar la opción "targets" para capturar la altura de css y actuar directamente sobre los elementos y no mediante la clase.
