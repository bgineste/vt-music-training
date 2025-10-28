import { useBlockProps, RichText } from '@wordpress/block-editor';
//import useHasSiblingBlock from '../../hooks/useHasSiblingBlock';
import { __ } from '@wordpress/i18n';

//import getTypeParentBlock from '../../hooks/getTypeParentBlock';
//import { TextareaControl } from '@wordpress/components';
import './editor.scss';

export default function Edit(props) {
    const blockProps = useBlockProps();
    const { attributes, setAttributes } = props;
    const { paroles } = attributes;
    console.log({paroles});

    return (
	
        <div {...blockProps}>
            {props.isSelected ? (
                <div className="vt--paroles editor-style">
                    <h5>Paroles du morceau</h5>
                    <RichText
                        tagName="p"
                        value={paroles}
                        onChange={(val) => setAttributes({ paroles: val })}
                        placeholder="Saisissez les paroles..."
                        allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/underline', 'core/text-color']}
                    />
                </div>
            ) : (
                <>
                <h5>Paroles du morceau</h5>
                <div className="vt--paroles front-style">
                    <RichText.Content
                        tagName="p"
                        value={paroles}
                    />
                </div>
                </>
            )}
        </div>
    );
}
