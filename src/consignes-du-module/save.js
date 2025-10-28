import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { consignes } = attributes;
    const blockProps = useBlockProps.save();

    if (consignes === "") {
		return;
	}
	return (
		<div {...blockProps }>
			<h5>Consignes</h5>
			<div  className="vt--consignes front-style">
					<RichText.Content
						tagName="p"
						value={consignes}
					/>
			</div>
		</div>

    );
}