/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { TextControl, ToggleControl } from '@wordpress/components';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
	const blockProps = useBlockProps()
	// déconstruction
    const { attributes: { idSection, titreSection, largeurPageMax, classeBlocEntete, fonctionGetIdUtilisateur, sectionAffichable }, setAttributes, } = props
	const ALLOWED_BLOCKS = [ 'core/paragraph', 'vt-music-training/bloc-oeuvre' ]
//	vtLargeurPageMax = largeurPageMax
	
	return (
		<div  {...blockProps } >
			{ props.isSelected ? ( 
				<div>
					<TextControl
						label={ 'Identifiant de la section' }
						help={ 'On attribue un identifiant unique aux sections d\'entrainement (Ex. : 2025-1, pour la première de 2025 - 2025-2 pour la 2ème, etc)' }
						value={ idSection }
						onChange={ ( val ) =>
							setAttributes( { idSection: ( val ) } )
						}
					/>
					<TextControl
						label={ 'Titre de la section' }
						value={ titreSection }
						onChange={ ( val ) =>
							setAttributes( { titreSection: ( val ) } )
						}
					/>
					<TextControl
						label={ 'Largeur de page maximale' }
						value={ largeurPageMax }
						onChange={ ( val ) =>
							setAttributes( { largeurPageMax: ( val ) } )
						}
					/>
					<TextControl
						label={ 'Classe attribuée au bloc d\'entête figé s\'il existe' }
						value={ classeBlocEntete }
						onChange={ ( val ) =>
							setAttributes( { classeBlocEntete: ( val ) } )
						}
					/>
					<TextControl
						label={ 'Nom de la fonction d\'initialisation (de la page appelante)' }
						value={fonctionGetIdUtilisateur}
						onChange={(value) => setAttributes({ fonctionGetIdUtilisateur: value })}
						help="Ex: getUtilisateur (doit être une fonction globale disponible sur la page)"
					/>
					<ToggleControl
						label={ 'La section est-elle affichable ?' }
						help={ 'Permet d\'attendre que la section soit prête' }
						checked={ sectionAffichable }
						onChange={(value) => setAttributes({ sectionAffichable: (value) })}
					/>

					<InnerBlocks 
						allowedBlocks= { ALLOWED_BLOCKS }
						placeholder="Insérer les oeuvres de la saison"
					/>
				</div>
				) : ( 
					<div className="vt--une-section">
						<h4>Titre de la section : { titreSection }</h4>
						<p>Identifiant de la section : { idSection } </p>
						<InnerBlocks allowedBlocks= { ALLOWED_BLOCKS } />
					</div>
				) 
			}
		</div>
	);
}
