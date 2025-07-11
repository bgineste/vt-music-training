/* 
  Fonctions liées à la page d'entrainement
  V 1.1 
*/


/*
Super Globales
*/

var vtHauteurReservee = 0; // dimension verticale du bloc fixe en haut de page - s'il existe - exemple la zone de menu. Ce bloc est identifié par le nom de da classe, qui est saisi dans bloc-section pour initialiser l'attribut 'classeBlocEntete' de bloc-section. Pour que cela fonctionne, il faut que le bloc fixe ait un nom de classe unique dans la page - ou qu'il soit le premier bloc de cette classe dans la page 

var oeuvres = new Object();
function vtValorisationSuperGlobales() {
	// pour chaque oeuvre ou groupe d'oeuvres, définir les élements principaux
	var les_oeuvres = document.getElementsByClassName('vt--une-oeuvre');
	//if (les_oeuvres == null) {alert("oeuvre non trouvée");}
	if (les_oeuvres != null) {
		for (var i= 0; i < les_oeuvres.length; i++) {
			// 1 - objet 'bouton index on-off' qui affiche/masque le panneau des liens vers les modules de l'oeuvre (ou groupe d'oeuvres)
			var boutons_index_on_off = les_oeuvres[i].getElementsByClassName('bouton-index-on-off');
			//alert(les_oeuvres[i].id);
			oeuvres[les_oeuvres[i].id] = les_oeuvres[i];
			oeuvres[les_oeuvres[i].id]["bouton-index-on-off"] = boutons_index_on_off[0];
		}
	}
}


// variables globales qui permettent de régler le padding du module (module_entrainement) en fonction de son état (affiché/masqué)
// utilisés aussi dans la fonction 'bascule_affichage_module'
// on part du principe que tous les modules ont le même padding (sinon il faudrait créer un array de ces valeurs)
var bloc_encadrant_module_padding_top = "0";
var bloc_encadrant_module_padding_bottom = "0";
// globales pour les oeuvres
var bloc_encadrant_oeuvre_padding_top = "0";
var bloc_encadrant_oeuvre_padding_bottom = "0";

/*
Mise en conformité des modules avec leurs cookies qui indiquent si le module est affiché intégralement ou non
*/


function vtAffichageMasquageModules()
{
	// repérer tous les boutons de masquage des oeuvres
	var boutons_esc_oeuvre = document.getElementsByClassName('vt--bouton-oeuvre-esc');
	if (boutons_esc_oeuvre != null) {
		for (var i= 0; i < boutons_esc_oeuvre.length; i++) {
			var bloc_oeuvre = boutons_esc_oeuvre[i].closest('.vt--une-oeuvre');
			var bloc_encadrant_oeuvre = bloc_oeuvre;
			if (i == 0) { // on sauvegarde les valeurs de padding du bloc encadrant l'oeuvre, car on les fait varier pour des raisons esthétiques en fonction de l'état affiché/masqué du bloc masquable VERIFIER SI C'EST VRAI POUR L'OEUVRE (C'est vrai pour le module)
				var style_bloc_encadrant_oeuvre = window.getComputedStyle(bloc_encadrant_oeuvre, null);
				bloc_encadrant_oeuvre_padding_top = style_bloc_encadrant_oeuvre.getPropertyValue("padding-top");
				bloc_encadrant_oeuvre_padding_bottom = style_bloc_encadrant_oeuvre.getPropertyValue("padding-bottom");
			}
			var bloc_oeuvre_esc = bloc_oeuvre.getElementsByClassName('vt--wrap-oeuvre')[0];
			var id_bloc_oeuvre = bloc_oeuvre.id;
			var etat_initial_oeuvre = "Affiché";
			var cook = readCookie('vt-'+id_bloc_oeuvre);					  
			if (cook != null) {
				etat_initial_oeuvre = cook;
			}
			if (etat_initial_oeuvre=="Affiché")
			{
				bloc_oeuvre_esc.style.display="block";
				boutons_esc_oeuvre[i].checked = true;
			}
			else
			{
				bloc_oeuvre_esc.style.display="none";
				boutons_esc_oeuvre[i].checked = false;
				bloc_encadrant_oeuvre.style.paddingTop = "5px";
				bloc_encadrant_oeuvre.style.paddingBottom = "5px";
			}			
		}
	}
	// repérer tous les boutons de masquage des modules
	var boutons_esc_module = document.getElementsByClassName('vt--bouton-bloc-esc');
	if (boutons_esc_module != null) {
		for (var i= 0; i < boutons_esc_module.length; i++) {
			var bloc_entrainement = boutons_esc_module[i].closest('.vt--un-module');
			var bloc_encadrant_module = bloc_entrainement;
			if (i == 0) { // on sauvegarde les valeurs de padding du bloc encadrant la module, car on les fait varier pour des raisons esthétiques en fonction de l'état affiché/masqué du bloc masquable
				var style_bloc_encadrant_module = window.getComputedStyle(bloc_encadrant_module, null);
				bloc_encadrant_module_padding_top = style_bloc_encadrant_module.getPropertyValue("padding-top");
				bloc_encadrant_module_padding_bottom = style_bloc_encadrant_module.getPropertyValue("padding-bottom");
			}
			var bloc_module_esc = bloc_entrainement.getElementsByClassName('vt--bloc-esc')[0];
			var id_bloc_entrainement = bloc_entrainement.id;
			var etat_initial_module = "Affiché";
			var cook = readCookie('vt-'+id_bloc_entrainement);					  
			if (cook != null) {
				etat_initial_module = cook;
			}
			if (etat_initial_module=="Affiché")
			{
				bloc_module_esc.style.display="block";
				boutons_esc_module[i].checked = true;
			}
			else
			{
				bloc_module_esc.style.display="none";
				boutons_esc_module[i].checked = false;
				bloc_encadrant_module.style.paddingTop = "5px";
				bloc_encadrant_module.style.paddingBottom = "5px";
			}			
		}
	}
}



/*
 Script chargement de la section d'entrainement
*/
 
document.addEventListener('DOMContentLoaded', function() {
	/* 
	1 - Affecte des ID aux oeuvres et aux modules (section par section), l'id de la section - saisie lors de sa définition - étant utilisé pour former le préfixe)
	*/
	var lesSections = document.getElementsByClassName("vt--une-section")
	for (let iSection = 0; iSection < lesSections.length; iSection++) {
		let section = lesSections[iSection]
		let idSection = "[" + section.id + "]"
//		var lesOeuvres = document.getElementsByClassName("vt--une-oeuvre") // filtrer les oeuvres de la section
		var lesOeuvres = section.getElementsByClassName("vt--une-oeuvre") // filtrer les oeuvres de la section
		for (let iOeuvre = 0; iOeuvre < lesOeuvres.length; iOeuvre++) {
			let oeuvre = lesOeuvres[iOeuvre]
			oeuvre.id = 'oeuvre_' + idSection + "-" + (iOeuvre + 1)
			let lesModules = oeuvre.getElementsByClassName("vt--un-module")
			for (let iModule = 0; iModule < lesModules.length; iModule++) {
				let module = lesModules[iModule]
				//module.id = 'module_' + (iOeuvre + 1) + "-" + (iModule + 1)
				module.id = 'module_' + idSection + "-" + (iOeuvre + 1) + "-" + (iModule + 1)
			}
		}
	}
	/*
	2 = Init des super Globales
	*/
	vtValorisationSuperGlobales();
//	init_bouton_on_off_panneau_index();
	/*
	3 - Retour des modules à leur état lors de la dernière session / grâce à des cookies
	*/
	vtAffichageMasquageModules();
});

/**----------------------------------------------------------------------------------------------------
* Actualisation en temps réel de la variable root css '--vtmt--hauteur-zone-externe-reservee' et de la variable globale vtHauteurReservee (déclarée et documentée en haut de page)
------------------------------------------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    // Trouver le bloc Gutenberg dans lequel se trouve défini data-classe-bloc-entete
    const blockElement = document.querySelector('[data-classe-bloc-entete]');
    if (!blockElement) {
        console.warn('Bloc avec data-classe-bloc-entete introuvable.');
        return;
    }

    // Récupérer la classe cible
    const targetClass = blockElement.getAttribute('data-classe-bloc-entete');
    if (!targetClass) {
        console.warn('Aucune classe cible définie dans le bloc.');
        return;
    }

    // Identifier l'élément extérieur basé sur la classe cible
    const targetElement = document.querySelector(`.${targetClass}`);
    if (!targetElement) {
        console.warn(`Aucun élément trouvé avec la classe "${targetClass}".`);
        return;
    }

    // Surveiller la hauteur de l'élément
    const updateCssVariable = (height) => {
		const hauteurArrondie = Math.ceil(height);
        document.documentElement.style.setProperty('--vtmt--hauteur-zone-externe-reservee', `${hauteurArrondie}px`);
    };

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            if (entry.target === targetElement) {
//              updateCssVariable(entry.contentRect.height);
//				vtHauteurReservee = entry.contentRect.height;
				const boundingHeight = entry.target.getBoundingClientRect().height;
				updateCssVariable(boundingHeight);
				vtHauteurReservee = boundingHeight;            }
        }
    });

    resizeObserver.observe(targetElement);

    // Nettoyage si nécessaire
    window.addEventListener('unload', () => resizeObserver.disconnect());
});

/**----------------------------------------------------------------------------------------------------
Garantir l'unicité du lecteur (video ou audio) dans la page.
Lorsque plusieurs sections d'entrainement sont présentes dans la même page HTML, elle peuvent se partager le lecteur. C'est une bonne pratique et ce n'est pas optionnel ici, car le bloc lecteur contient des identifiants <div id="vt--lecteur-...> utilisés dans le traitement du lecteur : si on avait un lecteur par bloc, il faudrait personnaliser les identifiants.
------------------------------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
  const blocsLecteurs = document.querySelectorAll('#vt--lecteur-entrainement');
  if (blocsLecteurs.length > 1) {
    for (let i = 1; i < blocsLecteurs.length; i++) {
      blocsLecteurs[i].remove();
    }
  }
});



