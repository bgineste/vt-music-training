<?php
// This file is generated. Do not modify it manually.
return array(
	'appel-index-oeuvre' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/appel-index-oeuvre',
		'version' => '0.1.0',
		'title' => 'Lien vers l\'index des pièces d\'une oeuvre',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Génére le bouton de renvoi à l\'index des morceaux d\'une oeuvre',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'texteDuBouton' => array(
				'type' => 'string',
				'default' => '** INDEX **'
			)
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'bloc-fichiers-de-travail' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/bloc-fichiers-de-travail',
		'version' => '0.1.0',
		'title' => 'Groupe des fichiers de travail',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'C\'est l\'espace réservé aux différents types de fichiers de travail (tutti et pupitres)',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'cheminFichiers' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'providesContext' => array(
			'bloc-fichiers-de-travail/cheminFichiers' => 'cheminFichiers'
		),
		'usesContext' => array(
			'bloc-module/cheminFichiersModule'
		),
		'textdomain' => 'music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'bloc-module' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/bloc-module',
		'version' => '0.1.0',
		'title' => 'Module d\'entrainement',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'C\'est le bloc d\'une pièce d\'une oeuvre. Se trouve à la racine d\'un bloc oeuvre. Il peut y en avoir plusieurs, adjacents',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'cheminFichiersModule' => array(
				'type' => 'string',
				'default' => ''
			),
			'titreModule' => array(
				'type' => 'string',
				'default' => ''
			),
			'hasIndexOeuvre' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'providesContext' => array(
			'bloc-module/cheminFichiersModule' => 'cheminFichiersModule'
		),
		'usesContext' => array(
			'bloc-oeuvre/cheminFichiersOeuvre'
		),
		'textdomain' => 'music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'bloc-oeuvre' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/bloc-oeuvre',
		'version' => '0.1.0',
		'title' => 'Bloc Oeuvre',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'C\'est le bloc d\'une oeuvre. Se trouve à la racine d\'une page d\'entrainement. Il peut y en avoir plusieurs, adjacents',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'cheminFichiersOeuvre' => array(
				'type' => 'string',
				'default' => ''
			),
			'titreOeuvre' => array(
				'type' => 'string',
				'default' => ''
			),
			'blocRetractable' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'providesContext' => array(
			'bloc-oeuvre/cheminFichiersOeuvre' => 'cheminFichiersOeuvre'
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'bloc-prononciation' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/bloc-prononciation',
		'version' => '0.1.0',
		'title' => 'Bloc Prononciation',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'C\'est le bloc des enregistrements de prononciation, s\'il y en a. Il accueille les blocs de prononciation dans un InnerBlocks',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'cheminFichiers' => array(
				'type' => 'string',
				'default' => ''
			),
			'chaineDescriptive' => array(
				'type' => 'string'
			)
		),
		'usesContext' => array(
			'bloc-oeuvre/cheminFichiersOeuvre'
		),
		'providesContext' => array(
			'bloc-prononciation/cheminFichiers' => 'cheminFichiers'
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'bloc-section' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/bloc-section',
		'version' => '0.1.0',
		'title' => 'Bloc d\'une section d\'entraînement',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'C\'est une section d\'entrainement, contenant une ou plusieurs oeuvres. Généralement elle constitue l\'essentiel d\'une page dédiée à l\'entrainement, mais plusieurs sections peuvent cohabiter dans une même page html non dédiée à l\'entrainement. Bloc racine du plugin. Le lecteur audio/vidéo est défini dans ce bloc',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'idSection' => array(
				'type' => 'string',
				'default' => ''
			),
			'titrePage' => array(
				'type' => 'string',
				'default' => ''
			),
			'largeurPageMax' => array(
				'type' => 'string',
				'default' => '1280'
			),
			'classeBlocEntete' => array(
				'type' => 'string',
				'default' => ''
			),
			'isIphone' => array(
				'type' => 'boolean',
				'default' => false
			),
			'sectionAffichable' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'providesContext' => array(
			'bloc-section/largeurPageMax' => 'largeurPageMax',
			'bloc-section/idSection' => 'idSection'
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'block-ref' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'create-block/vt-gut-blocks',
		'version' => '0.1.0',
		'title' => 'Block référence VT',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Block référence',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'vt-gut-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'block-test' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'vt-music-training/vt-block-test',
		'version' => '0.1.0',
		'title' => 'Block block-test',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Bloc pour les audios de block-test',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'chaineDescriptive' => array(
				'type' => 'string'
			),
			'nombreSousBlocs' => array(
				'type' => 'integer',
				'default' => 1
			),
			'sousBlocsData' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'selection' => array(
				'type' => 'boolean',
				'default' => true
			),
			'typeLecteur' => array(
				'type' => 'string',
				'default' => 'audio'
			)
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'des-fichiers-pupitre' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/des-fichiers-pupitre',
		'version' => '0.1.0',
		'title' => 'Des fichiers de pupitre',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Des fichiers d\'entraînement pour chaque pupitre',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'chaineFichiersPupitre' => array(
				'type' => 'string',
				'default' => '[]'
			),
			'cheminFichiers' => array(
				'type' => 'string',
				'default' => ''
			),
			'typeFichier' => array(
				'type' => 'string',
				'default' => 'a'
			),
			'affichageClavier' => array(
				'type' => 'boolean',
				'default' => true
			),
			'fichierStereo' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesContext' => array(
			'bloc-fichiers-de-travail/cheminFichiers'
		),
		'textdomain' => 'music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'index-oeuvre' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/index-oeuvre',
		'version' => '0.1.0',
		'title' => 'Index des pièces d\'une oeuvre',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'C\'est le bloc qui va générer l\'index des morceaux d\'une oeuvre : il est inutile s\'il n\'y a que 2 ou 3 morceaux',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'titreBlocIndex' => array(
				'type' => 'string',
				'default' => ''
			),
			'texteDuBouton' => array(
				'type' => 'string',
				'default' => 'Index des choeurs'
			),
			'etatDuBouton' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'interpretations' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'vt-music-training/vt-interpretations',
		'version' => '0.1.0',
		'title' => 'Bloc interprétations',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Bloc à insérer au bas des modules d\'entraînement',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'interpretations' => array(
				'type' => 'string'
			),
			'caracteristiques' => array(
				'type' => 'object',
				'properties' => array(
					'interprete' => array(
						'type' => 'string'
					),
					'titre-version' => array(
						'type' => 'string'
					),
					'fichier' => array(
						'type' => 'string'
					),
					'audio-video' => array(
						'type' => 'string'
					),
					'reperes' => array(
						'type' => 'string'
					)
				),
				'default' => array(
					'interprete' => '',
					'titre-version' => '',
					'fichier' => '',
					'audio-video' => 'video',
					'reperes' => ''
				)
			),
			'tstring' => array(
				'type' => 'string'
			),
			'selection' => array(
				'type' => 'boolean',
				'default' => true
			),
			'typeLecteur' => array(
				'type' => 'string',
				'default' => 'audio'
			)
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'un-fichier-tutti' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/un-fichier-tutti',
		'version' => '0.1.0',
		'title' => 'Un fichier \'tutti\'',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Un fichier d\'entraînement commun à tous les pupitres',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'labelFichierTutti' => array(
				'type' => 'string',
				'default' => ''
			),
			'cheminFichierTutti' => array(
				'type' => 'string',
				'default' => ''
			),
			'nomFichierTutti' => array(
				'type' => 'string',
				'default' => ''
			),
			'typeFichierTutti' => array(
				'type' => 'string',
				'default' => 'v'
			),
			'affichageClavier' => array(
				'type' => 'boolean',
				'default' => true
			),
			'fichierStereo' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesContext' => array(
			'bloc-fichiers-de-travail/cheminFichiers'
		),
		'textdomain' => 'music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'une-interpretation' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'vt-music-training/vt-une-interpretation',
		'version' => '0.1.0',
		'title' => 'Bloc une-interprétation',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Bloc à insérer dans le bloc interprétations au bas des modules d\'entraînement',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'interprete' => array(
				'type' => 'string',
				'default' => ''
			),
			'titre-version' => array(
				'type' => 'string',
				'default' => ''
			),
			'fichier' => array(
				'type' => 'string',
				'default' => ''
			),
			'audio-video' => array(
				'type' => 'string',
				'default' => 'video'
			),
			'reperes' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'une-prononciation' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'vt-music-training/une-prononciation',
		'version' => '0.1.0',
		'title' => 'Une Prononciation',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Bloc d\'accès à une prononciation.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'texte' => array(
				'type' => 'string'
			),
			'path' => array(
				'type' => 'string'
			),
			'nomfichier' => array(
				'type' => 'string'
			),
			'typefichier' => array(
				'type' => 'string',
				'default' => 'audio'
			),
			'interprete' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'usesContext' => array(
			'bloc-prononciation/cheminFichiers'
		),
		'textdomain' => 'vt-music-training',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
