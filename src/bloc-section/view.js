// view.js

import Swal from 'sweetalert2';


document.addEventListener('DOMContentLoaded', function () {
    // Si on est dans l'éditeur de blocs, on sort tout de suite
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    // ... ici seulement le code pour le site public ...
//});





/**----------------------------------------------------------------------------------------------------
* Définition de la balise touche-clavier
-----------------------------------------------------------------------------------------------------*/


class ToucheClavier extends HTMLElement {
  connectedCallback() {
    
    /*this.addEventListener('click', () => {
      const touche = this.getAttribute('data-touche');
      console.log('Touche cliquée :', touche);
    });*/
  }
}
customElements.define('touche-clavier', ToucheClavier);

/**----------------------------------------------------------------------------------------------------
* Définition de la balise touche-bouton
-----------------------------------------------------------------------------------------------------*/


class ToucheBouton extends HTMLElement {
  connectedCallback() {
    
    /*this.addEventListener('click', () => {
      const touche = this.getAttribute('data-touche');
      console.log('Touche cliquée :', touche);
    });*/
  }
}
customElements.define('touche-bouton', ToucheBouton);

/**----------------------------------------------------------------------------------------------------
* Définition de la balise compteur-clavier
-----------------------------------------------------------------------------------------------------*/


class CompteurClavier extends HTMLElement {
  connectedCallback() {
    
    /*this.addEventListener('click', () => {
      const touche = this.getAttribute('data-touche');
      console.log('Touche cliquée :', touche);
    });*/
  }
}
customElements.define('compteur-clavier', CompteurClavier);

 
/**----------------------------------------------
 * Fonctions accessibles dans tous le plugin 
 * (en particution dans le gestionnaire de lecteur)
 */

// Utilitaires
/*function vtCvSecTime(secondes) {
	let hours = parseInt(secondes / 3600,10); //Math.floor(secondes / 3600);
	let minutes = parseInt((secondes - (hours * 3600)) / 60,10); //Math.floor((secondes - (hours * 3600)) / 60);
	let seconds = secondes - (hours * 3600) - (minutes * 60);
	let timeString = '';
	if (hours > 0) {
		timeString = hours.toString().padStart(2, '0') + ':';
	}
	timeString = timeString + 
		  minutes.toString().padStart(2, '0') + ':' + 
		  seconds.toString().padStart(2, '0');
	return timeString;
}
*/

function vtCacherElement(el) {
  el.classList.add("vtmt--hidden");
}

function vtMontrerElement(el) {
  el.classList.remove("vtmt--hidden");
}

function vtEnfoncerBouton(btn) {
  btn.classList.add("vt--bouton-clavier-enfonce");
}

function vtRelacherBouton(btn) {
  btn.classList.remove("vt--bouton-clavier-enfonce");
}

const vtGetMediaEnd = (player) =>
    (isFinite(player.duration) && player.duration > 0)
        ? player.duration
        : (player.seekable.length ? player.seekable.end(player.seekable.length - 1) : 0);

function vtCvSecToTime(totalSeconds) {
    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return [
        hours > 0 ? String(hours).padStart(2, "0") : null,
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0")
    ]
    .filter(Boolean) // enlève le "null" si pas d'heures
    .join(":");
}

// Définition de la zone de lecture

const vtEnveloppeLecteur = document.getElementById("vt--lecteur-entrainement");

// Définition des éléments du clavier
const vtBlocClavier = document.getElementById("vt--clavier-lecteur");

const vtBoutonPlayPause = document.getElementById("vt--PlayPause");
console.log("def Bouton Play Pause",vtBoutonPlayPause);
const vtBoutonOnOffBoucleSurLeMorceau = document.getElementById("vt--repete-en-boucle");

const vtBlocBalance = document.getElementById("vt--balance");
	const vtBoutonBalanceG = document.getElementById("vt--balanceG");
	const vtBoutonBalanceD = document.getElementById("vt--balanceD");

const compteurVitesse = document.getElementById("vt--aff-vitesse");

// Définition d'une boucle
// Définition manuelle
const vtCompteurDebBoucle = document.getElementById("vt--compteur-deb-boucle");
const vtCompteurFinBoucle = document.getElementById("vt--compteur-fin-boucle");
const vtTexteCompteurDebBoucle = document.getElementById("vt--deb-boucle");
const vtTexteCompteurFinBoucle = document.getElementById("vt--fin-boucle");
// Définition par choix d'une boucle enregistrée
const vtSelectChoixBoucle = document.getElementById("vt--choix-boucle");

// Manipulation des boucles
const vtBlocCommandesBoucles = document.getElementById("vt--commandes-boucles");
	const vtAffichageNomBoucleCourante = document.getElementById("vt--nom-boucle-courante");
	const vtAffichageCompteursBoucleCourante = document.getElementById("vt--compteurs-boucle-courante");
	const vtBoutonOnOffBoucle = document.getElementById("vt--onoff-boucle");

	const vtCommandesBouclesNommees = document.getElementById("vt--commandes-boucles-nommees");
		const vtBoutonModifBornesBoucle = document.getElementById("vt--modif-bornes-boucle");
		const vtBoutonModifNomBoucle = document.getElementById("vt--modif-nom-boucle");
		const vtBlocModifNomBoucle = document.getElementById("vt--bloc-modif-nom-boucle");
			const vtZoneResaisieNomBoucle = document.getElementById("vt--resaisie-nom-boucle");
			const vtBoutonValideNomBoucleModifie = document.getElementById("vt--valide-nom-boucle-modifie");
		const vtBoutonSupprBoucle = document.getElementById("vt--suppr-boucle");


	const vtCommandesBouclesAnonymes = document.getElementById("vt--commandes-boucles-anonymes");
		const vtBoutonEnregBoucle = document.getElementById("vt--enreg-boucle");
		const vtBlocSaisieNomBoucle = document.getElementById("vt--bloc-saisie-nom-boucle");
			const vtZoneSaisieNomBoucle = document.getElementById("vt--saisie-nom-boucle");
			const vtBoutonValideNomBoucle = document.getElementById("vt--valide-nom-boucle");

		/*const vtBlocEnregBoucle = document.getElementById("vt--bloc-enreg-boucle");
		const vtBlocCommandesModifSupprBoucle = document.getElementById("vt--bloc-commandes-boucles");
			const vtBoutonSupprBoucle = document.getElementById("vt--suppr-boucle");
			const vtBoutonModifNomBoucle = document.getElementById("vt--modif-nom-boucle");
			const vtBlocModifNomBoucle = document.getElementById("vt--bloc-modif-nom-boucle");
				const vtZoneSaisieModifNomBoucle = document.getElementById("vt--saisie-nom-boucle");
				const vtBoutonValideModifNomBoucle = document.getElementById("vt--valide-modif-nom-boucle");	
		*/



// Définition des variables
var vtBoucleChoisie = "";
var vtInfCompteurBoucle = 0; // en secondes
var vtSupCompteurBoucle = 0; // en secondes
var vtLastBoucleChoisie = "";
var vtLastInfCompteurBoucle = 0; // en secondes
var vtLastSupCompteurBoucle = 0; // en secondes
var vtFinMorceau = 0; //en secondes

// Création d’un espace de noms
window.VtGestionLecteur = window.VtGestionLecteur || {};

var vtLecteur = null;

// Définition des fonctions associées aux abonnements vtLecteur.on() et désabonnements vtLecteur.off() sur les dispatch de vtLecteur
const handlers = {
	play: () => {
		vtBoutonPlayPause.firstElementChild.classList.remove("fa-play");
		vtBoutonPlayPause.firstElementChild.classList.add("fa-pause");	// affiche pause
	},
	pause: () => {
		vtBoutonPlayPause.firstElementChild.classList.remove("fa-pause")
		vtBoutonPlayPause.firstElementChild.classList.add("fa-play")		
    },
	vitesseChanged: (e) => {
		console.log("vitesse : ", e.detail.playbackRate);
		compteurVitesse.innerHTML = (100*e.detail.playbackRate).toFixed(0) + '%';
	},
	boucleSetted: (e) => {
		console.log("view : boucle setted", e.detail.nomBoucle,e.detail.debBoucle,e.detail.finBoucle);
		// Préparation du bloc de commande des boucles
		vtAffichageNomBoucleCourante.innerHTML = (e.detail.nomBoucle != null) ? e.detail.nomBoucle : "";
		if (e.detail.nomBoucle != null) {
			vtMontrerElement(vtAffichageNomBoucleCourante.parentElement);
		} else {
			vtCacherElement(vtAffichageNomBoucleCourante.parentElement);
		}
		vtAffichageCompteursBoucleCourante.innerHTML = vtCvSecToTime(e.detail.debBoucle) + "-" + vtCvSecToTime(e.detail.finBoucle);
//		vtMontrerElement(vtAffichageBoucleCourante);
		vtMontrerElement(vtBoutonOnOffBoucle);
		vtRelacherBouton(vtBoutonOnOffBoucle);
		// Affichage du bloc de commande des boucles
		vtMontrerElement(vtBlocCommandesBoucles);
	},
	bouclerSurMorceauChanged: (e) => {
		if (e.detail.etat) {
			vtEnfoncerBouton(vtBoutonOnOffBoucleSurLeMorceau);
		} else {
			vtRelacherBouton(vtBoutonOnOffBoucleSurLeMorceau);
		}
	},
	bouclerDenied: () => { 
		vtMontrerElement(vtBoutonOnOffBoucle);
		vtRelacherBouton(vtBoutonOnOffBoucle);
		beep();
	},
	bouclerChanged: (e) => {
		if (e.detail.isBoucleActive) { // boucle active (on)
			vtEnfoncerBouton(vtBoutonOnOffBoucle);
		} else { // off
			vtRelacherBouton(vtBoutonOnOffBoucle);
			// masquer le bouton enregistrer boucle et son enveloppe ?
		}
		if (e.detail.supprimer) {
			vtResetAffichageBoucle();
			console.log("supprimer boucle");
			// supprimer boucle
		}
		if (vtBoucleValide()) {
			vtMontrerElement(vtBlocCommandesBoucles);
			console.log("**** nomBoucle : =",vtLecteur.nomBoucle,"*");
			if (vtLecteur.nomBoucle === null) {
				console.log("**** montre btn enrg bcl");
				vtMontrerElement(vtCommandesBouclesAnonymes);	
			} else {
				console.log("**** montre modif suppr boucle")
				vtMontrerElement(vtCommandesBouclesNommees);
			}
		}
	}
}

async function vtActiverLecture(cheminFichier, nomFichier, typeFichier, affichageClavier, fichierStereo, lyricsPrompter) {
console.log("Activation nouvelle , fichierStéreo ",fichierStereo,"prompter",lyricsPrompter);
	if(vtLecteur !==null) {
		console.log("Demande d'ouverture de lecteur. Il y a délà un lecteur ouvert");
		return;
	}

	const vtBlocPrompter = document.getElementById("vt--lyrics-prompter");
	const textLyrics = vtConvertToPlain(lyricsPrompter);
	if(textLyrics != "" && textLyrics != "_") {
		// affichage du prompter
		vtBlocPrompter.innerHTML = lyricsPrompter;
		vtMontrerElement(vtBlocPrompter);
	} else {
		vtCacherElement(vtBlocPrompter);
	}
	
	const mediaSource = cheminFichier + nomFichier;
	console.log('MediaSource : ',mediaSource);
	// insertion de la balise audio ou video
	const vtBlocLecteur = document.getElementById("vt--bloc-lecteur");
	switch (typeFichier) {
		case "v":
			console.log("tag video");
			vtBlocLecteur.innerHTML='<video controls="" autoplay="" playsinline="" preload="no" controlslist="nodownload" data-origwidth="0" data-origheight="0" src= "' + mediaSource + '"><p>Votre navigateur est trop ancien pour lire ce fichier</p></video>';
		break;
		case "a":
			console.log("tag audio");
			vtBlocLecteur.innerHTML='<audio style="margin-top: 20px;" controls="" autoplay="" playsinline="" preload="no" controlslist="nodownload" data-origwidth="0" data-origheight="0" src= "' + mediaSource + '"><p>Votre navigateur est trop ancien pour lire ce fichier</p></video>';
		break;
	}
console.log("Avant new lecteur , fichierSteéreo ",fichierStereo);
	vtLecteur = new VtMpLecteur(vtBlocLecteur.firstElementChild);
console.log("Après new lecteur , fichierSteéreo ",fichierStereo);
//	const vtEnveloppeLecteur = document.getElementById("vt--lecteur-entrainement");
	vtMontrerElement(vtEnveloppeLecteur);
console.log("Zprès montret enveloppe lecteur , fichierSteéreo ",fichierStereo);
	//enveloppeLecteur.removeAttribute("display");
	if (fichierStereo === true) {
		console.log("Afficher Balance");
		vtMontrerElement(vtBlocBalance);
	}
	
	//vtFinMorceau = vtGetMediaEnd(vtLecteur.player);
	vtFinMorceau = vtLecteur.tFinMorceau();
	console.log("Fin Morceau : ",vtFinMorceau);
    // Action utilisateur → modèle

	// Définir les handlers correspondants aux dispatches du lecteur

	vtLecteur.on("play", handlers.play);
    vtLecteur.on("pause", handlers.pause);	
	vtLecteur.on("vitesseChanged", handlers.vitesseChanged);
	vtLecteur.on("boucleSetted", handlers.boucleSetted);
	vtLecteur.on("bouclerSurMorceauChanged", handlers.bouclerSurMorceauChanged);
	vtLecteur.on("bouclerDenied", handlers.bouclerDenied);
	vtLecteur.on("bouclerChanged", handlers.bouclerChanged);
//	vtLecteur.on("", handlers.);
}

/**----------------------------------------------------------------------------------------------------
* Ecoute des clics de la section 
-----------------------------------------------------------------------------------------------------*/
//document.addEventListener("DOMContentLoaded", () => {
/*
Appel d'un fichier pupitre
*/
    document.querySelectorAll(".vt--pupitre-button").forEach(div => {
        div.addEventListener("click", async () => {
				
			const trigger = event.target.closest('.vt--pupitre-button'); // Remonte à l'élément parent
			if (trigger) {
				vtLanceLecture(trigger);
			}
        });
    });
/*
Appel d'un fichier tutti
*/
    document.querySelectorAll(".vt--un-fichier-tutti").forEach(div => {
        div.addEventListener("click", async () => {
				
			const trigger = event.target.closest('.vt--un-fichier-tutti'); // Remonte à l'élément parent
			if (trigger) {
				vtLanceLecture(trigger);
			}
        });
    });
//});

/*
window.VtGestionLecteur.vtBlocLecteur = function() {
	return document.getElementById("vt--bloc-lecteur");
}

window.VtGestionLecteur.vtInstalleLecteur = function(typeLecteur,mediaSource)
{
	const vtBlocLecteur = document.getElementById("vt--bloc-lecteur");
	switch (typeLecteur) {
		case "v":
			console.log("tag video");
			vtBlocLecteur.innerHTML='<video controls="" autoplay="" playsinline="" preload="no" controlslist="nodownload" data-origwidth="0" data-origheight="0" src= "' + mediaSource + '"><p>Votre navigateur est trop ancien pour lire ce fichier</p></video>';
		break;
		case "a":
			console.log("tag audio");
			vtBlocLecteur.innerHTML='<audio style="margin-top: 20px;" controls="" autoplay="" playsinline="" preload="no" controlslist="nodownload" data-origwidth="0" data-origheight="0" src= "' + mediaSource + '"><p>Votre navigateur est trop ancien pour lire ce fichier</p></video>';
		
		break;
	}
}

window.VtGestionLecteur.VtAfficherClavier = function(etat)
{
	if (etat) {
		vtBlocClavier.removeAttribute("style");
	} else {
		vtBlocClavier.style.display = "none";
	}
}

window.VtGestionLecteur.VtAfficherBalance = function(etat)
{
	if (etat) {
		vtBlocBalance.removeAttribute("style");
	} else {
		vtBlocBalance.style.display = "none";
	}
}
		

window.VtGestionLecteur.VtActualiserBoutonPlayPause = function(etatLecteur)
{
	let target = vtBoutonPlayPause.firstElementChild
	if (target) {
		if (etatLecteur === "pause") {
			target.classList.remove("fa-pause")
			target.classList.add("fa-play")		
		} else {
			target.classList.remove("fa-play")
			target.classList.add("fa-pause")		
		}
	}

}

window.VtGestionLecteur.VtAffVitesse = function(Rate)
{
	compteurVitesse.innerHTML = Rate+ '%';
}

window.VtGestionLecteur.VtSetCompteursBoucle = function(vtInfCompteurBoucle,vtSupCompteurBoucle)
{
	compteurvtInfCompteurBoucle.innerHtml = vtCvSecTime(vtInfCompteurBoucle);
	vtcompteurFinBoucle.innerHtml = vtCvSecTime(vtSupCompteurBoucle);
	
}

window.VtGestionLecteur.vtInitParamsLecteur = function() {
    const blocLecteurEntrainement = document.getElementById("vt--lecteur-entrainement");
    const vtBlocClavier = document.getElementById("vt--clavier-lecteur");
    const blocLecteur = document.getElementById("vt--bloc-lecteur");
    const vtBoutonPlayPause = document.getElementById("vt--PlayPause");
    const boutonRepeteEnBoucle = document.getElementById("vt--repete-en-boucle");

    return [
        blocLecteurEntrainement,
        vtBlocClavier,
        blocLecteur,
        vtBoutonPlayPause,
        boutonRepeteEnBoucle
    ];
};
*/
/**----------------------------------------------------------------------------------------------------
* Ecoute des clics du clavier 
-----------------------------------------------------------------------------------------------------*/




//document.addEventListener('DOMContentLoaded', () => {
	if (vtLecteur && vtLecteur.oChoixBoucle !== null) {
		// on affiche le combo de selection (if then)
		vtMontrerElement(vtSelectChoixBoucle);
		if (vtLecteur.boucleChoisie !== "") {
			vtMontrerElement(vtBoutonOnOffBoucle);
		}
	}
	//Evènements 'change'
	document.addEventListener("change", (event) => {
		const changed = event.target;
		console.log("Objet changé : ", changed.id," - ", changed.tagName, " / ", changed.parentElement.id, " - ",changed.parentElement.tagName);	
		switch (changed.id || changed.parentElement.id) { 
			// Sélection d'une boucle enregistrée
			case "vt--choix-boucle":
				console.log("Boucle choisie", changed.value);
				vtLecteur.vtSelectBoucle(changed.value); // passer changed.value en paramètre ?
				//vtAfficheCommandesBoucles();
				vtLecteur.OnOffBoucle;
				break;
		}
		
	});

    //Evènements 'Click'
	document.addEventListener('click', (event) => {
        const target = event.target;
		console.log("Bouton pressé : ", target.id," - ",target.classList," - ", target.tagName, " / ", target.parentElement.id," - ",target.parentElement.classList, " - ",target.parentElement.tagName);
		console.log("pseudo : ", vtIdUtilisateur);
		console.log("BP : ",target,target.parentElement,target.parentElement.parentElement);
		console.log("BP 2 : ",vtBoutonPlayPause);
		//target.style.backgroundColor = "yellow";
		switch (target.id || target.parentElement.id || target.parentElement.parentElement.id) { 

			// ligne 1 du clavier (play/pause déplacements curseur de lecture)
//			case "vt--PlayPause":
			case vtBoutonPlayPause.id:
				vtLecteur.togglePlayPause()
				break;
			case vtBoutonOnOffBoucleSurLeMorceau.id:
				vtLecteur.toggleBouclerSurToutLeMorceau(); 
				break;
			case "vt--rembobiner":
				vtLecteur.rembobiner();
				break;
			case "vt--Ar10":
				vtLecteur.sauter(-10);
				break;
			case "vt--Ar3":
				vtLecteur.sauter(-3);
				break;
			case "vt--Av3":
				vtLecteur.sauter(3);
				break;
			case "vt--Av10":
				vtLecteur.sauter(10);
				break;
			// ligne 2 du clavier (modulation de la vitesse d'exécution)
			case "vt--SpeedDown":
				console.log('Bouton "vt--SpeedDown" cliqué :');
				vtLecteur.setAjusterVitesse('down');
				break;
			case "vt--SpeedNormal":
				console.log('Bouton "vt--Normal" cliqué :');
				vtLecteur.setAjusterVitesse('normal');
				break;
			case "vt--SpeedUp":
				console.log('Bouton "vt--SpeedUp" cliqué :');
				vtLecteur.setAjusterVitesse('up');
				break;

			// Gestion de la stéréo
			case vtBoutonBalanceG.id:
				vtLecteur.SetVol("G", target.value / 10);
				break;
			case vtBoutonBalanceD.id:
				vtLecteur.SetVol("D", target.value / 10);
				break;

			// Définition des bornes de boucle
			case "vt--DefDebBoucle":
				vtLastInfCompteurBoucle = vtInfCompteurBoucle;
				vtInfCompteurBoucle = vtLecteur.getCurrentTime();
				vtCompteurDebBoucle.classList.add("vt--support-compteur-elargi");
				vtTraiteModifBornesBoucle("Deb");
				break;
			case "vt--deb-boucle-fleche-gauche":
				vtLastInfCompteurBoucle = vtInfCompteurBoucle;
				vtInfCompteurBoucle = vtInfCompteurBoucle - 1;
				vtTraiteModifBornesBoucle("Deb");
				break;
			case "vt--deb-boucle-fleche-droite":
				vtLastInfCompteurBoucle = vtInfCompteurBoucle;
				vtInfCompteurBoucle = vtInfCompteurBoucle + 1;
				vtTraiteModifBornesBoucle("Deb");
				break;
			case "vt--fin-boucle-fleche-gauche":
				vtLastSupCompteurBoucle = vtSupCompteurBoucle;
				vtSupCompteurBoucle = vtSupCompteurBoucle - 1;
				vtTraiteModifBornesBoucle("Fin");
				break;
			case "vt--fin-boucle-fleche-droite":
				vtLastSupCompteurBoucle = vtSupCompteurBoucle;
				vtSupCompteurBoucle = vtSupCompteurBoucle + 1;
				vtTraiteModifBornesBoucle("Fin");
				break;
			case "vt--DefFinBoucle":
				vtLastSupCompteurBoucle = vtSupCompteurBoucle;
				vtSupCompteurBoucle = vtLecteur.getCurrentTime();
				vtCompteurFinBoucle.classList.add("vt--support-compteur-elargi");
				vtTraiteModifBornesBoucle("Fin");
				break;
			case vtBoutonOnOffBoucle.id:
				console.log('Bouton "boucler" cliqué :');
				vtLecteur.onOffBoucle();
				break;
				
			// Choix d'une boucle
			// Traité dans l'écoute des évènments de type change

			// Enregistrement d'une boucle
			case vtBoutonEnregBoucle.id:
				console.log("vt--enreg-boucle activé");
				vtLanceProcessEnregBoucle();
				break;
			case vtBoutonValideNomBoucle.id:
				console.log("vt--valide-nom-boucle activé");
				vtEnregBoucle();
				break;
			// fermeture du lecteur
			case "vt--popup-lecteur-close":
				console.log('Bouton "vt--desactiver-lecteur-entrainement" cliqué :', target);
				vtTermineLecture();
				break;

		}
/*		if (vtLecteur) {
			// Gestion des <touche-clavier>
			if (target.tagName === 'TOUCHE-CLAVIER' || target.closest('touche-clavier')) {
				const toucheClavier = target.tagName === 'TOUCHE-CLAVIER' ? target : target.closest('touche-clavier');
				const clavierBlock = toucheClavier.closest('.vt--clavier-lecteur');
				
				if (clavierBlock) {
					// ligne 1 du clavier (play/pause déplacements curseur de lecture)
					if (toucheClavier === vtLecteur.vtBoutonPlayPause) {
						vtLecteur.PlayPause();
					}
					else if (toucheClavier.classList.contains('vt--repete-en-boucle')) {
						vtLecteur.RepeterEnBoucle(toucheClavier); 
					}
					else if (toucheClavier.classList.contains('vt--rembobiner')) {
						vtLecteur.Rembobiner();
					}
					else if (toucheClavier.classList.contains('vt--Ar10')) {
						vtLecteur.Sauter(-10);
					}
					else if (toucheClavier.classList.contains('vt--Ar3')) {
						vtLecteur.Sauter(-3);
					}
					else if (toucheClavier.classList.contains('vt--Av3')) {
						vtLecteur.Sauter(3);
					}
					else if (toucheClavier.classList.contains('vt--Av10')) {
						vtLecteur.Sauter(10);
					}
					// ligne 2 du clavier (modulation de la vitesse d'exécution)
					else if (toucheClavier.classList.contains('vt--SpeedDown')) {
						console.log('Bouton "vt--SpeedDown" cliqué :', toucheClavier);
						vtLecteur.AjusterVitesse('down');
					}
					else if (toucheClavier.classList.contains('vt--SpeedNormal')) {
						console.log('Bouton "vt--Normal" cliqué :', toucheClavier);
						vtLecteur.AjusterVitesse('normal');
					}
					else if (toucheClavier.classList.contains('vt--SpeedUp')) {
						console.log('Bouton "vt--SpeedUp" cliqué :', toucheClavier);
						vtLecteur.AjusterVitesse('up');
					}*/
					/*// ligne 3 du clavier (traitement de boucles)
					else if (toucheClavier.classList.contains('vt--DefDebBoucle')) {
						console.log('Bouton "vt--DefDebBoucle" cliqué :', toucheClavier);
						vtLecteur.DefDebBoucle();
						vtLecteur.ElargirCompteurBoucle('vt--compteur-deb-boucle');
					}
					else if (toucheClavier.classList.contains('vt--DefFinBoucle')) {
						console.log('Bouton "vt--DefFinBoucle" cliqué :', toucheClavier);
						vtLecteur.DefFinBoucle();
						vtLecteur.ElargirCompteurBoucle('vt--compteur-fin-boucle');
					}
					else if (toucheClavier === vtLecteur.btnBoucler) {
						console.log('Bouton "boucler" cliqué :', toucheClavier);
						vtLecteur.OnOffBoucle();
					}
				}
			} else {
				// gestion des flèches d'ajustement du début et de la fin de boucle (ligne 3 du clavier)
				
				if (target.closest('.vt--deb-boucle-moins')){
					vtLecteur.TraiterFleche('vt--deb-boucle-moins');
				} else if (target.closest('.vt--deb-boucle-plus')) {
					vtLecteur.TraiterFleche('vt--deb-boucle-plus');
				} else if (target.closest('.vt--fin-boucle-moins')) {
					vtLecteur.TraiterFleche('vt--fin-boucle-moins');
				} else if (target.closest('.vt--fin-boucle-plus')) {
					vtLecteur.TraiterFleche('vt--fin-boucle-plus');
				}*/
			
			/*// Gestion de la stéréo
			if (target.id === "vt--balanceG") {vtLecteur.SetVol("G", target.value / 10);}
			if (target.id === "vt--balanceD") {vtLecteur.SetVol("D", target.value / 10);}*/
			// Gestion du zoom et du bouton quitter
			/*if (target.tagName === 'I') {
				const MasqueModalLecteur = target.closest('#vt--lecteur-entrainement');
				
				if (MasqueModalLecteur) {
					if (target.classList.contains('vt--repete-en-boucle')) {
						console.log('Bouton "vt--repete-en-boucle" cliqué :', target);
						vtRepeterEnBoucle(target); 
					}*/
					/*else if (target.classList.contains('fa-magnifying-glass-plus')) {
						console.log('Bouton "zoom +" cliqué :', target);
						vtModifierLargeurBloc('vt--popup-lecteur-entrainement',50); 
					}
					else if (target.classList.contains('fa-magnifying-glass-minus')) {
						console.log('Bouton "zoom +" cliqué :', target);
						vtModifierLargeurBloc('vt--popup-lecteur-entrainement',-50); 
					}
					else if (target.classList.contains('vt--desactiver-lecteur-entrainement')) {
						console.log('Bouton "vt--desactiver-lecteur-entrainement" cliqué :', target);
						vtLecteur.DesactiverLecteurEntrainement(MasqueModalLecteur); 
						document.getElementById("vt--balanceG").value = 10;
						document.getElementById("vt--balanceD").value = 10;
					}*/
				/*}
			}
		}*/
		//vtTraiteCommandesBoucles()
    });
	
//});

async function vtLanceLecture(trigger) {
	//trigger : élément '.vt--pupitre-button' ou '.vt--un-fichier-tutti

	const chemin = vtmusicNormalizePath(trigger.getAttribute("data-chemin"));
	const nomfichier = trigger.getAttribute("data-nomfichier");
	const type = trigger.getAttribute("data-type");
	const clavier = trigger.getAttribute("data-clavier");
	const stereo = trigger.getAttribute("data-stereo");
	const lyricsPrompter = trigger.getAttribute("data-prompter");
	//console.log("***Chemin : " + chemin + " - " + nomfichier+ " - " + type, "lyrics prompter", lyricsPrompter, trigger);

	const file = chemin + nomfichier;
	const existe = await window.fileExists(file);

	if (!existe) {
		await Swal.fire({
		icon: 'warning',
		title: 'Fichier introuvable',
		text: "⚠️ Le fichier n'existe pas ou n'est plus disponible.",
		confirmButtonText: 'Vu',
		});
		console.log("Fichier introuvable");
		return;
	}

	if (typeof vtActiverLecture === 'function') {
		vtActiverLecture(chemin, nomfichier, type, clavier, stereo, lyricsPrompter);
		vtFinMorceau = vtGetMediaEnd(vtLecteur.player);
		//console.log('après activer lecteur, Fin de morceau : ',vtFinMorceau);
	} else {
		console.error('La fonction vtActiverLecture n’est pas définie.');
	}
}

function vtTermineLecture() {
	
	if (vtLecteur) {
		vtLecteur.off("play", handlers.play);
		vtLecteur.off("pause", handlers.pause);	
		vtLecteur.off("vitesseChanged", handlers.vitesseChanged);
		vtLecteur.off("bouclerSurMorceauChanged", handlers.bouclerSurMorceauChanged);
		vtLecteur.off("bouclerChanged", handlers.bouclerChanged);

		vtLecteur.destroy();
		vtLecteur = null;
	}

	vtCacherElement(vtEnveloppeLecteur);

	vtResetAffichageClavier();
	// rétablir l'état des boutons


	// réinitialiser le bloc de commande des boucles
	vtResetAffichageCommandesBoucles();


	// réalisé dans destroy()
	//vtLecteur = null; // libère complètement l’instance pour le GC	
}

/*
function vtSetAffichageBoutonOnOffBoucle(aff) {
	switch (aff) {
		case true:
			vtBoutonOnOffBoucle.style.display = "";
			break;
		case false:
			vtBoutonOnOffBoucle.style.display = "none";
			break;
	}
}

function vtSetEtatBoutonOnOffBoucle(etat) {
	switch (etat) {
		case "on":
			//vtBoutonOnOffBoucle.innerHTML="<i className='fas fa-sync-alt'></i> ".vtInfCompteurBoucle + "-" + vtSupCompteurBoucle;
			vtBoutonOnOffBoucle.classList.add("vt--bouton-clavier-enfonce");
			break;
		case "off":
			vtBoutonOnOffBoucle.classList.remove("vt--bouton-clavier-enfonce");

			break;
	}
}
*/

function vtResetAffichageClavier() {

	vtRelacherBouton(vtBoutonOnOffBoucleSurLeMorceau);
	compteurVitesse.innerHTML = '100%';

	// la séquence ci-dessous est peut-être anticipé par un abonnement à des fonctions appelées dans destroy()
	vtCacherElement(vtBlocBalance);
	vtBoutonBalanceG.value = 10;
	vtBoutonBalanceD.value = 10;

	// réinitialiser les compteurs de boucle
	vtResetAffichageBoucle();
}


function vtResetAffichageBoucle() {
	vtRelacherBouton(vtBoutonOnOffBoucle);
	vtCacherElement(vtBoutonOnOffBoucle);
	vtTexteCompteurDebBoucle.innerHTML = "00:00";
	vtCompteurDebBoucle.classList.remove("vt--support-compteur-elargi");
	vtTexteCompteurFinBoucle.innerHTML = "00:00";
	vtCompteurFinBoucle.classList.remove("vt--support-compteur-elargi");
}

function vtResetAffichageCommandesBoucles() {
	vtCacherElement(vtBlocCommandesBoucles);
	vtAffichageNomBoucleCourante.innerHTML="";
	vtCacherElement(vtAffichageNomBoucleCourante.parentElement);
	vtAffichageCompteursBoucleCourante.innerHTML = "";
	vtCacherElement(vtBoutonOnOffBoucle);
	vtRelacherBouton(vtBoutonOnOffBoucle);
	// reset commandes boucles anonymes
	vtCacherElement(vtCommandesBouclesAnonymes);
	vtCacherElement(vtBlocSaisieNomBoucle);
	vtZoneSaisieNomBoucle.value = "";
	// reset commandes boucles nommées

}


function vtBoucleValide() {
	return (parseFloat(vtSupCompteurBoucle) > parseFloat(vtInfCompteurBoucle) && (parseFloat(vtSupCompteurBoucle) - parseFloat(vtInfCompteurBoucle)) > 5);
}

function vtTraiteModifBornesBoucle(borneModifiee) {

	function AffichageCompteur(borneModifiee) {
			switch (borneModifiee) {
				case "Deb":
					vtTexteCompteurDebBoucle.innerHTML = vtCvSecToTime(vtInfCompteurBoucle);
					break;
				case "Fin":
					vtTexteCompteurFinBoucle.innerHTML = vtCvSecToTime(vtSupCompteurBoucle);
					break;
			}
	}

	vtFinMorceau = vtGetMediaEnd(vtLecteur.player);
	console.log('après activer lecteur, Fin de morceau : ',vtFinMorceau);

	// contenir la boucle dans le morceau (les flèches peuvent faire dépasser les bornes)
	if (borneModifiee=="Deb" && vtInfCompteurBoucle < 0 ) {
		vtInfCompteurBoucle = vtLastInfCompteurBoucle;
		beep();
		return;
	}
	if (borneModifiee=="Fin" && vtSupCompteurBoucle > vtFinMorceau ) {
		vtSupCompteurBoucle = vtLastSupCompteurBoucle;
		beep();
		return;
	}
	if (vtLecteur.isBoucleActive) {
		if (vtBoucleValide()) {
			// plage valide
			// on modifie la boucle sur le lecteur
			vtLecteur.setBoucle(vtLecteur.nomBoucle,vtInfCompteurBoucle,vtSupCompteurBoucle);
			// on affiche la modification du compteur
			AffichageCompteur(borneModifiee);
			// on affiche le bouton enreg ou le bloc modif-suppr

		} else { //page non valide
			// ne devrait pas se produire car la boucle est en cours d'exécution, sauf si la durée passait sous les 5 secondes
			beep();
		}
	} else { // il n'y a pas de boucle active
		//console.log 
		if (vtBoucleValide()) {
			//plage valide
			// on affiche la modification du compteur
			AffichageCompteur(borneModifiee);
			// on crée la boucle sur le lecteur
			console.log(vtInfCompteurBoucle," / ",vtSupCompteurBoucle);
			vtLecteur.setBoucle(null,vtInfCompteurBoucle,vtSupCompteurBoucle);
			// on montre le bouton d'activation de boucle (C'est fait par le dispatch du lecteur)
			//vtMontrerElement(vtBoutonOnOffBoucle);
			//vtRelacherBouton(vtBoutonOnOffBoucle);
			// autoriser l'enregistrement de la boucle
			//vtAfficheCommandesBoucles();
			console.log("La boucle ",vtLecteur.nomBoucle,vtLecteur.tDebBoucle,vtLecteur.tFinBoucle)
		} else { //plage non valide
			// on affiche quand même la modification du compteur
			AffichageCompteur(borneModifiee);
			// vtBoutonOnOffBoucle escamoté
			vtCacherElement(vtBoutonOnOffBoucle);
			vtRelacherBouton(vtBoutonOnOffBoucle);
			return;
		}
	}
}

function vtAfficheCommandesBoucles() {
// Cette fonction est appelée UNIQUEMENT lorsque les bornes de boucle sont modifiées
//	let boucleValide = vtBoucleValide();
console.log("**** aff commandes boucles");
	if(!vtLecteur.isBoucleActive) {
		// on cache toutes les commandes sauf select (boucles enregistrées)
	//	vtBoutonOnOffBoucle.style.display = "none";
		console.log("**** cache ligne commandes boucle");
		vtCacherElement(vtBlocCommandesBoucles);
		return
	}
	if (vtLecteur.isBoucleActive) {
		console.log("**** montre on off boucle");
		vtMontrerElement(vtBoutonOnOffBoucle);
		if (vtLecteur.boucleChoisie === "") {
			console.log("**** montre btn enrg bcl");
			vtMontrerElement(vtCommandesBouclesAnonymes);	
		} else {
			console.log("**** montre modif suppr boucle")
			vtMontrerElement(vtBlocCommandesBoucles);
			vtMontrerElement(vtCommandesBouclesNommees);
		}

/*	} else {
		vtBlocCommandesBoucles.style.display = "none";
		if(vtlecteur.boucleChoisie) {
			 vtBlocSelectActiveBoucle.style.display = "flex";
		} else {
			vtBlocSelectActiveBoucle.style.display = "none";
		}
		vtBoutonValideNomBoucle.style.display = "none";
*/
	}
}


async function vtLanceProcessEnregBoucle() {
	/*if (!vtLecteur.etatBoucle && (parseFloat(vtLecteur.tFinBoucle) <= parseFloat(vtLecteur.tDebBoucle))) {
		//alert("Boucle incorrecte !");
		await Swal.fire({
			icon: 'warning',
			title: 'Boucle incorrecte',
			text: "⚠️ Les bornes définies ne sont pas cohérentes.",
			confirmButtonText: 'Vu'
		});
		return;
	}*/
console.log("Swal.isVisible()", Swal.isVisible());
	//const result = Swal.fire({
	await Swal.fire({
		icon: 'warning',
		title: 'Fonction indisponible',
		text: "⚠️ L'enregistrement des boucles sera disponible prochainement.",
		confirmButtonText: 'Vu'
/*	}).then(() => {
		console.log("L’utilisateur a cliqué sur 'Vu' !");
		return; */
	});
	console.log("Débloqué");
	return;
	

	vtCacherElement(vtBoutonEnregBoucle);
	//divEncadreValidationNomBoucle.style.display="flex";
	vtMontrerElement(vtBlocSaisieNomBoucle);
	vtZoneSaisieNomBoucle.focus();
	vtZoneSaisieNomBoucle.select(); // sélecté si possible ?

}

async function vtEnregBoucle() {
	if (document.getElementById("vt--saisie-nom-boucle").value === "") {
		await Swal.fire({
			icon: 'warning',
			//title: 'Boucle incorrecte',
			text: "⚠️ Saisir un nom pour cette boucle.",
			confirmButtonText: 'Vu'
		});
//		alert("saisir un nom de boucle");
		return;
	}
}


/* A ADAPTER
function vtChoixBoucle() {
// S'il y a une boucle en cours : l'arrêter
	if (EtatBoucle) {LoopIt();}
// Si la répétition du morceau est activée : l'arrêter
	if (EtatRepeteEnBoucle) {RepeteEnBoucle();}
  
					
											 

// Installer les paramètres de la boucle choisie
	var oChoixBoucle = document.getElementById(idChoixBoucle);
	if (oChoixBoucle.value === "choisir boucle"){
		// clear compteurs
		tDebBoucle = 0;
		tFinBoucle = 0;
		AffDebBoucle.innerHTML = vtCvSecTime(tDebBoucle);
		AffFinBoucle.innerHTML = vtCvSecTime(tFinBoucle);
		// masquer le bouton renommer/supprimer
//		document.getElementById("ren-suppr-boucle-"+SuffixePlayer).style.display = "none";
		document.getElementById("ren-suppr-boucle").style.display = "none";
		return;
	}
	var x = BouclesDefinies[oChoixBoucle.value].split('|');
	tDebBoucle = x[0];
	tFinBoucle = x[1];
	AffDebBoucle.innerHTML = vtCvSecTime(tDebBoucle);
	AffFinBoucle.innerHTML = vtCvSecTime(tFinBoucle);
	// afficher le bouton renommer/supprimer
//	document.getElementById("ren-suppr-boucle-"+SuffixePlayer).style.display = "block";
	document.getElementById("ren-suppr-boucle").style.display = "block";
// Lancer la boucle
	LoopIt();
}
*/
function vtModifierLargeurBloc(idBloc, incr) {
    const o = document.getElementById(idBloc);
    if (o) {
        // Récupérer la largeur actuelle
        let largeurActuelle = parseInt(window.getComputedStyle(o).width, 10);
        // Ajouter l'incrément
        let nouvelleLargeur = largeurActuelle + incr;
        // Appliquer la nouvelle largeur avec l'unité "px"
        o.style.width = nouvelleLargeur + "px";
    } else {
        console.error("Bloc non trouvé avec l'id :", idBloc);
    }
}
});
