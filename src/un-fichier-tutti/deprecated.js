import { useBlockProps } from '@wordpress/block-editor';

const deprecated = [
{
	"attributes": {		 
		"labelFichierTutti": {
			"type": "string",
			"default": ""
		},
		"cheminFichierTutti": {
			"type": "string",
			"default": ""
		},
		"nomFichierTutti": {
			"type": "string",
			"default": ""
		},
		"typeFichierTutti": {
			"type": "string",
			"default": "v"
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
    const {attributes: { cheminFichierTutti, nomFichierTutti, typeFichierTutti,labelFichierTutti,affichageClavier, fichierStereo }} = props

        return (
        <div {...blockProps} 
				className="vt--un-fichier-tutti"
				data-chemin={cheminFichierTutti}
				data-nomfichier={nomFichierTutti}
				data-type={typeFichierTutti}
				data-clavier={affichageClavier}
				data-stereo={fichierStereo}
        >
				<i className="fa-solid fa-square-caret-right"></i>
				<div className="vt--label">{ labelFichierTutti }</div>
        </div>

        )
    }
    }

];

export default deprecated;