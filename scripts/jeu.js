//todo ajouter une fonction qui s'occupera juste d'afficher les élément dans le canvas. Toute les position sont calculées ailleurs.
// **************************************************************
// Modulopoly - Gameloop
// JCY, Laurent Barraud, Bastian Chollet, Guillaume Duvoisin,
// Guilain Mbayo, David Rossy & Luca Coduri - SI-CA1a - mai 2019
// **************************************************************

//Chargement des fichiers
var img_case_standard = new Image();
img_case_standard.src = ".\\images\\plateau\\Case_Standard.svg";
var img_case_coin = new Image();
img_case_coin.src = ".\\images\\plateau\\Case_Coin.svg";
var img_fond = new Image();
img_fond.src = ".\\images\\plateau\\Fond.svg";
var img_plateau = new Image();
img_plateau.src = "images/plateau/Plateau_avec_WIDTH-HEIGHT.svg";
var img = new Image();
img.src = "images/six-faces-de.jpg";
/////////////

//Elements html
$("#btnPlay").click(function () {
    var nbJoueurs = $("#nbJoueurs").val();
    console.log("Il y a " + nbJoueurs + " Joueurs");
    fnJeu(nbJoueurs);
});

//Initialisation du canvas
var c = document.getElementById("plateau_jeu");
var ctx = c.getContext("2d");

// Le reste du script ici....
var img = new Image();
img.src = "images/six-faces-de.jpg";

//paramètre de dessin
var echelle = 1; //pour pouvoir zoomer
var angle = 0;// pour pouvoir tourner
var decx = 397.5 * echelle;
var decy = 397.5 * echelle; //origine au milieu du plateau de jeu
var tcx = 75.590551;//taille petite case en x
var tcy = 94.5;
var tcoinxy = 189; //Taille case coin (carré)
var tcfcxy = 189; //Taille case cfc (carré)
const ncartes = 5;//nombre de carte par cot� (sans compter les coins)
var joueurs; //tableau des joueurs
const nbJoueursMax = 6;
var acartes = []; //tableau des cartes
var coordCaseDep = {X: 15,Y: 710};

// Parametres du dé
var tabNombres = new Array(); // tableau qui contient les nombres générés aléatoirement
var nbFacesAffichees = 0; // compte le nombre de fois qu'une face de dé est affichée
var resultatDe = 0; // stocke la dernière valeur affichée par le dé, utilisée pour le déplacement des pions.

// Données
$.getJSON('donnees/cases.json', function (data) {
    acartes = data;
});


//Effacement de tout le canvas
function fnEfface() {
    ctx.clearRect(0, 0, c.width, c.height);
}

// function fnCarte(n) {
//
//
//     ctx.lineWidth = 2 * echelle;//2 pixels de largeur de trait
//     var angle = (acartes[n].cote - 1) * Math.PI / 2;
//     ctx.rotate(angle);
//
//     ctx.drawImage(img_case_standard, (ncartes / 2 - acartes[n].ordre) * tcx * echelle, ncartes / 2 * tcx * echelle + 50 , tcx * echelle, tcy * echelle - 50);
//
//     ctx.textAlign = "center";
//     ctx.font = 8 * echelle + "pt Arial";
//     fnText(acartes[n].titre, (ncartes / 2 + 0.5 - acartes[n].ordre) * tcx, (ncartes / 2) * tcx + 0.5 * tcy, "black");
//
//     ctx.textAlign = "center";
//     ctx.font = 5 * echelle + "pt Arial";
//     fnText(acartes[n].texte, (ncartes / 2 + 0.5 - acartes[n].ordre) * tcx, (ncartes / 2) * tcx + 0.5 * tcy + 10, "dimgray");
//
//     ctx.rotate(-angle);
//
// }

//cette fonction dessine les coins du plateau de jeu
// function fnCoin(n) {
//     var angle = (n + 1) * Math.PI / 2;
//     ctx.rotate(angle);
//     ctx.translate(-decx, -decy);
//     ctx.drawImage(img_case_coin, 18 + 7 * tcx * echelle, tcx / 2 * echelle - 25, 2 * tcx * echelle, 2 * tcx * echelle)
//     ctx.translate(decx, decy);
//     ctx.rotate(-angle);
//     console.log("je dessine les coins");
//
// }

function fnRect(x, y, lx, ly, c1, c2) {
    //Cette fonction dessine un rectangle intelligent, dans une couleur donnée et en tenant compte du coté et de l'échelle

    if (c1 != 0) {
        ctx.fillStyle = c1;//couleur du trait
        ctx.fillRect(echelle * x, echelle * y, echelle * lx, echelle * ly);
    }
    if (c2 != 0) {
        ctx.strokeStyle = c2;//couleur du trait
        ctx.strokeRect(echelle * x, echelle * y, echelle * lx, echelle * ly);
    }
}

function fnText(t, x, y, c) {
    //Dessine un texte intelligent, dans une couleur donnée et en tenant compte de l'echelle
    ctx.fillStyle = c;
    ctx.fillText(t, echelle * x, echelle * y);
}

function fnDraw(img, p1, p2, p3, p4, p5, p6, p7, p8)
{	//Dessine une image intelligente, à l'échelle, avec :
    // (1) la source, (2,3) les coordonnées x et y du coin haut-gauche, (4,5) la largeur et hauteur,
    // (6,7) les coordonnées x et y du coin haut-gauche où dessiner l'image sur le canvas,
    // (8,9) la largeur et hauteur voulue.
    ctx.drawImage(img, p1, p2, p3, p4, p5 * echelle, p6 * echelle, p7 * echelle, p8 * echelle);
}

// Dessine le plateau de jeu entier et place les pions en fonction du nombre de joueurs
function fnJeu(nbJoueurs) {
    nbJoueurJouant = nbJoueurs;

    //L'origine est placée en decx, decy
    ctx.translate(decx, decy);

    //Dessin du carré (plateau)
    // fnRect(30 - decx, 30 - decy, 2 * tcy + ncartes * tcx +1, 2 * tcy + ncartes * tcx + 1, "black", "black");
    ctx.strokeWidth = 10;
    // Couleur du trait
    ctx.strokeStyle = "black";
    ctx.strokeRect(16 - decx, 16 - decy, 768, 768);
    ctx.drawImage(img_plateau, 18 - decx, 18 - decy, 765 * echelle, 765 * echelle);
    //ctx.translate(-decx, -decy); //on place l'origine en 0, 0

    // Dessin de tous les coins
    // for (i = 0; i < 4; i++) {
    //     fnCoin(i);
    // }


    // Dessin de toutes les cartes
    // for (i = 0; i < acartes.length; i++) {
    //     fnCarte(i);
    // }

    //L'origine est placée en decx, decy
    ctx.translate(-decx, -decy);

    //Crée les joueurs en fonction de leur nombre selectionné dans le menu
    joueurs = maker(nbJoueurs);

    for (var i = 0; i < nbJoueurs; i++) {
        // pour test
        console.log("joueur : " + i + ", Nom: " + joueurs[i].nom + ", Couleur: " + joueurs[i].couleur + ", Section: " + joueurs[i].section + ", id: " + joueurs[i].id + ", emplacement: " + joueurs[i].emplacementCase + ", case actuel: " + joueurs[i].caseActuelle);
    }

    for (i = 0; i < nbJoueurs; i++) {
        joueurs[i].placerPionCaseDepart();
    }


}

function fnLancerDe() {
	//Cette fonction va tirer 6 nombres au hasard

	//Crée un tableau pour stocker les nombres
	var nbAffiche = 0;

	//Stocke des entiers aléatoires entre une valeur min (incluse)
	//et une valeur max (incluse) dans le tableau
	var min = 0;
	var max = 59;

	for(var i=0; i<6; i++) {
		tabNombres[i] = Math.floor(Math.random() * (max - min +1)) + min;
	}

	// timer qui appelle la fonction toutes les 120 milli-secondes, pour l'animation du dé.
	tmrAffiche = setInterval(fnAfficheFaceDe, 120);



	return nbAffiche;
}

function fnAfficheFaceDe() {
	//Cette fonction va afficher une des 6 faces du dé, selon les nombres du tableau choisis au hasard

	randomNumber = tabNombres[nbFacesAffichees];
	var faceDe= Math.floor(randomNumber/10); //génère un nombre aléatoire entre 0 et 5

			//Appelle la fonction qui dessine la face du dé intelligemment, à l'échelle.
			fnDraw(img, 796-(156.2*faceDe), 15, 141, 140, 550, 23, 58, 58);

	nbFacesAffichees++;

		if (nbFacesAffichees >= 6)
		{
			ctx.font = 6 * echelle + "pt Arial";
			resultatDe = faceDe+1;
			fnText("Vous avez fait "+resultatDe+".", 580, 100, "chocolate");

			//Remise à zéro du compteur
			nbFacesAffichees = 0;
			clearInterval(tmrAffiche);
		}

}
//Cette fonction réaffiche les pions sur le canvas
function fnAffichePions() {

    //C'est pour tester la fonction des emplacement
    joueurs[0].deplacerPion(1);
    joueurs[1].deplacerPion(1);
    joueurs[2].deplacerPion(1);
    joueurs[3].deplacerPion(1);
    joueurs[4].deplacerPion(1);
    joueurs[5].deplacerPion(1);
    ctx.drawImage(img_plateau, 18 , 18 , 765 * echelle, 765 * echelle);

    console.log(joueurs[0].caseActuelle);

    /////////////////////////////////////////////

    for (var i = 0; i < joueurs.length; i++ ) {

        var imgPion = new Image();
        imgPion.src = "images/pions/" + joueurs[i].couleur + ".png";

        //Coordonnées des pions
        var pionx;
        var piony = coordCaseDep.Y;
        var pionw = 15.5;
        var pionh = 22.5;
        var anglePion = Math.PI/2;
        var j = joueurs[i].caseActuelle;
        var decj = joueurs[i].emplacementCase * 20; //cette variable décale les pions afin qu'ils ne se superposent pas sur une même case



        //On recherche comment et où positionner les pions sur le plateau
        switch (true) {

            case (j === 0):

                fnPivotePlateau(decx, decy, anglePion);

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                fnPivotePlateau(decx, decy, -anglePion);

                break;

            case (j > 0 && j < 6):


                fnPivotePlateau(decx, decy, anglePion);

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                fnPivotePlateau(decx, decy, -anglePion);

                break;

            case (j === 6):

                fnPivotePlateau(decx, decy, anglePion * 2);

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                fnPivotePlateau(decx, decy, -anglePion * 2);

                break;

            case (j > 6 && j < 12):

                fnPivotePlateau(decx, decy, anglePion * 2);

                j -= 6; //On remet la valeur à zéro pour calculer correctement le décalage

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                fnPivotePlateau(decx, decy, -anglePion * 2);

                break;

            case (j === 12):

                fnPivotePlateau(decx, decy, anglePion * 3);

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                fnPivotePlateau(decx, decy, -anglePion * 3);

                break;

            case (j > 12 && j < 18):

                fnPivotePlateau(decx, decy, anglePion * 3);

                j -= 12; //On remet la valeur à zéro pour calculer correctement le décalage

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                fnPivotePlateau(decx, decy, -anglePion * 3);

                break;

            case (j === 18):

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + 1.15 * tcoinxy + 5 * tcx + decj;
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                break;

            case (j > 18 && j < 24):

                j -= 18; //On remet la valeur à zéro pour calculer correctement le décalage

                if (joueurs[i].emplacementCase > 2){

                    decj = (joueurs [i].emplacementCase - 3) * 20;
                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y + 25;

                }
                else{

                    pionx = coordCaseDep.X + (1.15 * tcoinxy) + (5 * tcx) + decj - (j * tcx);
                    piony = coordCaseDep.Y;

                }

                ctx.drawImage(imgPion, pionx * echelle, piony * echelle, pionw * echelle, pionh * echelle);

                break;
        }
    }
}

//Cette fonction pivote le canvas au coordonnées x;y d'un certaint angle
function fnPivotePlateau(x, y, angle) {

    //On met l'origine au milieu du plateau
    ctx.translate(x, y);

    //On fait une rotation
    ctx.rotate(angle);

    //On remet l'origine en haut à gauche
    ctx.translate(-x, -y);

}

