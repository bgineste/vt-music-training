import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';



export default function save() {
    const blockProps = useBlockProps.save();
//    const {attributes: { titreModule, hasIndexOeuvre }, } = props;
  
    return (
        <div {...blockProps} className="vt--fichiers-pupitre">
            <InnerBlocks.Content />
         </div>
    );
}