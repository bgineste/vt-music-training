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
    const { "bloc-des-pupitres/cheminFichiers": cheminFichiersBloc, 
		"bloc-des-pupitres/typeFichiers": typeFichiersBloc, 
		"bloc-des-pupitres/affichageClavier": affichageClavierBloc,
		"bloc-des-pupitres/fichierStereo": fichierStereoBloc } = context;
    const { nomGroupePupitres, cheminFichiers, typeFichiers, affichageClavier, fichierStereo } = attributes;

   const ALLOWED_BLOCKS = [ 'vt-music-training/un-pupitre' ]; // supprimer core/paragraph ?
	

    // Initialisation des attributs si non initialisés
    if (!cheminFichiers) {
        setAttributes({ cheminFichiers: cheminFichiersBloc });
    }
   if (!typeFichiers) {
        setAttributes({ typeFichiers: typeFichiersBloc });
    }
   if (!affichageClavier) {
        setAttributes({ affichageClavier: affichageClavierBloc });
    }
   if (!fichierStereo) {
        setAttributes({ fichierStereo: fichierStereoBloc });
    }

	const fileInputRefs = useRef({});
//	const [uploading, setUploading] = useState(false);
//	const [erreurUpload, setErreurUpload] = useState(null);
	
//	let cheminFichierServer = [];
//	let nomFichierServer = [];
//	const [nomFichierServer, setNomFichierServer] = useState("");
//	const nomCheminFichierServeurRefs = useRef({});
	const paramsPupitresRefs = useRef({});
	const pNomFichier = 0;
	const pCheminFichier = 1;
	const pUploading = 2;
	const pErreurUpload = 3;
	
	let indexParamsPupitre = ""; // pour simplifier l'écriture de l'index de paramsPupitreRefs
	

const handleFileChange = async (e, keyGroup, keyFile) => {
	const fileNew = e.target.files[0];
	const indexParams = `${keyGroup}-${keyFile}`;
	console.log(e.target);
	if (!fileNew) return;
	console.log("Index courants : " + keyGroup + "/" + keyFile);
	console.log(paramsPupitresRefs);
	
//	setUploading(true);
	paramsPupitresRefs.current[indexParams][pUploading] = true;
//	setErreurUpload(null);
	paramsPupitresRefs.current[indexParams][pErreurUpload] = null;

	let cheminFichier = paramsPupitresRefs.current[`${keyGroup}-${keyFile}`][pCheminFichier];
	let nomFichierPrec = paramsPupitresRefs.current[`${keyGroup}-${keyFile}`][pNomFichier];
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
		updateFile(keyGroup, keyFile, 'nomfichier', resultUpload.nom);
		paramsPupitresRefs.current[indexParams][pNomFichier] = resultUpload.nom;
		
		console.log("Upload " + resultUpload.chemin + " - " + resultUpload.nom);
	} catch (err) {
		console.error(err);
		paramsPupitresRefs.current[indexParams][pErreurUpload] = err.message;
	} finally {
		paramsPupitresRefs.current[indexParams][pUploading] = false;
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
                <div className="vt--editor-bloc-pupitres">
					<>
					<div className="vt--editor-params-defaut-pupitres">
						<h2>Paramètres par défaut des fichiers du groupe</h2>
						<TextControl
							label="Titre du groupe (facultatif)"
							value={nomGroupePupitres}
							onChange={(value) => setAttributes({ nomGroupePupitres: value })}
						/>
						<TextControl
							label="Chemin des fichiers"
							value={cheminFichiers}
							onChange={(value) => setAttributes({ cheminFichiers: value })}
						/>
						<RadioControl
							label={ 'Type de fichier'}
							/*help={ 'actif => true, inactif => false' }*/
							selected={ typeFichiers}
							options={ [
								{ label: 'audio', value: 'a' },
								{ label: 'video', value: 'v' },
							] }
							onChange={ ( value ) => 
								setAttributes( { typeFichiers: (value)})
							}
						/>
						<ToggleControl
							label={ 'Afficher le clavier sous le lecteur' }
							checked={ affichageClavier }
							onChange={(value) => setAttributes({ affichageClavier: (value) })}
						/>
						{ affichageClavier && (
							<ToggleControl
								label={ 'Le fichier est stéréo : la voix principale a une piste dédiée' }
								checked={ fichierStereo }
								onChange={(value) => setAttributes({ fichierStereo: (value) })}
							/>
						)}
						<p>Insérer ici, un après l'autre, les pupitres du groupe : un-pupitre</p>
						<InnerBlocks
							allowedBlocks= { ALLOWED_BLOCKS }
							placeholder="Ajoutez vos pupitres ici"
						/>
					</div>
					</>
                 </div>
            ) : (
				<div className="vt--group-fichiers-pupitre" style={{margin: 'auto'}}>
					<div className="vt--group-fichiers-pupitre-titre">{nomGroupePupitres}</div>
					<div className="vt--pupitres-container">
						<InnerBlocks
							allowedBlocks= { ALLOWED_BLOCKS }
							/*template={TEMPLATE_PRONONCIATIONS}*/
							placeholder="Ajoutez les pupitres de ce groupe ici"
						/>
					</div>
				</div>
           )}
        </div>
)}
