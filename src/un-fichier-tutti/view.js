/** 
* Ecoute des boutons "Tutti"
*/

import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', async (event) => {
        //const target = event.target;
        // Gestion des éléments .vt--fichier-tutti-trigger / Lancement de lecture
		const trigger = event.target.closest('.vt--un-fichier-tutti'); // Remonte à l'élément parent
        if (trigger) {
            const chemin = vtmusicNormalizePath(trigger.getAttribute('data-chemin'));
            const nom = trigger.getAttribute('data-nom');
            const type = trigger.getAttribute('data-type');
			const affichageClavier = trigger.getAttribute('data-clavier');
			const fichierStereo = trigger.getAttribute('data-stereo');

			const file = chemin + nom;
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


            if (typeof vtActiverLecteur === 'function') {
                vtActiverLecteur(chemin, nom, type, affichageClavier, fichierStereo);
            } else {
                console.error('La fonction vtActiverLecteur n’est pas définie.');
            }
        }
	});
});