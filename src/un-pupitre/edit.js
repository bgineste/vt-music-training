import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
//import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TextControl, RadioControl, ToggleControl, Button, PanelBody } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';
import './editor.scss';
import { uploadFileToServer, deleteFileFromServer } from '../../assets/js/vt-files-mngt.js';

export default function Edit(props) {
    const blockProps = useBlockProps();
    const { context, attributes, setAttributes, clientId } = props;
    const { "un-groupe-de-pupitres/cheminFichiers": cheminFichiersGroupe, 
		"un-groupe-de-pupitres/typeFichiers": typeFichiersGroupe, 
		"un-groupe-de-pupitres/affichageClavier": affichageClavierGroupe,
		"un-groupe-de-pupitres/fichierStereo": fichierStereoGroupe } = context;
    const { labelPupitre, nomFichier, cheminFichier, typeFichier, affichageClavier, fichierStereo } = attributes;

    const ALLOWED_BLOCKS = [ 'core/paragraph', 'vt-music-training/un-pupitre' ]; // supprimer core/paragraph ?
	

    // Initialisation des attributs si non initialisés
    if (!cheminFichier) {
        setAttributes({ cheminFichier: cheminFichiersGroupe });
    }
   if (!typeFichier) {
        setAttributes({ typeFichier: typeFichiersGroupe });
    }
   if (!affichageClavier) {
        setAttributes({ affichageClavier: affichageClavierGroupe });
    }
   if (!fichierStereo) {
        setAttributes({ fichierStereo: fichierStereoGroupe });
    }


//	const fileInputRefs = useRef({});
	const fileInputRef = useRef();
	const [uploading, setUploading] = useState(false);
	const [erreurUpload, setErreurUpload] = useState(null);
	
//	let cheminFichierServer = [];
//	let nomFichierServer = [];
//	const [nomFichierServer, setNomFichierServer] = useState("");
//	const nomCheminFichierServeurRefs = useRef({});
//	const paramsPupitresRefs = useRef({});
	const pNomFichier = 0;
	const pCheminFichier = 1;
	const pUploading = 2;
	const pErreurUpload = 3;
	
//	let indexParamsPupitre = ""; // pour simplifier l'écriture de l'index de paramsPupitreRefs
	

const handleFileChange = async (e) => {
	const fileNew = e.target.files[0];
	//const indexParams = `${keyGroup}-${keyFile}`;
	console.log(e.target);
	if (!fileNew) return;
	//console.log("Index courants : " + keyGroup + "/" + keyFile);
	//console.log(paramsPupitresRefs);
	
	setUploading(true);
//	paramsPupitresRefs.current[indexParams][pUploading] = true;
	setErreurUpload(null);
//	paramsPupitresRefs.current[indexParams][pErreurUpload] = null;

	//let cheminFichier = paramsPupitresRefs.current[`${keyGroup}-${keyFile}`][pCheminFichier];
	//let nomFichierPrec = paramsPupitresRefs.current[`${keyGroup}-${keyFile}`][pNomFichier];
	let nomFichierPrec = nomFichier;
	try {
		// 1. Supprimer le fichier précédent s'il existe

		if (nomFichierPrec) {
			console.log("suppression " + nomFichierPrec);
			const resultDel = await deleteFileFromServer(nomFichierPrec, cheminFichier); // dans vt-files-mngt.js
			console.log(resultDel.comment);
		}

		// 2. Uploader le nouveau fichier
		
		const resultUpload = await uploadFileToServer(fileNew, cheminFichier); // dans vt-files-mngt.js
		console.log(resultUpload);
	//	updateFile(keyGroup, keyFile, 'nomfichier', resultUpload.nom);
	//	paramsPupitresRefs.current[indexParams][pNomFichier] = resultUpload.nom;
	//	const fichierUpload = resultUpload.nom;
		setAttributes( { nomFichier: resultUpload.nom } );
		
		console.log("Upload " + resultUpload.chemin + " - " + resultUpload.nom);
	} catch (err) {
		console.error(err);
		//paramsPupitresRefs.current[indexParams][pErreurUpload] = err.message;
		setUploading(false);
	} finally {
		//paramsPupitresRefs.current[indexParams][pUploading] = false;
		setErreurUpload(null);
		setUploading(false);
	}
}
//	const fullUrl = `${cheminFichierServer}/${nomFichierServer}`;

//---------------------------------------------------------------------------------------

	// Styles particuliers
	const boutonCommande = "font-size: 23px; font-weight: 600; border: white 2px solid;	border-radius: 8px; margin-right: 10px;"
//---------------------------------------------------------------------------------------

    // Parse JSON string into an object for internal manipulation
    const initialGroups = attributes.chaineFichiersPupitre ? JSON.parse(attributes.chaineFichiersPupitre) : [];
    const [groups, setGroups] = useState(initialGroups);

    const saveGroupsToAttributes = (updatedGroups) => {
        // Convert the object back to a JSON string before saving to attributes
        const jsonString = JSON.stringify(updatedGroups);
        setAttributes({ chaineFichiersPupitre: jsonString });
        setGroups(updatedGroups);
    };

    const addGroup = () => {
        const updatedGroups = [...groups, { titre: '', fichiers: [] }];
        saveGroupsToAttributes(updatedGroups);
    };

    const removeGroup = (index) => {
        const updatedGroups = [...groups];
        updatedGroups.splice(index, 1);
        saveGroupsToAttributes(updatedGroups);
    };

	const addFileToGroup = (groupIndex) => {
		const updatedGroups = [...groups];
		updatedGroups[groupIndex].fichiers.push({
			label: '',
			chemin: cheminFichier,
			nomfichier: '',
			typeFichier: typeFichier,
			affichageClavier: affichageClavier,
			fichierStereo: fichierStereo
		});
		saveGroupsToAttributes(updatedGroups);
	};

    const removeFileFromGroup = (groupIndex, fileIndex) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].fichiers.splice(fileIndex, 1);
        saveGroupsToAttributes(updatedGroups);
    };

    const updateGroupTitle = (groupIndex, newTitle) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].titre = newTitle;
        saveGroupsToAttributes(updatedGroups);
    };

    const updateFile = (groupIndex, fileIndex, key, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].fichiers[fileIndex][key] = value;
        saveGroupsToAttributes(updatedGroups);
    };

//---------------------------------------------------------------------------------------

    return (
	
        <div {...blockProps}>
            {props.isSelected ? (
				<div className="vt--editor-un-pupitre">
					<TextControl
					label="Label du pupitre"
					help="Par ex. : S pour Soprano, A pour Alto..."
					value={labelPupitre}
					onChange={(val) => setAttributes({ labelPupitre: val })}
					//ref={inputRef} // Ici on passe la ref pour le focus
					/>

					<TextControl
					label="Chemin du fichier"
					value={cheminFichier}
					onChange={(val) => setAttributes({ cheminFichier: val })}
					/>

					<TextControl
					label="Nom du fichier"
					value={nomFichier}
					readOnly
					/>

					<div style={{ marginTop: '1em' }}>
					<button
						type="button"
						onClick={() => fileInputRef.current.click()}
						className="components-button is-secondary"
					>
						{nomFichier ? 'Choisir un nouveau fichier' : 'Choisir un fichier'}
					</button>

					<input
						type="file"
						accept="audio/*,video/*"
						ref={fileInputRef}
						onChange={(e) => handleFileChange(e)}
						style={{ display: 'none' }}
					/>
					</div>

					{uploading && <p>📤 Téléversement en cours...</p>}
					{erreurUpload && <p style={{ color: 'red' }}>❌ {erreurUpload}</p>}

					{/* Prévisualisation selon le type de fichier */}
					{nomFichier && (
					<div style={{ marginTop: '1em', maxWidth: '250px' }}>
						{nomFichier.match(/\.(mp3|wav)$/i) && (
						<audio controls src={`${window.location.origin}${cheminFichier}/${nomFichier}`}>
							Votre navigateur ne supporte pas l’audio.
						</audio>
						)}
						{nomFichier.match(/\.(mp4|webm)$/i) && (
						<video controls src={`${window.location.origin}${cheminFichier}/${nomFichier}`}>
							Votre navigateur ne supporte pas la vidéo.
						</video>
						)}
					</div>
					)}

					{/* Paramètres supplémentaires */}
					<RadioControl
					label="Type de fichier"
					selected={typeFichier}
					options={[
						{ label: 'audio', value: 'a' },
						{ label: 'video', value: 'v' }
					]}
					onChange={(val) => setAttributes({ typeFichier: val })}
					/>

					<ToggleControl
					label="Afficher le clavier sous le lecteur"
					checked={affichageClavier}
					onChange={(val) => setAttributes({ affichageClavier: val })}
					/>

					{(affichageClavier) && (
					<ToggleControl
						label="Le fichier est stéréo : la voix principale a une piste dédiée"
						checked={fichierStereo}
						onChange={(val) => setAttributes({ fichierStereo: val })}
					/>
					)}

				</div>
            ) : (
				<div
					className="vt--pupitre-button"
					data-chemin={cheminFichier}
					data-nomfichier={nomFichier}
					data-type={typeFichier}
					data-clavier={affichageClavier}
					data-stereo={fichierStereo}
				>
					<div className="vt--pupitre-label"> {labelPupitre} </div>
				</div>
                        
            )}
        </div>
)}
