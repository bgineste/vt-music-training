/*
Pour générer des nonces pour les fonctions qui en ont besoin (upload de fichiers par exemple)
*/

window.vtmtData = {
	nonce: '<?php echo wp_create_nonce( "wp_rest" ); ?>'
};
