// *****************************************************************************************************
// Code du panneau latéral d'indication des joueurs
// *****************************************************************************************************
// Ce script a pour but d'afficher un panneau latéral sur la droite du plateau
// avec le nom du joueur, sa section, les modules obtenus, ses points de savoir et un emplacement
// pour le bouton "Lancer le dé".
//
//              - crée le tableau de référence des modules
//              - affiche le menu des indications
//              - crée les Div des joueurs
//                  - affiche le nombre de joueurs
//                  - définit la section de chaque joueur
//                  - affiche les boutons dans la section du joueur actuel
//                  - affiche les modules détenus par le joueur
//                  - construction des Div des joueurs
//                  - injection des divs joueurs dans le code HTML
//
// Laurent Barraud, Bastian Chollet, Luca Coduri,
// Guillaume Duvoisin, Guilain Mbayo & David Rossy
// Un projet mandaté par M. Chavey.
// SI-CA1a - juin 2019 - CPNV
// **************************************************************************************

//Créer le tableau de référence des modules
var amodules = [];
$.getJSON('donnees/modules.json', function(data) {
    amodules = data;
});

function afficherMenuIndications(){
    $('#game').css('display', 'block');
    //Récupère le nombre de joueurs
    var nbJoueurs = document.getElementById('nbJoueurs').value;
    
    //Affiche et actualise les scores toutes les 500 milisecondes
    creerDivJoueurs(nbJoueurs);
}

function creerDivJoueurs(nbJoueurs) {
    creerDiv = setInterval(function(){

    var boutonAffiche = "";

        //Afficher le nombre de joueurs dans le menu des indications
    document.getElementById('menu_indications_tours').innerHTML = 'Nombres de joueurs : ' + nbJoueurs;

    //Créer les divs en fonction du nombre de joueurs
    var divJoueurs = '';

    //Boucle parcourant tous les joueurs
    for (var i = 0; i < nbJoueurs; ++i){

        //Définit la section du joueur i
        var couleur_section = 'section_';
        switch(document.getElementById('sectionJ' + i).value){
            case 'Informatique':   couleur_section += 'info';
                                   break;
            case 'Polyméchanique': couleur_section += 'media';
                                   break;
            case 'Médiamaticien':  couleur_section += 'meca';
                                   break;
            default:               couleur_section = '';
                                   break;
        }
        
        //Affiche les boutons dans la div du joueur actuel
        if (i === jActuel){
            boutonAffiche =   '<div class="menu_indications_joueur_boutons">' + '\n'
                            + '<input type="button" value="Lancer le dé" class="menu_indications_bouton_lancer" onclick="tourSuivant()">' + '\n';

            if(conditionCFC){
                boutonAffiche += '<input type="button" value="Passer CFC" class="btn_cfc menu_indications_bouton_lancer" onclick="fnPasserCFC(jActuel)">' +'\n' + '</div>' + '\n';
            }
            else{
                boutonAffiche+= '</div>' + '\n';
            }
        }
        else {
            boutonAffiche = "";
        }

        var pionAffiche = '';
        //Affiche le pion auquel c'est le tour
        if (i === jActuel){
            pionAffiche = '<img id="menu_indications_joueur_pion" src="images/pions/' + couleursPions[jActuel] + '.png" style="margin: 2px; width: 20px;" alt="rappel du pion de chaque joueur">' + '\n';
        } else {
            pionAffiche = '\n';
        }

            //Affiche les modules détenus par le joueur
        var modulesAffiches = "";

        //Boucle parcourant tous les modules détenus
        for(var j = 0; j < amodules.length; ++j){
            if(joueurs[i].modulesObtenus[j] === 1){
                modulesAffiches += '<img src="images/modules/' + amodules[j].Nom + '.svg" style="margin: 2px;" alt="modules détenus">' + '\n';
            }
        }

        // Construction des Div des joueurs
        divJoueurs +=   //Div du joueur
                        '<div id="menu_indications_nomJ' + i + '" class="menu_indications_joueur">' + '\n'

                            //Div contenant les informations relatives au joueur
                            + '<div class="menu_indications_joueur_informations">' + '\n'

                                // Div contenant le nom du joueur
                                + '<div class="menu_indications_joueur_nom">' + '\n'
                                + document.getElementById('nomJ' + i).value
                                + '</div>' + '\n'

                                // Div contenant la section du joueur
                                + '<div class="menu_indications_joueur_section ' + couleur_section + '">' + '\n'
                                + document.getElementById('sectionJ' + i).value
                                + '</div>' + '\n'
                            + '</div>' + '\n'

                            //Div affichant les modules détenus par le joueur
                            + '<div class="menu_indications_joueur_modules">' + '\n'
                            + 'Modules' + '\n'
                                + '<div class="menu_indications_joueur_modules_affiches">' + '\n'
                                + modulesAffiches
                                + '</div>' + '\n'
                            + '</div>' + '\n'

                            //Div contenant les points et le pion du joueur
                            + '<div class="menu_indications_joueur_statut">'

                                //Div affichant les points de savoir du joueur
                                + '<div class="menu_indications_joueur_points">' + '\n'
                                + 'Points de savoir : ' + joueurs[i].argent
                                + '</div>' + '\n'

                                //Div affichant le pion du joueur, si c'est son tour de jouer, sinon rien.
                                + '<div class="menu_indications_joueur_pion">' + '\n'
                                + pionAffiche + '\n'
                                + '</div>' + '\n'
                            + '</div>' + '\n'

                            //Div affichant (ou pas) le bouton pour lancer le dé
                            + boutonAffiche
                        + '</div>' + '\n';
    }

    //Injection des divs joueurs dans le code HTML
    document.getElementById('menu_indications_joueurs').innerHTML = divJoueurs;
    }, 1000);
}