<?php
/**
 * Plugin Name:       Vt Music Training
 * Description:        Création de pages et de modules d'apprentissage de morceaux de musique 
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.6
 * Author:            Bernard Gineste
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       vt-music-training
 *
 * @package           create-block
 */
 
	file_put_contents(__DIR__ . '/monlog.txt', "🔍 =============== Début vt-music-training\n", FILE_APPEND);

/* Le filtre ci-dessous avait pour but de ne pas activer le plugin pour les visiteurs n'ayant pas la qualité de choriste, afin dene pas charger inutilement la page d'accueil. Mais on zappe ce filtre pour les sites qui n'ont pas le mécanisme de distinction des choristes */
if (get_option('c_choeur') != false && get_option('p_choeur') != false) {
// copie de is_choriste_logged_in() (accessible dans mu-plugins/VT-fonctions.php)
function is_choriste() {
	
	$cook = get_option('c_choeur');
	$pwd = get_option('p_choeur');
	if ($_COOKIE != array(0)) {
		return (isset($_COOKIE[$cook]) && ($_COOKIE[$cook]) == $pwd);
	} else {
		return false;
	}
}

if (!is_choriste()) {
	//exit;
}
}

	file_put_contents(__DIR__ . '/monlog.txt', "🔍 après ischoriste\n", FILE_APPEND);


/**
* Séquence d'activation du plugin
*/

function activer_vt_music_training() {
	//  Le plugin utilise la table zboucles pour enregistrer les boucles définies par l'utilisateur
    // Appeler la fonction de création de table zboucles
    creer_la_table_zboucles();

    // Vous pouvez également effectuer d'autres tâches d'initialisation ici si nécessaire
}

register_activation_hook(__FILE__, 'activer_vt_music_training');

	file_put_contents(__DIR__ . '/monlog.txt', "après cration table zboucles \n", FILE_APPEND);


/**
* Fonctions  appelées à l'activation du plugin
*/
function creer_la_table_zboucles() {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'zboucles'; 

	// Vérifier si la table existe
	if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
		// La table n'existe pas, nous pouvons la créer
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE $table_name (
		  `boucle-ID` int(11) NOT NULL,
		  `pseudo-choriste` varchar(20) CHARACTER SET utf8 NOT NULL,
		  `nom-fichier` varchar(120) CHARACTER SET utf8 NOT NULL,
		  `nom-boucle` varchar(20) CHARACTER SET utf8 NOT NULL,
		  `bornes-boucle` varchar(20) CHARACTER SET utf8 NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1;
		";
		// on pourrait utiliser $wpdb->query($sql). Mais dbDelta appporte plus de fiabilité (contrôles)
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}
}

/**
* Séquence de désactivation du plugin
*/

function desactiver_vt_music_training() {
	//  Le plugin utilise la table zboucles pour enregistrer les boucles définies par l'utilisateur
    // Appeler la fonction de création de table zboucles
//    creer_la_table_zboucles();

    // Vous pouvez également effectuer d'autres tâches d'initialisation ici si nécessaire
}

register_deactivation_hook(__FILE__, 'desactiver_vt_music_training');

/**
* Fonctions  appelées à la désactivation du plugin
*/

/**
* Séquence de désinstallation du plugin
*/

function desinstaller_vt_music_training() {
	//  Le plugin utilise la table zboucles pour enregistrer les boucles définies par l'utilisateur
    // Appeler la fonction de création de table zboucles
//    creer_la_table_zboucles();

    // Vous pouvez également effectuer d'autres tâches d'initialisation ici si nécessaire
}

register_uninstall_hook(__FILE__, 'desinstaller_vt_music_training');

/**
* API REST pour uploader un fichier du PC vers un dossier du site Wordpress
*/

add_action('rest_api_init', function () {
	register_rest_route('vt-music-training/v1', '/upload-fichier', [
		'methods'  => 'POST',
		'callback' => 'vtmt_upload_fichier',
		'permission_callback' => function () {
			return current_user_can('upload_files');
		}
	]);
});

function vtmt_upload_fichier($request) {
	$chemin = sanitize_text_field($_POST['chemin']);
	$fichier = $_FILES['file'];

	if (!isset($fichier) || $fichier['error'] !== UPLOAD_ERR_OK) {
		return new WP_Error('upload_error', 'Erreur lors de l\'upload.', ['status' => 400]);
	}

	// Vérifie que le chemin est dans wp-content ou sous dossier autorisé
	$upload_base = ABSPATH; //WP_CONTENT_DIR; // ou un autre dossier
//	$destination_dir = ABSPATH . ltrim($chemin, '/');
	$destination_dir = realpath($upload_base . ltrim($chemin, '/'));
	if (strpos(realpath($destination_dir), realpath($upload_base)) !== 0) {
		return new WP_Error('bad_path', $destination_dir.' : Chemin non autorisé.', ['status' => 403]);
	}
	if (!$destination_dir) {
		// Essaie de créer le dossier s’il n’existe pas
		$destination_dir = $upload_base . ltrim($chemin, '/');
		if (!wp_mkdir_p($destination_dir)) {
			return new WP_Error('permission_error', 'Impossible de créer le dossier de destination.', ['status' => 500]);
		}
	}

//	$nom_fichier = sanitize_file_name($fichier['name']);
	$nom_fichier = $fichier['name']; // on ne sanitize pas le nom, car le fichier est uploadé avec le nom d'origine
	// Path complet du fichier
	$target_path = trailingslashit($destination_dir) . basename($fichier['name']);

	if (!move_uploaded_file($fichier['tmp_name'], $target_path)) {
		return new WP_Error('upload_fail', 'Le fichier n’a pas pu être déplacé.', ['status' => 500]);
	}

	return [
		'success' => true,
		'path' => $target_path,
		'chemin' => $chemin,
		'nom' => $nom_fichier
	];
}

add_action('rest_api_init', function () {
	register_rest_route('vt-music-training/v1', '/supprimer-fichier', [
		'methods' => 'POST',
		'callback' => 'vtmt_supprimer_fichier',
		'permission_callback' => function () {
			return current_user_can('upload_files');
		},
	]);
});

function vtmt_supprimer_fichier($request) {
	$chemin = sanitize_text_field($_POST['chemin']);
	$file = sanitize_text_field($_POST['file']);
	
	if (!$chemin || !$file) {
		return new WP_Error('missing_params', 'Paramètres manquants', ['status' => 400]);
	}
	
	$fichier = ABSPATH . trim($chemin, '/') . '/' . $file;
	
	if (!file_exists($fichier)) {
//		return new WP_Error('not_found', $fichier.' : Fichier introuvable', ['status' => 404]);
		return rest_ensure_response([
			'success' => true,
			'comment' => $fichier.' : Fichier introuvable'
		]);
	}

	if (!unlink($fichier)) {
		return new WP_Error('delete_failed', 'Suppression impossible', ['status' => 500]);
	}

	return rest_ensure_response([
		'success' => true,
		'comment' => $fichier.' : Fichier supprimé'
	]);
}


	file_put_contents(__DIR__ . '/monlog.txt', "🔍 avant enqueue fontawesome \n", FILE_APPEND);

/**
* Fonctions  appelées au chargement du plugin
*/

// Enregistrement de fontawesome
function vtmt_enqueue_fontawesome() {
    // Vérifie si FontAwesome n'est pas déjà chargé par le thème
    if ( ! wp_style_is( 'font-awesome', 'enqueued' ) ) {
        wp_enqueue_style(
            'font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
            array(),
            '6.4.2',
            'all'
        );
    }
}
add_action( 'wp_enqueue_scripts', 'vtmt_enqueue_fontawesome', 5 );

	file_put_contents(__DIR__ . '/monlog.txt', "🔍 avant enqueue ressources \n", FILE_APPEND);


// Enregistrement des scripts et styles
function vt_music_training_ressources_enqueue() {
	
	//echo plugin_dir_url(__FILE__) . 'assets/js/vt-functions.js';
	
	wp_enqueue_script('jquery' );
    wp_enqueue_script('vt-music-training-functions-generales', plugin_dir_url(__FILE__) . 'assets/js/vt-functions.js', array('jquery'), false, true);
    wp_enqueue_script('vt-music-training-fonctions-specifiques', plugin_dir_url(__FILE__) . 'assets/js/vt-music-training.js', array(), false, true);
    wp_enqueue_script('vt-music-training-fonctions-lecteur', plugin_dir_url(__FILE__) . 'assets/js/vt-gestion-lecteur-audio-video.js', array(), false, true);
//    wp_enqueue_script('vt-music-training-management-fichiers', plugin_dir_url(__FILE__) . 'assets/js/vt-files-mngt.js', array(), false, true);
	
	wp_enqueue_style('vt-music-training-style', plugin_dir_url(__FILE__) . 'assets/css/vt-style.css', array(), '1.0', 'all');
	wp_enqueue_style('vt-music-training-palette-couleurs', plugin_dir_url(__FILE__) . 'assets/css/vt-palette.css', array(), '1.0', 'all');
//	wp_enqueue_style('vt-music-training-font-inter', plugin_dir_url(__FILE__) . 'assets/css/font-inter.css', array(), '1.0', 'all');
}
add_action('init', 'vt_music_training_ressources_enqueue');

	file_put_contents(__DIR__ . '/monlog.txt', "🔍 avant register blocks \n", FILE_APPEND);

// Enregistrement des blocks
add_action('init', function () {
	
	register_block_type( __DIR__ . '/build/bloc-section' );
	// creation d'un 'nonce'
	wp_add_inline_script(
		'vt-music-training-bloc-section-editor-script', // le handle défini dans le block.json du bloc racine
		'const vtmtData = ' . wp_json_encode([
			'nonce' => wp_create_nonce('wp_rest')
		]) . ';',
		'before'
	);

	register_block_type( __DIR__ . '/build/block-test' );
	register_block_type( __DIR__ . '/build/bloc-oeuvre' );
	register_block_type( __DIR__ . '/build/bloc-module' );
	register_block_type( __DIR__ . '/build/bloc-fichiers-de-travail' );
	register_block_type( __DIR__ . '/build/un-fichier-tutti' );
	register_block_type( __DIR__ . '/build/des-fichiers-pupitre' );
	register_block_type( __DIR__ . '/build/une-interpretation' );
	register_block_type( __DIR__ . '/build/bloc-prononciation' );
	register_block_type( __DIR__ . '/build/une-prononciation' );
	register_block_type( __DIR__ . '/build/index-oeuvre' );
	//register_block_type( __DIR__ . '/build/appel-index-oeuvre' );
    // Enregistrement de la catégorie de motifs ??
	register_block_pattern_category( 'agencement', array( 'label' => __( 'Agencement de page' ) ) );
});

	file_put_contents(__DIR__ . '/monlog.txt', "🔍 avant ispihone \n", FILE_APPEND);

add_action('wp_enqueue_scripts', function() {
    // Détection de l'appareil
    $ua = $_SERVER['HTTP_USER_AGENT'];
    $is_iphone = preg_match('/iphone/i', $ua) || preg_match('/ipad/i', $ua) || preg_match('/ipod/i', $ua);

    // Injecter une variable JavaScript avant le script du bloc
    wp_add_inline_script(
        'vt-music-training-bloc-oeuvre', // Identifiant du script, basé sur `block.json`
        'window.blockEditorData = { isIphone: ' . ($is_iphone ? 'true' : 'false') . ' };',
        'before'
    );
});

/*
function vt_music_training_enqueue_shadow_dom_scripts() {
    wp_enqueue_script(
        'vt-music-training-shadow-dom',
        plugin_dir_url(__FILE__) . 'js/shadow-dom-handler.js',
        [],
        '1.0.0',
        true
    );
}
add_action('init', 'vt_music_training_enqueue_shadow_dom_scripts');
*/

	file_put_contents(__DIR__ . '/monlog.txt', "🔍 avant epage réglages \n", FILE_APPEND);
/**
Page de Réglages
*/

function vt_music_training_add_settings_page() {
    add_options_page(
        'Réglages de vt-music-training',  // Titre de la page
        'vt-music-training',             // Nom dans le menu
        'manage_options',         // Capacité requise
        'vt-music-training-settings',      // Identifiant unique
        'vt_music_training_render_settings_page' // Fonction d'affichage
    );
}
add_action( 'admin_menu', 'vt_music_training_add_settings_page' );

function vt_music_training_render_settings_page() {
    ?>
    <div class="wrap">
        <h1>Réglages de vt-music-training</h1>
		<div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; background-color: #f9f9f9;">
			<p style="font-family: 'Inter var', courier; font-size: 1.2rem; margin: 0;">
				<strong>Aperçu :</strong> Ceci est un test de rendu avec la police actuelle.
			</p>
		</div>
		<p style="color: red;">Si l'échantillon ci-dessus est écrit en police "courier", activez-le chargement le la police "Inter var".<br />Cette police est indispensable pour assurer une mise en page correcte des pages d'entrainement</p>
		<!--<div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; background-color: #f9f9f9;">
			<p style="font-family: 'Inter var', courier; font-size: 1.2rem; margin: 0;">
				<strong>Aperçu :</strong> Ceci est une icone FontAwesome : <i class="far fa-angry"></i>
			</p>
		</div>
		<p style="color: red;">Si l'émoticone "colère" n'apparaît pas ci-dessus, activez-le chargement de la police "FontAwesome".<br />Cette police est indispensable pour assurer un rendu correct des pages d'entrainement</p>-->
        <form method="post" action="options.php">
            <?php
            settings_fields( 'vt_music_training_settings_group' ); // Groupe de paramètres
            do_settings_sections( 'vt-music-training-settings' );  // ID unique de la page
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

function vt_music_training_register_settings() {
    register_setting(
        'vt_music_training_settings_group', // Groupe de paramètres
        'vt_music_training_settings'        // Option stockée dans la base de données
    );

    // Section pour les polices
    add_settings_section(
        'vt_music_training_fonts_section',       // ID de la section
        'Options des Polices',          // Titre
        null,                           // Callback pour la description (facultatif)
        'vt-music-training-settings'             // ID de la page
    );

    /*// Champ pour activer/désactiver FontAwesome
    add_settings_field(
        'vt_music_training_load_fontawesome',        // ID du champ
        'Charger FontAwesome',             // Label
        'vt_music_training_render_checkbox_field',  // Fonction de rendu
        'vt-music-training-settings',               // ID de la page
        'vt_music_training_fonts_section',          // Section de rattachement
        [
            'label_for' => 'vt_music_training_load_fontawesome',
            'option_name' => 'vt_music_training_settings',
            'key' => 'load_fontawesome',
        ]
    );*/

    // Champ pour activer/désactiver Inter var
    add_settings_field(
        'vt_music_training_load_inter_var',
        'Charger Inter var',
        'vt_music_training_render_checkbox_field',
        'vt-music-training-settings',
        'vt_music_training_fonts_section',
        [
            'label_for' => 'vt_music_training_load_inter_var',
            'option_name' => 'vt_music_training_settings',
            'key' => 'load_inter_var',
        ]
    );
}
add_action( 'admin_init', 'vt_music_training_register_settings' );

// Fonction générique pour afficher un champ case à cocher
function vt_music_training_render_checkbox_field( $args ) {
    $options = get_option( $args['option_name'] );
    $key = $args['key'];
    ?>
    <input type="checkbox" id="<?php echo esc_attr( $args['label_for'] ); ?>"
           name="<?php echo esc_attr( $args['option_name'] . '[' . $key . ']' ); ?>"
           value="1" <?php checked( 1, isset( $options[ $key ] ) ? $options[ $key ] : 0 ); ?>>
    <?php
}

function enqueue_plugin_vt_music_training_styles() {
    $options = get_option( 'vt_music_training_settings' );
    /*// Charger FontAwesome si activé
    if ( isset( $options['load_fontawesome'] ) && $options['load_fontawesome'] ) {
		wp_enqueue_style( 'font-awesome', plugin_dir_url(__FILE__) . 'fonts/fontawesome-free-6.4.2-web/css/all.min.css',array(),'6.4.2','all' );
//        wp_enqueue_style( 'font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', array(), '6.0.0' );
    }*/

    // Charger Inter var si activé
    if ( isset( $options['load_inter_var'] ) && $options['load_inter_var'] ) {
        wp_enqueue_style( 'inter-var', plugin_dir_url(__FILE__) . 'assets/css/font-inter.css?ver=1.0.1', array(), null );
    }
}
add_action( 'init', 'enqueue_plugin_vt_music_training_styles' );
add_action('enqueue_block_editor_assets', 'enqueue_plugin_vt_music_training_styles');


function vt_music_training_add_settings_link( $links ) {
    // Ajoutez le lien de réglages
    $settings_link = '<a href="options-general.php?page=vt-music-training-settings">Réglages</a>';
    array_unshift( $links, $settings_link ); // Ajoutez en tête de liste
    return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'vt_music_training_add_settings_link' );
/*
function vt_music_training_enqueue_editor_assets() {
    wp_enqueue_script(
        'vt-music-training-editor-customizations',
        plugin_dir_url( __FILE__ ) . 'editor-customizations.js',
        [ 'wp-blocks', 'wp-editor', 'wp-data', 'wp-hooks' ],
        '1.0.0',
        true
    );
   // Indique que le fichier est un module
	wp_script_add_data( 'vt-music-training-editor-customizations', 'type', 'module' ); //Ne fonctionne pas. Suppléé par l'add_filter(''script_loader_tag') ci après
}
add_action( 'enqueue_block_editor_assets', 'vt_music_training_enqueue_editor_assets' );
*/
/*
add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
    if ( 'vt-music-training-editor-customizations' === $handle ) {
        // Ajoute 'type="module"' tout en conservant les autres attributs
        $tag = str_replace( '<script ', '<script type="module" ', $tag );
    }
    return $tag;
}, 10, 3 );
*/