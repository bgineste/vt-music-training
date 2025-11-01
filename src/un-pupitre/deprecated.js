import { useBlockProps } from '@wordpress/block-editor';

const deprecated = [
{
	"attributes": {		 
		"labelPupitre": {
			"type": "string",
			"default": ""
		},
		"cheminFichier": {
			"type": "string",
			"default": ""
		},
		"nomFichier": {
			"type": "string",
			"default": ""
		},
		"typeFichier": {
			"type": "string",
			"default": "a"
		},
		"affichageClavier": {
			"type": "boolean",
			"default": true
		},
		"fichierStereo": {
			"type": "boolean",
			"default": false
		}
	},


    save: function save(props) {
        const blockProps = useBlockProps.save()
        const { attributes: { labelPupitre, cheminFichier, nomFichier, typeFichier, affichageClavier, fichierStereo } } = props

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

        )
    }
    }

];

export default deprecated;