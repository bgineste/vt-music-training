import { useBlockProps, RichText } from '@wordpress/block-editor';
//import useHasSiblingBlock from '../../hooks/useHasSiblingBlock';
import { __ } from '@wordpress/i18n';

//import getTypeParentBlock from '../../hooks/getTypeParentBlock';
import { TextareaControl } from '@wordpress/components';
import './editor.scss';

export default function Edit(props) {
    const blockProps = useBlockProps();
    const { attributes, setAttributes } = props;
    const { consignes } = attributes;
    console.log({consignes});

    return (

        
        <div {...blockProps}>
            {props.isSelected ? (
                <div className="vt--consignes editor-style">
                    <h5>Consignes d'exécution</h5>
                    <RichText
                        tagName="p"
                        value={consignes}
                        onChange={(val) => setAttributes({ consignes: val })}
                        placeholder="Saisissez les consignes..."
                        allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/underline', 'core/text-color']}
                    />
                </div>
            ) : (
                <>
                <h5>Consignes</h5>
                <div className="vt--consignes front-style">
                    <RichText.Content
                        tagName="p"
                        value={consignes}
                    />
                </div>
                </>
            )}
        </div>
    );
}
