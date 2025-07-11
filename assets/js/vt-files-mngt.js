
/**-------------------------------------------------------------
* Traitement des fichiers (transferts PC/Site, suppressions/Site)
---------------------------------------------------------------*/

	export async function deleteFileFromServer(file,chemin) {

		if (!vtmtData || !vtmtData.nonce) {
			throw new Error("Nonce manquant ou non injecté.");
		}
		const formData = new FormData();
		formData.append('file', file);
		formData.append('chemin', chemin);

		const response = await fetch('/wp-json/vt-music-training/v1/supprimer-fichier', {
			method: 'POST',
			//headers: { 'Content-Type': 'application/json' },
			body: formData,
			credentials: 'include',
			headers: {
				'X-WP-Nonce': vtmtData.nonce,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Erreur lors de la suppression du fichier précédent');
		}
		return await response.json(); // (fichier)
	}
	
	export async function uploadFileToServer(file, chemin) {
		if (!vtmtData || !vtmtData.nonce) {
			throw new Error("Nonce manquant ou non injecté.");
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('chemin', chemin);

		const response = await fetch('/wp-json/vt-music-training/v1/upload-fichier', {
			method: 'POST',
			body: formData,
			credentials: 'include',
			headers: {
				'X-WP-Nonce': vtmtData.nonce,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Erreur lors de l’upload');
		}
		return await response.json(); // { nom, chemin, url }
	}

