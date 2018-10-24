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


/**
 * On va commencer par stocker les pages dans une variable ici.
 * 
 * Puis on reliera à une API par la suite.
 * 
 * On retient aussi ici le livre actuel, qui sera lui aussi plus tard donné par API
 */
var api = [
    {
        "nom": "SAO manga",
        "couv": "img/SAO/couv.png",
        "pages": [
            "img/SAO/001.png",
            "img/SAO/002.png",
            "img/SAO/003.png",
            "img/SAO/004.png",
            "img/SAO/005.png",
            "img/SAO/006.png",
        ]
    },
    {
        "nom": "SAO light novel",
        "couv": "img/SAO_ln/couv.png",
        "pages": [
            "img/SAO_ln/001.png",
            "img/SAO_ln/002.png",
            "img/SAO_ln/003.png",
            "img/SAO_ln/004.png",
            "img/SAO_ln/005.png",
            "img/SAO_ln/006.png",
        ]
    },
    {
        "nom": "Overlord",
        "couv": "img/Overlord/couv.png",
        "pages": [
            "img/Overlord/001.png",
            "img/Overlord/002.png",
            "img/Overlord/003.png",
            "img/Overlord/004.png",
            "img/Overlord/005.png",
            "img/Overlord/006.png",
        ]
    },
    {
        "nom": "Danmachi",
        "couv": "img/Danmachi/couv.png",
        "pages": [
            "img/Danmachi/001.png",
            "img/Danmachi/002.png",
            "img/Danmachi/003.png",
            "img/Danmachi/004.png",
            "img/Danmachi/005.png",
            "img/Danmachi/006.png",
        ]
    };
];

var actual = {
    "book": api[1],
    "page": {
        "begin": 2,
        "end": 3
    }
};

// Ici, emit prend une string
// Qui correspond à la fois au nom de l'event
// Et à l'id du component auquel il est rattaché
AFRAME.registerComponent('emit', {
    schema: {type: 'string'},
    init: function () {
        var eventToEmit = this.data;
        document.getElementById(eventToEmit).emit(eventToEmit);
        console.log(eventToEmit);
    }
});

/**
 * On écoute les différents events
 * A chaque fois on switch lastSeen 
 * pour savoir quelle page afficher à présent.
 * Puis on update sa valeur.
*/
document.addEventListener('start', (e) => handleStart('marker-001', 'marker-002'));
document.addEventListener('middle', (e) => handleMiddle('marker-003', 'marker-004'));
document.addEventListener('end', (e) => handleEnd('marker-005', 'marker-006'));

/**
 * Les fonctions de gestion des événements de pop in
 */
function handleStart (marker0, marker1) {
    if (lastSeen == 'start') return;
    else {
        switch (lastSeen) {
            case 'end': 
                nextPage();
                updateMarkers(marker0, marker1);
                break;
            case 'middle': 
                prevPage();
                updateMarkers(marker0, marker1);
                break;
            case 'none':
            case 'couv':
            case 'menu':
                actualPage();
                updateMarkers(marker0, marker1);
                break;
            default: 
                console.error('Error while looking for last seen pages. Last seen is none of start, middle or end.');
                console.error('Last seen is: '+lastSeen);
        }
        lastSeen = 'start';
    }
}

function handleMiddle (marker0, marker1) {
    if (lastSeen == 'middle') return;
    else {
        switch (lastSeen) {
            case 'start': 
                nextPage();
                updateMarkers(marker0, marker1);
                break;
            case 'end': 
                prevPage();
                updateMarkers(marker0, marker1);
                break;
            case 'none':
            case 'couv':
            case 'menu':
                actualPage();
                updateMarkers(marker0, marker1);
                break;
            default: 
                console.error('Error while looking for last seen pages. Last seen is none of middle, middle or end.');
                console.error('Last seen is: '+lastSeen);
        }
        lastSeen = 'middle';
    }
}

function handleEnd (marker0, marker1) {
    if (lastSeen == 'end') return;
    else {
        switch (lastSeen) {
            case 'middle': 
                nextPage();
                updateMarkers(marker0, marker1);
                break;
            case 'start': 
                prevPage();
                updateMarkers(marker0, marker1);
                break;
            case 'none':
            case 'couv':
            case 'menu':
                updateMarkers(marker0, marker1);
                break;
            default: 
                console.error('Error while looking for last seen pages. Last seen is none of end, middle or end.');
                console.error('Last seen is: '+lastSeen);
        }
        lastSeen = 'end';
    }
}


/**
 * Les fonctions qui feront la liaison avec l'API,
 * pour donner les pages à afficher
 */

function nextPage() {
    actual = {
        "book": actual.book,
        "page": {
            "begin": (actual.page.begin < actual.book.pages.length-3)? actual.page.begin+2 : actual.page.begin,
            "end": (actual.page.end < actual.book.pages.length-3)? actual.page.end+2 : actual.page.end
        }
    };

    return actual;
}

function prevPage() {
    actual = {
        "book": actual.book,
        "page": {
            "begin": (actual.page.begin>1)? actual.page.begin-2 : actual.page.begin,
            "end": (actual.page.end>1)? actual.page.end-2 : actual.page.end
        }
    };

    return actual;
}

function actualPage() {
    return actual;
}

/**
 * Fonction qui update l'affichage sur les marqueurs dont les id sont passés en paramètres.
 * 
 * Il switch le type des marqueurs (couv, ...) et va chercher actual pour les infos.
 */
function updateMarkers(marker0, marker1) {
    document.getElementById(marker0).setAttribute('image', 'src', actual.book.pages[actual.page.begin]); 
    document.getElementById(marker1).setAttribute('image', 'src', actual.book.pages[actual.page.end]); 
}