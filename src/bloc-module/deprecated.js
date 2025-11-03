import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const deprecated = [
{
	attributes: {		 
		cheminFichiersModule: {
			type: 'string',
			default: ''
		},
		titreModule: {
			type: 'string',
			default: ''
		},
        hasIndexOeuvre: {
            type: 'boolean',
            default: false
        }
	},


    save: function save(props) {
        const blockProps = useBlockProps.save()
        const { attributes: { titreModule, hasIndexOeuvre } } = props

        return (
            <div {...blockProps } className="vt--un-module">
                    <div className="vt--titre-et-bouton-esc">
                    <h4 className="vt--titre-de-morceau">{ titreModule }</h4>
                    <label className="vtmt--bouton__switch">
                        <input className="vt--bouton-bloc-esc" type="checkbox"/>
                        <span className="vtmt--bouton__slider vt--bouton__round"></span>
                    </label>
                    </div>
                    <div className="vt--bloc-esc">
                        

                        <InnerBlocks.Content />

                        {hasIndexOeuvre ? (
                        <>
                        <button className="vt--bouton-appel-index-oeuvre alignleft">Index</button>
                        <br />
                        </>
                        ) : (<br />)}
                    </div>
            </div>

        )
    }
    }

];

export default deprecated;