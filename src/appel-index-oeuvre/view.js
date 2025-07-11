/** Fonction pour appel-index-oeuvre
	Récupère les id des modules de chaque oeuvre pour pouvoir les indexer
*/

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".vt--lien-vers-ancre").forEach(bouton => {
        bouton.addEventListener("click", () => {
			console.log("rappel index");
			let oeuvre=bouton.closest('.vt--une-oeuvre');
			let boutonIndex=oeuvre.getElementsByClassName('vt--block-bouton-index')[0];
			boutonIndex.checked=false;
			boutonIndex.click();
		});
    });
});

