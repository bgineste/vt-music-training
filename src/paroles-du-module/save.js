import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { paroles } = attributes;
    const blockProps = useBlockProps.save();

    if (paroles === "") {
        return;
    }
    return (
		<div {...blockProps }>
                <div className="vt--paroles front-style">
                    <RichText.Content
                        tagName="p"
                        value={paroles}
                    />
                </div>
		</div>

    );
}