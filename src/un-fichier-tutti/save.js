/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
//import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save(props) {
	const blockProps = useBlockProps.save()
    const {attributes: { cheminFichierTutti, nomFichierTutti, typeFichierTutti,labelFichierTutti,affichageClavier, fichierStereo,lyricsPrompter }} = props

	return (
		<div {...blockProps }
				className="vt--un-fichier-tutti"
				data-chemin={cheminFichierTutti}
				data-nomfichier={nomFichierTutti}
				data-type={typeFichierTutti}
				data-clavier={affichageClavier}
				data-stereo={fichierStereo}
                data-prompter={lyricsPrompter}
			>
				<i className="fa-solid fa-square-caret-right"></i>
				<div className="vt--label">{ labelFichierTutti }</div>
			
		</div>

	)
}
