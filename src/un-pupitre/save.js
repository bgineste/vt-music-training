import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
export default function save(props) {
	const blockProps = useBlockProps.save()
    const {attributes: { cheminFichierDefaut, typeFichierDefaut, affichageClavier, fichierStereo }} = props

	return (
		<div {...blockProps } className="vt--un-fichier-tutti">
			<div>
				<div className="vt--label">Fichiers pupitre</div>
				<i class="fa-solid fa-square-caret-right"></i>
			</div>
		</div>

	)
}
*/


export default function save({ attributes }) {
    const blockProps = useBlockProps.save();
    const { labelPupitre, cheminFichier, nomFichier, typeFichier, affichageClavier, fichierStereo } = attributes;

    // Convertir la chaîne JSON en tableau d'objets
   // const groups = chaineFichiersPupitre ? JSON.parse(chaineFichiersPupitre) : [];

    return (
        <div {...blockProps} 
                className="vt--pupitre-button"
                data-chemin={cheminFichier}
                data-nomfichier={nomFichier}
                data-type={typeFichier}
                data-clavier={affichageClavier}
                data-stereo={fichierStereo}
        >
                <div className="vt--pupitre-label"> {labelPupitre} </div>
        </div>
    );
}