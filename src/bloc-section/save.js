/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { vtModifierLargeurBloc } from './view.js';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
 
 /** 
 * le div <div data-classe-bloc-entete={classeBlocEntete}> a pour utilité de mettre à disposition des scripts, la classe du bloc d'entête, si celui-ci doit être figé en haut de page
 */

export default function save(props) {
	const blockProps = useBlockProps.save()
    const {attributes: { idSection }, attributes: { titreSection }, attributes: { fonctionGetIdUtilisateur }, attributes: { classeBlocEntete }, attributes: { sectionAffichable } } = props

	/* le traitement suivant empêche la sauvegarde de la section : A PROSCRIRE
	if (!sectionAffichable) {
		return null;
	}
	*/
	//console.log("bloc-section save:44");
	const classesSection = (sectionAffichable) ? "vt--une-section" : "vt--une-section vtmt--hidden";

	return (
	<>
		<div {...blockProps } className="vt--une-section_wrap">
			<div id={ idSection } className={classesSection}>
				{ titreSection && (
					<h2 className="wp-block-heading">{ titreSection }</h2>
				) }
				<InnerBlocks.Content />
				<div id="vt--lecteur-entrainement" className="vt--masque-modal vtmt--hidden">
					<div className="vt--masque-modal-inner">
						<div id="vt--popup-lecteur-entrainement" className="vt--popup-lecteur-entrainement">
							<div id="vt--lyrics-prompter" className="vt--lyrics-prompter"></div>
							<div id="vt--bloc-lecteur" className="vt--bloc-lecteur"></div>
							<div id="vt--clavier-lecteur" className="vt--clavier-lecteur">
								<div>
									<touche-clavier id="vt--repete-en-boucle" className="vt--repete-en-boucle" title="Répéter en boucle"><i className="fa-solid fa-arrows-spin"></i></touche-clavier>
									<touche-clavier id="vt--rembobiner" className="vt--rembobiner" title="Rembobiner"><i className="fas fa-undo-alt"></i></touche-clavier>
									<touche-clavier id="vt--Ar10" className="vt--Ar10" title="Recul (10 sec)"><i className="fas fa-angle-double-left"></i></touche-clavier>
									<touche-clavier id="vt--Ar3" className="vt--Ar3" title="Recul (3 sec)"><i className="fas fa-angle-left"></i></touche-clavier>
									<touche-clavier id="vt--Av3" className="vt--Av3" title="Avance (3 sec)"><i className="fas fa-angle-right"></i></touche-clavier>
									<touche-clavier id="vt--Av10" className="vt--Av10" title="Avance (10 sec)"><i className="fas fa-angle-double-right"></i></touche-clavier>
									
									<touche-clavier id="vt--PlayPause" className="vt--PlayPause"><i className="fas fa-play"></i></touche-clavier>
								</div>
								<div id="vt--balance" className="vt--suppl vtmt--hidden">
									<div className="vt--balance">
										<div className="vt--balance-une-voie">
											<input type="range" className="vt--balance-curseur" id="vt--balanceG" min="0" max="10" value="10" step="1"  />
											<div className="vt--balance-nom-voie">G</div>
										</div>
										<div className="vt--balance-une-voie">
											<input type="range" className="vt--balance-curseur" id="vt--balanceD" min="0" max="10" value="10" step="1"   />
											<div className="vt--balance-nom-voie">D</div>
										</div>
									</div>
								</div>
								<div>
									<touche-clavier id="vt--SpeedDown" className="vt--SpeedDown" title="Plus lentement"><i className="fas fa-chevron-down"></i></touche-clavier>
									<touche-clavier id="vt--SpeedNormal" className="vt--SpeedNormal" title="Vitesse normale"><i className="fas fa-circle" style="font-size: 1rem;"></i></touche-clavier>
									<touche-clavier id="vt--SpeedUp" className="vt--SpeedUp" title="Plus vite"><i className="fas fa-chevron-up"></i></touche-clavier>
									<compteur-clavier className="vt--aff-compteur"><span id="vt--aff-vitesse">100%</span></compteur-clavier>
									
								</div>
								<div>
									<touche-clavier id="vt--DefDebBoucle" className="vt--DefDebBoucle" title="Marque le début de boucle"><i className="fas fa-step-forward"></i></touche-clavier>
									<compteur-clavier id="vt--compteur-deb-boucle" className="vt--aff-compteur">
										<div className="vt--texte-compteur"><div id="vt--deb-boucle">00:00</div></div>
										<div className="vt--masque-fleches">
											<div id="vt--deb-boucle-fleche-gauche" className="vt--deb-boucle-moins vt--fleche vt--fleche-g"><div><i className="fas fa-caret-square-left"></i></div></div>
											<div id="vt--deb-boucle-fleche-droite" className="vt--deb-boucle-plus vt--fleche vt--fleche-d"><div><i className="fas fa-caret-square-right"></i></div></div>
										</div>
									</compteur-clavier>
									<compteur-clavier id="vt--compteur-fin-boucle" className="vt--aff-compteur">
										<div className="vt--texte-compteur"><div id="vt--fin-boucle">00:00</div></div>
										<div className="vt--masque-fleches">
											<div id="vt--fin-boucle-fleche-gauche" className="vt--fin-boucle-moins vt--fleche vt--fleche-g"><div><i className="fas fa-caret-square-left"></i></div></div>
											<div id="vt--fin-boucle-fleche-droite" className="vt--fin-boucle-plus vt--fleche vt--fleche-d"><div><i className="fas fa-caret-square-right"></i></div></div>
										</div>
									</compteur-clavier>
									<touche-clavier id="vt--DefFinBoucle" className="vt--DefFinBoucle" title="Marque la fin de boucle"><i className="fas fa-step-backward"></i></touche-clavier>
									<select id="vt--choix-boucle" className="vt--choix-boucle vtmt--hidden" title="choix d'une boucle"></select>
								</div>
								<div id="vt--commandes-boucles" className="vt--commandes-boucles vtmt--hidden">
									<div className="vt--nom-boucle-courante">
										<div id="vt--nom-boucle-courante"></div>
									</div>
									<div className="vt--compteurs-boucle-courante">
										<div id="vt--compteurs-boucle-courante"></div>
									</div>
									<touche-bouton id="vt--onoff-boucle" title="Active/désactive la boucle"><i className="fas fa-sync-alt"></i></touche-bouton>
									<div id="vt--commandes-boucles-nommees" className="vt--commandes-boucles-nommees vtmt--hidden">
										<touche-bouton id="vt--modif-bornes-boucle" className="vt--lance-modif-bornes-boucle" style="font-size: 1.5rem;" title="Enregistrer l'intervalle modifié" ><i className="fas fa-circle" style="color: green;"></i></touche-bouton>									
										<touche-bouton id="vt--modif-nom-boucle" className="vt--lance-modif-nom-boucle" style="font-size: 1.5rem;" title="Choisir un nouveau nom de boucle" ><i className="fa-solid fa-pencil-can" style="color: black;"></i></touche-bouton>									
										<div id="vt--bloc-modif-nom-boucle" className="vt--bloc-modif-nom-boucle vtmt--hidden">
											<input id="vt--resaisie-nom-boucle" type="text" size="20" value="" placeholder="Nouveau nom" />
											<touche-clavier id="vt--valide-nom-boucle-modifie" className="vt--valide-nom-boucle" title="Valide le nouveau nom de la boucle" ><i className="fas fa-check"></i></touche-clavier>
										</div>
										<touche-bouton id="vt--suppr-boucle" className="vt--suppr-boucle vtmt--hidden" title="Supprime la boucle courante" ><i className="fa-solid fa-trash-can"></i></touche-bouton>
									</div>
									<div id="vt--commandes-boucles-anonymes" className="vt--commandes-boucles-nommees vtmt--hidden">
										<touche-bouton id="vt--enreg-boucle" className="vt--lance-enreg-boucle" style="font-size: 1.5rem;" title="Enregistrer la boucle" ><i className="fas fa-circle" style="color: red;"></i></touche-bouton>									
										<div id="vt--bloc-saisie-nom-boucle" className="vt--bloc-saisie-nom-boucle vtmt--hidden">
											<input id="vt--saisie-nom-boucle" type="text" size="20" value="" placeholder="Donner un nom à cette boucle" />
											<touche-clavier id="vt--valide-nom-boucle" className="vt--valide-nom-boucle" title="Valide le nom de la boucle" ><i className="fas fa-check"></i></touche-clavier>
										</div>
									</div>
								</div>
									<div id="vt--bloc-enreg-modif-suppr-boucle" className="vtmt--hidden">
										<div id="vt--bloc-enreg-boucle" className="vtmt--hidden">
										</div>
										<div id="vt--bloc-modif-suppr-boucle" className="vt--modif-suppr-boucle">
											<touche-clavier id="vt--suppr-boucle" className="vt--suppr-boucle vtmt--hidden" title="Supprime la boucle courante" ><i className="fa-solid fa-trash-can"></i></touche-clavier>
											<div id="vt--bloc-modif-nom-boucle" className="vtmt--hidden">
												<touche-clavier id="vt--modif-nom-boucle" className="vt--modif-nom-boucle vtmt--hidden" title="Renomme la boucle courante"><i className="fa-solid fa-pencil-can"></i></touche-clavier>
												<div id="vt--bloc-saisie-modif-nom-boucle" className="vt--bloc-saisie-nom-boucle vtmt--hidden">
													<input id="vt--saisie-modif-nom-boucle" type="text" size="20" value="" placeholder="Donner un nom à cette boucle" />
													<touche-clavier id="vt--valide-modif-nom-boucle" className="vt--valide-nom-boucle" title="Valide le nom de la boucle" ><i className="fas fa-check"></i></touche-clavier>
												</div>
											</div>
										</div>
									</div>
							</div>
							<div style="display: flex; width: 100%; justify-content: space-between; align-items: center; ">
							<div style="display: flex; width: 100%; margin-right: .05vw; gap: 10px; justify-content: flex-start; font-size: 1.5em;">
							<i id="vt--popup-lecteur-zoom-minus" className="fa-solid fa-magnifying-glass-minus" style="width: fit-content;"></i>
							<i id="vt--popup-lecteur-zoom-plus" className="fa-solid fa-magnifying-glass-plus" style="width: fit-content;"></i>
							</div>
							<i id="vt--popup-lecteur-close" className
							="vt--desactiver-lecteur-entrainement fa-solid fa-reply" style="width: fit-content; cursor: pointer; font-size: 2em; color: white;"></i>
							</div>
						</div>
					</div>
				</div>			
			</div>
            <div data-classe-bloc-entete={classeBlocEntete}>
			<div data-fonction-get-id-utilisateur={fonctionGetIdUtilisateur}></div>
            </div>
		</div>
	</>
	)
}
