/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

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
    const {attributes: { titreModule, hasIndexOeuvre, lyricsPrompter }, } = props
//	console.log("save prompter",lyricsPrompter);

	return (
		<div {...blockProps } className="vt--un-module">
				<div className="vt--titre-et-bouton-esc">
				<h4 className="vt--titre-de-morceau">{ titreModule }</h4>
				<label className="vt--bouton__switch vt--bouton__switch-module">
					<input  type="checkbox" role="switch"/>
					<span className="vt--bouton__slider"></span>
				</label>
				</div>
				<div className="vt--bloc-esc">

					<InnerBlocks.Content />
					{hasIndexOeuvre ? (
					<>
					<button className="vt--bouton-appel-index-oeuvre alignleft">Index</button>
					<br />
					</>
					) : (<br />)}
				</div>
		</div>

	)
}
