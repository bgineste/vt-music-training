import { useBlockProps, RichText } from '@wordpress/block-editor';
//import useHasSiblingBlock from '../../hooks/useHasSiblingBlock';
import { __ } from '@wordpress/i18n';

//import getTypeParentBlock from '../../hooks/getTypeParentBlock';
import { TextControl, RadioControl, ToggleControl, Flex, FlexItem, Tooltip, IconButton, Button, Modal } from '@wordpress/components';
import { lock, unlock, info } from '@wordpress/icons';
import { useState, useRef } from '@wordpress/element';
import './editor.scss';
import { uploadFileToServer, deleteFileFromServer } from '../../assets/js/vt-files-mngt.js';
//import { useRef } from '@wordpress/element';
import { useClosestParentAttribute } from '../../hooks/useClosestParentAttribute';


export default function Edit(props) {
	console.log("Edit fichier tutti");
    const blockProps = useBlockProps();
    const { context, attributes, setAttributes, clientId } = props;
    const { "bloc-fichiers-de-travail/cheminFichiers": cheminFichiers } = context;
    const { labelFichierTutti, cheminFichierTutti, nomFichierTutti, typeFichierTutti, affichageClavier, fichierStereo, lyricsPrompter } = attributes;

	//console.log("appel parent attribute",nomFichierTutti,clientId );
	const prompterModule = useClosestParentAttribute(clientId, 'lyricsPrompter');
	//console.log(nomFichierTutti,"TUTTI : PROMPTER",ancestorPrompter);
	// Si lyricsPrompter a encore sa valeur par défaut	
	if (lyricsPrompter == "" && prompterModule != "") {
		//console.log("Init par prompterModule");
        setAttributes({ lyricsPrompter: prompterModule });
    }


	const [modifiable, setModifiable] = useState(false);
	const [isHelpOpen, setIsHelpOpen] = useState(false);

    if (!cheminFichierTutti) {
        setAttributes({ cheminFichierTutti: cheminFichiers });
    }
	const fileInputRef = useRef();
	const [uploading, setUploading] = useState(false);
	const [erreurUpload, setErreurUpload] = useState(null);

const handleFileChange = async (e) => {
	const file = e.target.files[0];
	if (!file) return;

	//const chemin = cheminFichierTutti || 'docs/2025/'; // à vérifier
	setUploading(true);
	setErreurUpload(null);

	try {
		// 1. Supprimer le fichier précédent s'il existe
		if (nomFichierTutti) {
			console.log("suppression " + nomFichierTutti);
			const resultDel = await deleteFileFromServer(nomFichierTutti, cheminFichierTutti); // dans vt-files-mngt.js
			console.log(resultDel.comment);
		}

		// 2. Uploader le nouveau fichier
		
		console.log("file avant uploadFileToServer " + file);
		const resultUpload = await uploadFileToServer(file, cheminFichierTutti); // dans vt-files-mngt.js
		console.log("resultUpload " + resultUpload);
		setAttributes({
			nomFichierTutti: resultUpload.nom,
			cheminFichierTutti : resultUpload.chemin,
		});
		console.log("Upload " + resultUpload.chemin + " - " + resultUpload.nom);
	} catch (err) {
		console.error(err);
		setErreurUpload(err.message);
	} finally {
		setUploading(false);
	}
}
	const fullUrl = `${window.location.origin}${cheminFichierTutti}/${nomFichierTutti}`;


    return (
	
        <div {...blockProps}>
            {props.isSelected ? (
                <div>
                    <TextControl
                        label="Label du fichier 'tutti' (audio ou vidéo)"
						help={ 'Par ex.: Video/partition Interprète' }
                        value={labelFichierTutti}
                        onChange={(val) => setAttributes({ labelFichierTutti: val })}
                    />

                    <label className="css-2o4jwd ej5x27r2 css-qy3gpb">Prompteur pour le fichier tutti</label>
                    <RichText
                        tagName="div"
                        className="vt--lyrics-prompter components-text-control__input"
                        value={lyricsPrompter}
                        onChange={(val) => setAttributes({ lyricsPrompter: val })}
                        placeholder="Saisissez le prompteur... ou un _ (underscore) pour 'pas de prompteur'"
                        allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/underline', 'core/text-color']}
                    />

                    <TextControl
                        label="Chemin du fichier 'tutti'"
                        value={cheminFichierTutti}
                        onChange={(val) => setAttributes({ cheminFichierTutti: val })}
                    />
					<Flex align="flex-end"  style={{ gap: '0.5em', marginBottom: '1em' }}>
						<FlexItem style={{ flexGrow: 1, position: 'relative' }}>
							<TextControl
								label="Nom du fichier"
								value={nomFichierTutti}
								readOnly={!modifiable}
								onChange={(value) => setAttributes({ nomFichierTutti: value })}
							/>
						</FlexItem>

						{/* Icône cadenas */}
						<FlexItem>
							<Tooltip text={modifiable ? 'Verrouiller le champ' : 'Déverrouiller pour modifier'}>
								<IconButton
									icon={modifiable ? unlock : lock}
									label={modifiable ? 'Verrouiller' : 'Déverrouiller'}
									onClick={() => setModifiable(!modifiable)}
									isPressed={modifiable}
								/>
							</Tooltip>
						</FlexItem>

						{/* Icône d'information */}
						<FlexItem>
							<Tooltip
								text="Aide sur le nom de fichier"
							>
								<IconButton
									icon={info}
									label="Information sur le nom du fichier"
									onClick={() => setIsHelpOpen(true)}
									isTertiary
								/>
							</Tooltip>
						</FlexItem>
					</Flex>

					{/* Modal d’aide */}
					{isHelpOpen && (
						<Modal
							title="Aide sur le nom du fichier"
							onRequestClose={() => setIsHelpOpen(false)}
						>
							<p>
								Le nom du fichier est défini automatiquement après le téléchargement du fichier choisi.
								Dans la plupart des cas, il n’est pas nécessaire de le modifier.
							</p>
							<p>
								Cependant, vous pouvez exceptionnellement cliquer sur le cadenas pour
								déverrouiller le champ et saisir un nom personnalisé. (Par exemple, pour indiquer un fichier déjà téléchargé).
							</p>
							<div style={{ textAlign: 'right', marginTop: '1em' }}>
								<Button variant="primary" onClick={() => setIsHelpOpen(false)}>
									Fermer
								</Button>
							</div>
						</Modal>
					)}

					<div style={{ marginTop: '1em' }}>
						<label className="label css-2o4jwd" style={{ display: 'none' }}>
							{nomFichierTutti ? 'Remplacer le fichier' : 'Choisir un fichier'}
						</label>

						<div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
							<button
							type="button"
							onClick={() => fileInputRef.current.click()}
							className="components-button is-secondary"
							>
							{nomFichierTutti ? 'Choisir un nouveau fichier' : 'Choisir un fichier'}
							</button>

							<span style={{ fontStyle: 'italic', fontSize: '1rem' }}>
							{nomFichierTutti || 'Aucun fichier sélectionné'}
							</span>

							{/* input caché */}
							<input
							type="file"
							accept="audio/*,video/*"
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: 'none' }}
							/>
						</div>
					</div>
					{uploading && <p>📤 Téléversement en cours...</p>}

					{erreurUpload && <p style={{ color: 'red' }}>❌ {erreurUpload}</p>}

					{nomFichierTutti && (
						<div style={{ marginTop: '1em', width: '100%', maxWidth: '250px' }}>
							<p style={{ display: 'none' }}><strong>Fichier sélectionné :</strong> {nomFichierTutti}</p>

							{nomFichierTutti.match(/\.(mp3|wav)$/i) && (
								<audio controls src={fullUrl} >
									Votre navigateur ne supporte pas l’audio.
								</audio>
							)}

							{nomFichierTutti.match(/\.(mp4|webm)$/i) && (
								<video controls src={fullUrl}>
									Votre navigateur ne supporte pas la vidéo.
								</video>
							)}

							{!nomFichierTutti.match(/\.(mp3|wav|mp4|webm)$/i) && (
								<a href={fullUrl} target="_blank" rel="noopener noreferrer">
									📄 Ouvrir le fichier
								</a>
							)}
						</div>
					)}
								
					<RadioControl
						label="Type de fichier"
						/*help={ 'actif => true, inactif => false' }*/
						selected={ typeFichierTutti}
						options={ [
							{ label: 'audio', value: 'a' },
							{ label: 'video', value: 'v' },
						] }
						onChange={ ( value ) => 
							setAttributes( { typeFichierTutti: (value)})
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
                 </div>
            ) : (
                <div>
					{ labelFichierTutti }
                </div>
            )}
        </div>
    );
}
