import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';



export default function save({ attributes }) {
    const blockProps = useBlockProps.save();
    const { nomGroupePupitres } = attributes;

 
    return (
        <div {...blockProps} className="vt--group-fichiers-pupitre">
            
            {nomGroupePupitres && <div className="vt--group-fichiers-pupitre-titre">{nomGroupePupitres}</div>}
            <div className="vt--pupitres-container">
                <InnerBlocks.Content />
            </div>
        </div>
    );
}