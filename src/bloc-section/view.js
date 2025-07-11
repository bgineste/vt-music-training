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



/**----------------------------------------------------------------------------------------------------
* Ecoute des clics de lancement de lectures et du clavier
-----------------------------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        const target = event.target;
		if (vtLecteur) {
			// Gestion des <touche-clavier>
			if (target.tagName === 'TOUCHE-CLAVIER' || target.closest('touche-clavier')) {
				const toucheClavier = target.tagName === 'TOUCHE-CLAVIER' ? target : target.closest('touche-clavier');
				const clavierBlock = toucheClavier.closest('.vt--clavier-lecteur');
				
				if (clavierBlock) {
					// ligne 1 du clavier (play/pause déplacements curseur de lecture)
					if (toucheClavier === vtLecteur.boutonPlayPause) {
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
					}
					// ligne 3 du clavier (traitement de boucles)
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
				}
			}
			// Gestion du zoom et du bouton quitter
			if (target.tagName === 'I') {
				//const bouton = target;
				const MasqueModalLecteur = target.closest('#vt--lecteur-entrainement');
				
				if (MasqueModalLecteur) {
					if (target.classList.contains('vt--repete-en-boucle')) {
						console.log('Bouton "vt--repete-en-boucle" cliqué :', target);
						vtRepeterEnBoucle(target); 
					}
					else if (target.classList.contains('vt--desactiver-lecteur-entrainement')) {
						console.log('Bouton "vt--desactiver-lecteur-entrainement" cliqué :', target);
						vtLecteur.DesactiverLecteurEntrainement(MasqueModalLecteur); 
					}
				}
			}
		}
    });
	
});

