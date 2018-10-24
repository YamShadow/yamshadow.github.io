/**
 * 
 * Doit permettre, à la détection d'un marqueur, 
 * de décider de la page à afficher.
 * 
 * Puis, lorsque fait, aller chercher ladite page et
 * la rendre au niveau du marqueur
 * 
 * Il y aura X marqueurs, divisés en :
 *  - pair / impair (gauche / droite)
 *  - Couple 1
 *  - Couple 2
 *  - Couple 3
 * 
 * Lorsque l'on quitte couple 1 pour arriver sur couple 2
 * on tourne la page pour avancer.
 * Si on arrive à couple 3 on recule.
 * 
 * Idem pour couple 2 vers, respectivement, 3 et 1.
 * Idem pour couple 3 vers, respectivement, 1 et 2.
 * 
 * Il y aura aussi 4 marqueurs pour les 4 pages de couverture.
 * Il faudra donc trouver les infos.
 * 
 */

/**
 * lastSeen retient la dernière combinaison de page vue :
 *  - none : quand rien n'a été vu
 *  - start : quand on voit L ou I
 *  - middle : quand on voit V ou R
 *  - end : quand on voit E ou S
 * 
 * Pour pouvoir savoir quoi faire.
 */
var lastSeen = 'none';




// Ici, emit prend une string
// Qui correspond à la fois au nom de l'event
// Et à l'id du component auquel il est rattaché
AFRAME.registerComponent('emit', {
    schema: {type: 'string'},
    init: function () {
        var eventToEmit = this.data;
        document.getElementById(eventToEmit).emit(eventToEmit);
    }
});
/* 
Voir pour emettre un seul event, duquel on récupèrerait e pour switch son id
*/

/**
 * On écoute les différents events
 * A chaque fois on switch lastSeen 
 * pour savoir quelle page afficher à présent.
 * Puis on update sa valeur.
*/
document.addEventListener('marker-L', handleStart);
document.addEventListener('marker-I', handleStart);
document.addEventListener('marker-V', handleMiddle);
document.addEventListener('marker-R', handleMiddle);
document.addEventListener('marker-E', handleEnd);
document.addEventListener('marker-S', handleEnd);

// TODO : Remplacer par <img>

function handleStart (event) {
    if (lastSeen == 'start') event.preventDefault();
    else {
        switch (lastSeen) {
            case 'end': 
                document.getElementById(event.realTarget.id).setAttribute('text', 'value', nextPage()); 
                break;
            case 'middle': 
                document.getElementById(event.realTarget.id).setAttribute('text', 'value', prevPage()); 
                break;
            case 'none':
            case 'couv':
            case 'menu':
                document.getElementById(event.realTarget.id).setAttribute('text', 'value', actualPage()); 
                break;
            default: 
                console.error('Error while looking for last seen pages. Last seen is none of start, middle or end.');
                console.error('Last seen is: '+lastSeen);
        }
        lastSeen = 'start';
    }
}