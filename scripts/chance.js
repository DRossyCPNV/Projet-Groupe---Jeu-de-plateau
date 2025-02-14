// *****************************************************************************
// Paramètres des cartes questions
// *****************************************************************************
// Ce script a pour but de sélectionner et d'afficher une carte chance depuis le fichier Json "chances.json"
// Il a aussi pour but d'appliquer les effets de ces cartes chances sur le ou les joueurs.
//
//              - affichage d'une carte chance à un joueur
//              - effacement de la carte chance et réaffichage du plateau de jeu
//              - exécution de l'effet de la carte chance
//              - effacer le choix
//              - effacer le choix avec déplacement
//
// Laurent Barraud, Bastian Chollet, Luca Coduri,
// Guillaume Duvoisin, Guilain Mbayo & David Rossy
// Un projet mandaté par M. Chavey.
// SI-CA1a - juin 2019 - CPNV
// *****************************************************************************

//Paramètres des cartes questions
var achance = [];
var nbchance;
var nbaleat;
var joueurActuel = 0;
var nbJoueurs =  document.getElementById("nbJoueurs").value;//$("#nbJoueurs").val();
//La carte est masquée au début du jeu
$('#carte_chance').css('display','none');

$.getJSON('donnees/chances.json', function(data) {
    achance = data;

    nbchance = achance.length; //Le nombre de carte chance

});

function fnAfficheChance(IDjoueur) {
    console.log("Joueur ID "+IDjoueur);
    //Affichage de la div
    $('body').css('background-color','rgba(0,0,0,.9)');
    $('#plateau_jeu').css('display','none');
    $('#menu_indications').css('display', 'none');
    $('#carte_chance').css('display', 'block');


    //Génération d'un nombre aléatoire
    nbaleat = Math.floor(Math.random() * nbchance);

    //Affichage de la carte chance
    $('#titre_chance').html(achance[nbaleat].titre);
    $('#txt_chance').html(achance[nbaleat].texte);
    joueurActuel = IDjoueur;

}

function fnEffaceChance(){
    //efface la carte et réaffiche le plateau de jeu
    $('#carte_chance').css('display', 'none');
    $('#plateau_jeu').css('display','inline');
    $('#menu_indications').css('display', 'flex');
    $('body').css('background-color','purple');
    fnExecuteChance();
}

function fnExecuteChance(){
    console.log("nombre de joueurs: " +nbJoueurs);
    console.log("Joueur Actuel : " +joueurActuel);
    var nomJoueurs = "";
    switch(achance[nbaleat].effet){
        case 'POINTS':
            switch(achance[nbaleat].valeur_1){
                case 0:
                    //Si donner argent autre joueur
                    $('#choix_cible').css('display', 'block');
                    $('#titre_cible').html("Choisissez un joueur cible:");

                    for(var i = 0; i < nbJoueurs; i++){
                        console.log("valeur de I: " +i);
                        if(joueurs[i] !== joueurs[joueurActuel]) {
                            nomJoueurs += "<input type='radio' name='joueur' value='" + joueurs[i].id + "'> <label>" + joueurs[i].nom + "</label><br>";
                        }
                    }
                    nomJoueurs += "<br><br><input type=\"button\" value=\"Choisir\" onclick=\"fnEffaceChoix();\">"
                    $('#form_cibles').html(nomJoueurs);
                    console.log("donne de l'argent");
                    break;
                default:
                    //Si recevoir argent
                    if(achance[nbaleat].valeur_2 === 0){
                        if(joueurs[joueurActuel].protection == 1 && achance[nbaleat].valeur_1 < 0){
                            joueurs[joueurActuel].protection = 0;
                        }
                        else {
                            if (achance[nbaleat].valeur_1 < 0 && joueurs[joueurActuel].argent <= Math.abs(achance[nbaleat].valeur_1)) {
                                joueurs[joueurActuel].argent = 0;
                            }
                            else {
                                joueurs[joueurActuel].argent += achance[nbaleat].valeur_1;
                            }
                        }
                        console.log("recevoire de l'argent");
                        console.log("Argent du " +joueurs[joueurActuel].nom +" "+joueurs[joueurActuel].argent);
                    }
                    else{
                        //Si recevoir et donner argent
                        //Recevoir
                        if(achance[nbaleat].valeur_1<0 && joueurs[joueurActuel].argent <= Math.abs(achance[nbaleat].valeur_1)){
                            joueurs[joueurActuel].argent = 0;
                        }
                        else{
                            joueurs[joueurActuel].argent += achance[nbaleat].valeur_1;
                        }
                        //Choix de la cible
                        $('#choix_cible').css('display', 'block');
                        $('#titre_cible').html("Choisissez un joueur cible:");

                        for(var i = 0; i < nbJoueurs; i++){
                            if(joueurs[i] !== joueurs[joueurActuel]) {
                                nomJoueurs += "<input type='radio' name='joueur' value='"+ joueurs[i].id +"'> <label>" + joueurs[i].nom + "</label><br>";
                            }
                        }

                        nomJoueurs += "<br><br><input type=\"button\" value=\"Séléctionner\" onclick=\"fnEffaceChoix();\">"

                        $('#form_cibles').html(nomJoueurs);
                        console.log("recevoire et donner de l'argent");
                        console.log("Argent du " +joueurs[joueurActuel].nom +" "+joueurs[joueurActuel].argent);
                    }
                    break;
            }
            break;
        case 'TOURS':
            switch(achance[nbaleat].valeur_1){
                case 1:
                    //la prochaine fois que le joueur lance le dé, rien ne se passe et on passe au joueur suivant
                    console.log("passe tour avant: " +joueurs[joueurActuel].passeTour );
                    joueurs[joueurActuel].passeTour = 1;
                    console.log("passe tour après: " +joueurs[joueurActuel].passeTour );
                    break;
                default:
                    break;
            }
            break;
        case 'DEPLACEMENT':
            switch(achance[nbaleat].valeur_1){
                case 0:
                    //Déplace le joueur actuel
                    //Deplacer le pion
                    joueurs[joueurActuel].deplacerPion((-joueurs[joueurActuel].caseActuelle+achance[nbaleat].valeur_2));

                    //vérifier les actions que le joueur doit effectuer
                    actionCase(joueurs[joueurActuel]);
                    break;
                case 1:
                    //relance le dé automatiquement
                    tourJoueur(joueurActuel);
                    break;
                case 2:
                    //Déplace un joueur cible
                    //Séléction du joueur cible
                    $('#choix_cible').css('display', 'block');
                    $('#titre_cible').html("Choisissez un joueur cible:");
                    for(var i = 0; i < nbJoueurs; i++){
                        if(joueurs[i] !== joueurs[joueurActuel]) {
                            nomJoueurs += "<input type='radio' name='joueur' value='" + joueurs[i].id + "'> <label>" + joueurs[i].nom + "</label><br>";
                        }
                    }
                    nomJoueurs += "<br><br><input type=\"button\" value=\"Choisir\" onclick=\"fnEffaceChoixDeplacement();\">"
                    $('#form_cibles').html(nomJoueurs);
                    
                    break;
                default:
                    break;
            }
            break;
        case 'PROTECTION':
            switch(achance[nbaleat].valeur_1){
                case 1:
                    //on enclanche la protection du joueur pour la prochaine attaque dont il est la cible
                    joueurs[joueurActuel].protection = 1;
                    break;
                default:
                    break;
            }
            break;
        case 'QCM':
            //poser une question
            fnAfficheQuestion();
            break;
        default:
            break;
    }
}

function fnEffaceChoix() {
    //Efface la div de choix de cible
    $('#choix_cible').css('display', 'none');
    //Réaffiche la div de choix de cible si aucune cible n'a été sélectionnée
    if(document.querySelector('input[name="joueur"]:checked') === null){
        console.log("Pas de choix sélectioné");
        fnExecuteChance();
    }
    else{   //Applique l'effet à la cible
        for(var i = 0; i < nbJoueurs; i++){
            if(joueurs[i].id == document.querySelector('input[name="joueur"]:checked').value){
                if(joueurs[i].protection == 1 && achance[nbaleat].valeur_1 < 0){
                    joueurs[i].protection = 0;
                }
                else {
                    if (achance[nbaleat].valeur_2 < 0 && joueurs[i].argent <= Math.abs(achance[nbaleat].valeur_2)) {
                        joueurs[i].argent = 0;
                    }
                    else {
                        joueurs[i].argent += achance[nbaleat].valeur_2;
                    }
                }
                console.log(joueurs[i].nom+" a "+joueurs[i].argent);
            }

        }
    }
}

function fnEffaceChoixDeplacement() {
    //efface la div de choix de cible
    $('#choix_cible').css('display', 'none');
    //applique l'effet au joueur ciblé
    if(document.querySelector('input[name="joueur"]:checked') === null){
        console.log("Pas de choix sélectioné");
        fnExecuteChance();
    }
    else{
        for(var i = 0; i < nbJoueurs; i++){
            if(joueurs[i].id == document.querySelector('input[name="joueur"]:checked').value){
                //Deplacer le pion

                if(achance[nbaleat].valeur_2 === 0){    //Si la destination est GO
                    joueurs[i].deplacerPion(-joueurs[i].caseActuelle);
                }
                else{                                   //Sinon
                    joueurs[i].deplacerPion((-joueurs[i].caseActuelle+achance[nbaleat].valeur_2));
                }


            }

        }
    }

}