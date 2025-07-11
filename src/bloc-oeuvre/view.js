/** 
  Fonctions liées au bloc-oeuvre
  V 1.0 
*/

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".vt--bouton-oeuvre-esc").forEach(obj => {
        obj.addEventListener("click", () => {
            //console.log("Fonction x exécutée !");
            bascule_affichage_oeuvre(obj);
        });
    });
});


function bascule_affichage_oeuvre(boutonEsc) {
	//console.log(boutonEsc);

	const blocOeuvre = boutonEsc.closest('.vt--une-oeuvre');
	if (!blocOeuvre) return;

	const idBlocOeuvre = blocOeuvre.id;
	const blocEsc = blocOeuvre.querySelector('.vt--wrap-oeuvre');
	if (!blocEsc) return;

	const blocEncadrant = blocOeuvre; // modifiable si un parent différent est requis

	// Valeurs par défaut si variables globales non définies
	const defaultPaddingTop = "10px";  // ajuster selon besoin
	const defaultPaddingBottom = "10px";

	const expandedPaddingTop = typeof bloc_encadrant_oeuvre_padding_top !== 'undefined'
		? bloc_encadrant_oeuvre_padding_top
		: defaultPaddingTop;

	const expandedPaddingBottom = typeof bloc_encadrant_oeuvre_padding_bottom !== 'undefined'
		? bloc_encadrant_oeuvre_padding_bottom
		: defaultPaddingBottom;

	if (boutonEsc.checked) {
		blocEsc.style.display = "block";
		blocEncadrant.style.paddingTop = expandedPaddingTop;
		blocEncadrant.style.paddingBottom = expandedPaddingBottom;
		createCookie(`vt-${idBlocOeuvre}`, "Affiché", 365);
	} else {
		blocEsc.style.display = "none";
		blocEncadrant.style.paddingTop = "5px";
		blocEncadrant.style.paddingBottom = "5px";
		createCookie(`vt-${idBlocOeuvre}`, "Masqué", 365);
	}

	return true;
}