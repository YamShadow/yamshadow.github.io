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
        "couv": "img/SAO/couv.jpg",
        "pages": [
            "img/SAO/001.jpg",
            "img/SAO/002.jpg",
            "img/SAO/003.jpg",
            "img/SAO/004.jpg",
            "img/SAO/005.jpg",
            "img/SAO/006.jpg",
        ]
    },
    {
        "nom": "SAO light novel",
        "couv": "img/SAO_ln/couv.jpg",
        "pages": [
            "img/SAO_ln/001.jpg",
            "img/SAO_ln/002.jpg",
            "img/SAO_ln/003.jpg",
            "img/SAO_ln/004.jpg",
            "img/SAO_ln/005.jpg",
            "img/SAO_ln/006.jpg",
        ]
    },
    {
        "nom": "Overlord",
        "couv": "img/Overlord/couv.jpg",
        "pages": [
            "img/Overlord/001.jpg",
            "img/Overlord/002.jpg",
            "img/Overlord/003.jpg",
            "img/Overlord/004.jpg",
            "img/Overlord/005.jpg",
            "img/Overlord/006.jpg",
        ]
    },
    {
        "nom": "Danmachi",
        "couv": "img/Danmachi/couv.jpg",
        "pages": [
            "img/Danmachi/001.jpg",
            "img/Danmachi/002.jpg",
            "img/Danmachi/003.jpg",
            "img/Danmachi/004.jpg",
            "img/Danmachi/005.jpg",
            "img/Danmachi/006.jpg",
        ]
    }
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
    tick: function () {
        for (var aimg of document.querySelectorAll('a-marker > a-image')) {
            if(aimg.object3D.visible == true) {
                switch (aimg.className) {
                    case 'start': handleStart(); break;
                    case 'middle': handleMiddle(); break;
                    case 'end': handleEnd(); break;
                    case 'none':
                    case 'couv':
                    case 'menu':
                        actualPage();
                        updateMarkers('marker-001', 'marker-002');
                        break;
                    default: 
                        console.error('Error while looking for type of marker. It is none of start, middle nor end, ...');
                        console.error('Marker type is: '+lastSeen);
                }
                console.log(aimg);
            }
        }
    }
});

/**
 * Les fonctions de gestion des événements de pop in
 */
function handleStart () {
    if (lastSeen == 'start') return;
    else {
        switch (lastSeen) {
            case 'end': 
                nextPage();
                updateMarkers('marker-001', 'marker-002');
                break;
            case 'middle': 
                prevPage();
                updateMarkers('marker-001', 'marker-002');
                break;
            case 'none':
            case 'couv':
            case 'menu':
                actualPage();
                updateMarkers('marker-001', 'marker-002');
                break;
            default: 
                console.error('Error while looking for last seen pages. Last seen is none of start, middle or end.');
                console.error('Last seen is: '+lastSeen);
        }
        lastSeen = 'start';
    }
}

function handleMiddle () {
    if (lastSeen == 'middle') return;
    else {
        switch (lastSeen) {
            case 'start': 
                nextPage();
                updateMarkers('marker-003', 'marker-004');
                break;
            case 'end': 
                prevPage();
                updateMarkers('marker-003', 'marker-004');
                break;
            case 'none':
            case 'couv':
            case 'menu':
                actualPage();
                updateMarkers('marker-003', 'marker-004');
                break;
            default: 
                console.error('Error while looking for last seen pages. Last seen is none of middle, middle or end.');
                console.error('Last seen is: '+lastSeen);
        }
        lastSeen = 'middle';
    }
}

function handleEnd () {
    if (lastSeen == 'end') return;
    else {
        switch (lastSeen) {
            case 'middle': 
                nextPage();
                updateMarkers('marker-005', 'marker-006');
                break;
            case 'start': 
                prevPage();
                updateMarkers('marker-005', 'marker-006');
                break;
            case 'none':
            case 'couv':
            case 'menu':
                updateMarkers('marker-005', 'marker-006');
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
    if (typeof marker1 != 'undefined') document.getElementById(marker1).setAttribute('image', 'src', actual.book.pages[actual.page.end]); 
}