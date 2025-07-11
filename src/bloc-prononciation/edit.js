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
import { TextControl } from '@wordpress/components';


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
    const { attributes: { cheminFichiers }, context, setAttributes, } = props
    const { "bloc-oeuvre/cheminFichiersOeuvre": CheminFichiersOeuvre } = context
//    const { "bloc-section/largeurPageMax": largeurPageMax } = context
	const pathOeuvre = CheminFichiersOeuvre
	const pathCourant = cheminFichiers
	if ( !pathCourant ) {setAttributes( { cheminFichiers:  pathOeuvre } )}
	const ALLOWED_BLOCKS = [ 'vt-music-training/une-prononciation' ]
//	console.log(largeurPageMax)
	return (
		<div  {...blockProps } >
			{ props.isSelected ? ( 
						 <div>
							<TextControl
								label={ 'Chemin des fichiers (pour l\'ensemble du bloc)' }
								value={ cheminFichiers }
								onChange={ ( val ) =>
									setAttributes( { cheminFichiers: ( val ) } )
								}
							/>
							{ <p>Insérer ci-dessous (en position adjacente) les fichiers de prononciation (blocs une-prononciation) </p> }
							<InnerBlocks allowedBlocks= { ALLOWED_BLOCKS } />
						</div>
				) : ( 
		<div>
				<h5>Prononciation</h5>
				<div>
							<InnerBlocks />
				</div>
		</div>
				) 
			}
		</div>
	);
}
