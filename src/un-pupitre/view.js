/** 
* Ecoute des boutons des pupitres
*/
// L'écoute se fait au niveau de la section

/*import Swal from 'sweetalert2';
								 
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".vt--pupitre-button").forEach(div => {
        div.addEventListener("click", async () => {
			const trigger = event.target.closest('.vt--pupitre-button'); // Remonte à l'élément parent
			if (trigger) {
				const chemin = vtmusicNormalizePath(trigger.getAttribute("data-chemin"));
				const nomfichier = trigger.getAttribute("data-nomfichier");
				const type = trigger.getAttribute("data-type");
				const clavier = trigger.getAttribute("data-clavier");
				const stereo = trigger.getAttribute("data-stereo");
				console.log("Chemin : " + chemin + "/" + nomfichier+ "/" + type+ "/" + stereo);

				const file = chemin + nomfichier;
				const existe = await window.fileExists(file);

				if (!existe) {
					Swal.fire({
					icon: 'warning',
					title: 'Fichier introuvable',
					text: "⚠️ Le fichier n'existe pas ou n'est plus disponible.",
					confirmButtonText: 'OK',
					});
				return;
				}


				if (typeof window.VtGestionLecteur.vtActiverLecture === 'function') {
					window.VtGestionLecteur.vtActiverLecture(chemin, nomfichier, type, clavier, stereo);
				} else {
					console.error('La fonction vtActiverLecture n’est pas définie.');
				}
			}
        });
    });
});*/