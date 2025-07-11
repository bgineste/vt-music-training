import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
//import useHasSiblingBlock from '../../hooks/useHasSiblingBlock';
import { __ } from '@wordpress/i18n';

//import getTypeParentBlock from '../../hooks/getTypeParentBlock';
import { TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit(props) {
    const blockProps = useBlockProps();
    const { context, attributes, setAttributes, clientId } = props;
    const { "bloc-module/cheminFichiersModule": cheminFichiersModule } = context;
    const { cheminFichiers } = attributes;

    // Initialisation du chemin si absent
    if (!cheminFichiers) {
        setAttributes({ cheminFichiers: cheminFichiersModule });
    }

    const ALLOWED_BLOCKS = [ 'vt-music-training/un-fichier-tutti', 'vt-music-training/des-fichiers-pupitre' ] // à compléter

	// Template pour InnerBlocks
    /*const TEMPLATE_PRONONCIATIONS = [
        ['vt-music-training/bloc-prononciation', { placeholder: 'Prononciations' }],
    ];*/

    return (
	
        <div {...blockProps}>
            {props.isSelected ? (
                <div>
                    <TextControl
                        label="Chemin des fichiers de travail"
                        value={cheminFichiers}
                        onChange={(val) => setAttributes({ cheminFichiers: val })}
                    />
                    <p>Insérer ici les blocs qui composent le module : paroles, vidéos, audios, etc.</p>
                    <InnerBlocks
                        allowedBlocks= { ALLOWED_BLOCKS }
                        placeholder="Ajoutez vos blocs de fichiers de travail ici"
                    />
                </div>
            ) : (
                <div>
                    <h5>Fichiers de travail</h5>
                    <InnerBlocks
                        allowedBlocks= { ALLOWED_BLOCKS }
                        placeholder="Ajoutez vos blocs de fichiers de travail ici"
                    />
                </div>
            )}
        </div>
    );
}
