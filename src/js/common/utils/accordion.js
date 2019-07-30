
//Get hash URL
const hash = location.hash.substr(1);

const goToLink = (anchor) => {

    if(anchor) {
        window.scrollTo({
            top: anchor.offsetTop || anchor.offsetParent.offsetTop,
            behavior: 'smooth'
        });
    }
} 

const collapseAll = () => {
    let allAccordion = document.querySelectorAll('.accordion__list--item');
    allAccordion.forEach(function (item) {
        item.classList.add( 'collapsed' );
    });
}


collapseAll();

if (hash) {
    let target = document.getElementById(hash);
    setTimeout(() => {
        target.classList.remove( 'collapsed' );
        goToLink(target);
    }, 100);
}

document.addEventListener('click', (event) => {

    if ( !event.target.classList.contains( 'accordion__toggle' ) ) { return };

    event.preventDefault();

    let anchor = event.target;
    let container = anchor.parentNode.parentNode;

    //Si está abierto lo cierra
    if ( !container.classList.contains('collapsed')) {
        container.classList.add( 'collapsed' );
        return;
    }

    //Cierra todos 
    collapseAll();
    //Abre el clickado
    container.classList.remove( 'collapsed' );
    //Posiciona el elemento arriba
    setTimeout(() => {
        goToLink(anchor);
    }, 100);

}, false);
