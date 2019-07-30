# Componente 'header'
Este 'componente' es el header principal del site, sus partes son:
- Menu
- Search bar
- Logo
- Log in | Sign up

### Implementación:
Este componente de momento solo contiene funcionalidad de open/close en la parte del menú, con importar el fichero js desde un lugar 'común' a la aplicación es suficiente.

```javascript
import '/common/components/header/header.js';
```
o si quieres traerte el header para usar sus métodos expuestos:

```javascript
import { header } from '/common/components/header/header.js';
```

### Evolución del componente:
- Ver si podemos pintar también la template
- Traernos el CSS

