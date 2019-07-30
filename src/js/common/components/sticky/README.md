# Componente 'sticky'
El objetivo de este componente es hacer más fácil a los desarrolladores el hecho de poder tener varios elementos sticky en el UI.

### Porqué no con CSS?
La primera idea de este componente era hacer un 'motor de colisiones', ya que uno de los requisitos era:

> "Poder hacer sticky cualquier elemento al interaccionar/colisionar con otro elemento del DOM"

Simplemente ya esta opción hacía que la alternativa de hacerlo por CSS se descartara.

> NOTA: No siempre que se tenga que hacer un elemento sticky hay que usar este componente, para casos que se pueda hacer con CSS, optar por algo así:

```
.element--sticky {
    position: sticky;
}
```

### Requisitos:
1. Poder tener varios elementos del DOM en sticky
2. Que el componente pueda hacer sticky, cambiar el display, etc.

### Requisitos técnicos:
1. Poder instanciar varios 'sticky'
2. El componente debe ser agnóstico, recibe propiedades y dispara eventos
3. Poder disparar observe/unobserve para dejar al desarrollador la posibilidad de desactivar/activar la funcionalidad a su antojo
4. Usar el 'Intersection Observer API', para no jugar con eventos de scroll y practicas que puedan afectar en la performance del site

### Evolución del componente:
1. Poder pasarle un array de colliders
2. Cabe la posibilidad que en un futuro evolicione a una libería de colisiones
3. Que sea más un componente:
    - package para su versionado
    - changelog
    - Si necesita css, que lo contenga

### Implementación:

```javascript
import { Sticky } from '/common/components/sticky/sticky.js';

const elementSticky = new Sticky({
    sentinel: '.elemento__centinela',
    collider: '.elemento--sticky',
    classCollider: '.class',
    eventBubbling: true,    
    root: null,             
    rootMargin: '0px',      
    threshold: [1]          
});
```

> Cada vez que el elemento 'colisione' dispara el evento `sticky-changed`, puedes escucharlo para hacer tus acciones.

### Propiedades opcionales:
- classCollider: Esta propiedad es por si le quieres poner una clase propia a tu elemento sticky.
> Por defecto añade 'colliding'

- eventBubbling: Como la propiedad sugiere, es simplemente si quieres que el evento 'sticky-changed' se propage hacia arriba
> Por defecto se establece a FALSE

- Propiedades del intersectionObserver: `root`, `rootMargin`, `treshold`

> Más información sobre el `intersectionObserver` y sus propiedades, [aquí](https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API)

