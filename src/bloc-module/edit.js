import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import useHasSiblingBlock from '../../hooks/useHasSiblingBlock';
import { __ } from '@wordpress/i18n';

//import getTypeParentBlock from '../../hooks/getTypeParentBlock';
import { TextControl } from '@wordpress/components';
import './editor.scss'; // vérifier

export default function Edit(props) {
    const blockProps = useBlockProps();
    const { context, attributes, setAttributes, clientId } = props;
    const { "bloc-oeuvre/cheminFichiersOeuvre": cheminFichiersOeuvre } = context;
    const { cheminFichiersModule, titreModule, hasIndexOeuvre, lyricsPrompter } = attributes;

    
    // Utiliser le hook pour vérifier la présence d'un bloc sibling
    const existIndexOeuvre = useHasSiblingBlock(clientId, 'vt-music-training/index-oeuvre');
    useEffect(() => {
        if (hasIndexOeuvre !== existIndexOeuvre) {
            setAttributes({ hasIndexOeuvre: existIndexOeuvre });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existIndexOeuvre]);
    
    // Initialisation du chemin si absent
    useEffect(() => {
        if (!cheminFichiersModule && cheminFichiersOeuvre) {
            setAttributes({ cheminFichiersModule: cheminFichiersOeuvre });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
  

     const ALLOWED_BLOCKS = [ 'core/paragraph', 'vt-music-training/paroles-du-module', 'vt-music-training/bloc-fichiers-de-travail', 'vt-music-training/bloc-prononciation', 'vt-music-training/consignes-du-module' ] // à compléter

/* Commande à substituer à TextControl dès que les bugs seront corrigés
*/


     console.log('Rendu bloc module', attributes);

    return (
	
        <div {...blockProps}>
            {props.isSelected ? (
                <div>
                    <TextControl
                        label="Titre du module (nom du morceau, de la pièce, du numéro de l'oeuvre)"
                        value={titreModule}
                        onChange={(val) => setAttributes({ titreModule: val })}
                    />
                    <TextControl
                        label="Chemin des fichiers du module"
                        value={cheminFichiersModule}
                        onChange={(val) => setAttributes({ cheminFichiersModule: val })}
                    />
                    <label className="css-2o4jwd ej5x27r2 css-qy3gpb">Prompteur pour le morceau</label>
                    <RichText
                        tagName="div"
                        className="vt--lyrics-prompter components-text-control__input"
                        value={lyricsPrompter}
                        onChange={(val) => setAttributes({ lyricsPrompter: val })}
                        placeholder="Saisissez le prompteur... ou un _ (underscore) pour 'pas de prompteur'"
                        allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/underline', 'core/text-color']}
                    />
                    <p>Insérer ici les blocs qui composent le module : paroles, vidéos, audios, etc.</p>
                    <InnerBlocks
                        allowedBlocks= { ALLOWED_BLOCKS }
                        /*template={TEMPLATE_PRONONCIATIONS}*/
                        placeholder="Ajoutez vos blocs ici"
                    />
                </div>
            ) : (
                <div>
                    <h4>{titreModule}</h4>
                     <InnerBlocks
                        allowedBlocks= { ALLOWED_BLOCKS }
                        /*template={TEMPLATE_PRONONCIATIONS}*/
                        placeholder="Ajoutez vos blocs ici"
                    /> 
                </div>
            )}
        </div>
    );
}
