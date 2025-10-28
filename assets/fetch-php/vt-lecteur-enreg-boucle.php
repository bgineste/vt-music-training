<?php

/* Appelé par vt-gestion-lecteur-audi-video.js */
header("content-type: application/json; charset=utf-8");

// On remonte 5 niveaux depuis ce fichier pour atteindre la racine WordPress
// (htdocs/wp-load.php). Si l'arborescence change, il faudra ajuster ce chiffre.
	require_once(dirname(__DIR__, 5).'/wp-load.php');  

	global $wpdb;
	
	$action = $_POST["action"];
	if (empty($action)) {wp_send_json_error("Pas d'action requise");}
	//echo "action : ".$action;

	$pseudo = $_POST["utilisateur"];
	//echo "pseudo : ".$pseudo;
	$nom_fic = $_POST["nomfic"];

	$table_name = 'vt_zboucles';  // défini dans vt-music-training.php


	switch ($action) {

	case "lecture-boucles":
		
	//	$sql = "SELECT * FROM `mod994_zboucles` WHERE `pseudo-choriste` = '".$pseudo."' AND `nom-fichier` = '".$nom_fic."'";
		$sql = "SELECT * FROM `".$table_name."` WHERE `pseudo-utilisateur` = %s AND `nom-fichier` = %s";
		$r_sql = $wpdb->get_row($wpdb->prepare($sql,$pseudo,$nom_fic),ARRAY_A);
		if ( null === $r_sql ) {
			wp_send_json_success("Pas de boucles");
		} else {
			$boucles = array();
			foreach ( $r_sql as $boucle ) {
				$boucles[$boucle['nom-boucle']] = $boucle ['bornes-boucle'];
			}
			wp_send_json_success($boucles);
		}
		
		/*$r_sql = $conn->query($sql);
		if ($r_sql!=FALSE && $r_sql->num_rows > 0) {
			$boucles=array();
			while($row = $r_sql->fetch_assoc()){
			  $boucles[$row['nom-boucle']] = $row['bornes-boucle'];
			}
//			$boucles['vocalise-1'] = [15,20];
//		$boucles['vocalise-2'] = [40,60];
			echo json_encode($boucles);
		} else {
			echo "Pas de boucles";
		} */
	break;
/*	case "enreg-boucle":
		$nom_boucle = $_POST["nomBoucle"];
		$d_boucle=$_POST["dBoucle"];
		$f_boucle=$_POST["fBoucle"];
		$bornes_boucle = $d_boucle."|".$f_boucle;
		$nom_fic=$_POST["nomFic"];
		// vérifier l'existence de la boucle
		$verif = "SELECT * FROM `mod994_zboucles` WHERE `pseudo-choriste` = '".$pseudo."' AND `nom-fichier` = '".$nom_fic."' AND `nom-boucle` = '".$nom_boucle."'";
//		echo $verif."***";
		$r_verif = $conn->query($verif);
		if ($r_verif!=FALSE && $r_verif->num_rows > 0) {
			$sql = "UPDATE `mod994_zboucles` SET `bornes-boucle` = '".$bornes_boucle."'  WHERE `pseudo-choriste` = '".$pseudo."' AND `nom-fichier` = '".$nom_fic."' AND `nom-boucle` = '".$nom_boucle."'";
//			echo "Boucle '".$nom_boucle."' mise à jour !";
			if($conn->query($sql)===TRUE){
				echo "Boucle '".$nom_boucle."' mise à jour !";
			}
		} else {
			$sql = "INSERT INTO `mod994_zboucles` (`boucle-ID`, `pseudo-choriste`, `nom-fichier`, `nom-boucle`, `bornes-boucle`) VALUES (0,'".$pseudo."','".$nom_fic."','".$nom_boucle."','".$bornes_boucle."')";
			if($conn->query($sql)===TRUE){
				echo "Boucle '".$nom_boucle."' enregistrée !";
			}
		}
	break;
	case "suppr-boucle":
		$nom_boucle = $_POST["nomBoucle"];
		$nom_fic=$_POST["nomFic"];
		// vérifier l'existence de la boucle
		$verif = "SELECT * FROM `mod994_zboucles` WHERE `pseudo-choriste` = '".$pseudo."' AND `nom-fichier` = '".$nom_fic."' AND `nom-boucle` = '".$nom_boucle."'";
//		echo $verif."***";
		$r_verif = $conn->query($verif);
		if ($r_verif!=FALSE && $r_verif->num_rows > 0) {
			$sql = "DELETE FROM `mod994_zboucles` WHERE `pseudo-choriste` = '".$pseudo."' AND `nom-fichier` = '".$nom_fic."' AND `nom-boucle` = '".$nom_boucle."'";
//			echo "Boucle '".$nom_boucle."' mise à jour !";
			if($conn->query($sql)===TRUE){
				echo "ok";
			}
		} else {
				echo "bug ".$pseudo."*".$nom_boucle."*".$nom_fic."/"; // ne devrait pas se produire
		}
	break;
*/
}

/*
//	fermer la bdd
unset($conn);
*/