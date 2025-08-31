/*
Fonctions lecteurs audio et video (plugin vt-music-training)
V 1.0
*/
// DANS CE SCRIPT ON POSTULE QU'IL N'Y A, A TOUT INSTANT, QU'UN SEUL LECTEUR DEFINI DANS LE NAVIGATEUR



/**-----------------------------------------------------------------------------------------------
* FONCTIONS DU LECTEUR
------------------------------------------------------------------------------------------------*/

var vtLecteur = null;

var pseudoChoriste = null; // pas nécessaire
const vt_urlPHP_TraitementBoucles ='/wp-content/themes/twentytwenty-vt/js/mediaplayer-enreg-boucle.php';
//const urlPHP_TraitementBoucles ='http://voce-tolosa.ddns.net/sript-php-externe/';

//var vtAffVitesse = null; // champ d'affichage de la vitesse d'exécution
//var vtBtnPlayPause = null; // Bouton play/pause
//var vtBtnRepeteEnBoucle = null // Bouton Répète tout le morceau push/pull
//var vtEtatRepeteEnBoucle = false; // indique sila répétition du morceau est activée
//var vtRepeteEnBoucleID = null;
//var vtbtnBoucler = null; // Bouton boucle push/pull
// var vtLoopID = null;
//var vtTdebBoucle = 0;
//var vtTfinBoucle = 0;
//var vtAffDebBoucle = null; // champ d'affichage de l'heure de début de boucle
//var vtAffFinBoucle = null; // champ d'affichage de l'heure de la fin de boucle
//var vtEtatBoucle = false; // indique si une boucle est activée
//var vtIdSaisieNomBoucle = "";
//var vtBouclesDefinies ={};
//var vtIdChoixBoucle = "";
var vtPupitreActuel = null;
var vtMediaPlayer = null;
var vtSuffixePlayer = null;
var vtNomFichierSourceAudioVideo = null;
var vtClasseLecteur = "";

const vtoBalance = {
	audioContext: null,
	audioSource: null,
	volumeNodeL: null,
	volumeNodeR: null,
	channelsCount: null,
	splitterNode: null,
	mergeNode: null
}

/*
const vtBalance = Object.create(vtoBalance);
*/

function vtIsIphone() {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return false; // Environnement non compatible (par ex. Node.js)
  }

  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Vérifie iPhone, iPod ou iPad
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);

  // Cas particulier pour iPadOS 13+ qui s'identifie comme "Macintosh"
  const isTouchMac = ua.includes("Macintosh") && 'ontouchend' in document;

  return iOSDevice || isTouchMac;
}
const vtoEnvt = {
	isIphone: true
}
const vtEnvt = Object.create(vtoEnvt);
vtEnvt.isIphone =  vtIsIphone();



function vtActiverLecteur(cheminFichier, nomFichier, typeFichier, affichageClavier, fichierStereo) {
		
	let vtBlocLecteur = document.getElementById("vt--bloc-lecteur");
	let source = cheminFichier + nomFichier;
	
	/*var datasBalance = {
		audioContext: null,
		audioSource: null,
		volumeNodeL: null,
		volumeNodeR: null,
		channelsCount: null,
		splitterNode: null,
		mergeNode: null
	};
*/

	console.log('vtActiverLecteur/source : ' + cheminFichier + ' - ' + nomFichier);
	switch (typeFichier) {
		case "v":
			console.log("tag video");
			vtBlocLecteur.innerHTML='<video controls="" autoplay="" playsinline="" preload="no" controlslist="nodownload" data-origwidth="0" data-origheight="0" src= "' + source + '"><p>Votre navigateur est trop ancien pour lire ce fichier</p></video>';
		break;
		case "a":
			console.log("tag audio");
			vtBlocLecteur.innerHTML='<audio style="margin-top: 20px;" controls="" autoplay="" playsinline="" preload="no" controlslist="nodownload" data-origwidth="0" data-origheight="0" src= "' + source + '"><p>Votre navigateur est trop ancien pour lire ce fichier</p></video>';
		
		break;
	}
	vtLecteur = vtBlocLecteur.firstElementChild;
	// Initialiser tous les attributs 
	Object.assign(vtLecteur, {
		src: source,				// fichier audio ou vidéo 
		boutonPlayPause: document.getElementById("vt--PlayPause"),
		// les attributs
		etatRepeterEnBoucle: false,  // boucle sur tout de morceau
		btnRepeterEnBoucle: null,    // le bouton "répète en boucle tout le morceau"
		affVitesse: null,			// le champ d'affichage de la vitesse
		etatBoucle: false,			// boucle active sur un segment
		btnBoucler: null, 			// Bouton boucle push/pull
		affDebBoucle: null,			// le champ d'affichage du début de boucle
		affFinBoucle: null,			// le champ d'affichage de la fin de boucle
		tDebBoucle: 0,				// moment du début de boucle
		tFinBoucle: 0,				// moment de fin de boucle
		boucleID: null,				// constante associée à l'itération de la boucle
		bouclesDefinies: {},
		//idSaisieNomBoucle: "vt--saisie-nom-boucle",
		//idChoixBoucle: "choix-boucle",
		oChoixBoucle: null,			// objet html 'select' associé au tableau des boucles enregistrées
		stereo: false,
		oBalance: null,		// données de la stéréo
		// les méthodes
		SetEcoutePlayPause: vtSetEcoutePlayPause,
		ActualiserBoutonPlayPause: vtActualiserBoutonPlayPause,
		RepeterEnBoucle: vtRepeterEnBoucle,
		Rembobiner: vtRembobiner,
		Sauter: vtSauter,
		AjusterVitesse: vtAjusterVitesse,
		DefDebBoucle: vtDefDebBoucle,
		DefFinBoucle: vtDefFinBoucle,
		ElargirCompteurBoucle: vtElargirCompteur,
		TraiterFleche: vtTraiterFleche,
		OnOffBoucle: vtOnOffBoucle,
		PlayPause: vtEventPlayPause,
		InitBalance: vtInitBalance,
		SetVol: vtSetVol,
		//Play: vtPlay,
		//Pause: vtPause,
		DesactiverLecteurEntrainement: vtDesactiverLecteurEntrainement
	});

	/*if (window.attachBalanceSetters) {
		window.attachBalanceSetters(vtLecteur);
	}*/

	vtLecteur.SetEcoutePlayPause("actif");

	// affichage du clavier ?
	if (affichageClavier === "false") {
		document.getElementById("vt--clavier-lecteur").style.display = 'none';
	} else {
		vtLecteur.stereo = !(fichierStereo === "false" || vtEnvt.isIphone === true);
		// affichage de la balance stéréo ?
		if (!vtLecteur.stereo) {
			document.getElementById("vt--balance").style.display = 'none';
		}

		// actualisation symbole bouton play/pause
		console.log("initialisation du bouton play/pause");
		vtLecteur.ActualiserBoutonPlayPause();

		// actualisation du compteur de vitesse
		let PBR = vtLecteur.playbackRate;
		let Rate = parseInt(100*PBR,10);

		vtLecteur.AffVitesse = document.getElementById("vt--aff-vitesse");			   
		if (vtLecteur.AffVitesse != null) {
			vtLecteur.AffVitesse.innerHTML = Rate+ '%';
		}
		
		
		// initialisation des compteurs de boucles
		vtLecteur.AffDebBoucle = document.getElementById("vt--deb-boucle");			   
		vtLecteur.AffFinBoucle = document.getElementById("vt--fin-boucle");			   
		vtLecteur.AffDebBoucle.innerHTML = '00:00';
		vtLecteur.AffFinBoucle.innerHTML = '00:00';
		// initialisation du bouton de lancement des boucles
		vtLecteur.btnBoucler = document.getElementById("vt--btn-boucle");
		vtLecteur.oChoixBoucle = document.getElementById("vt--choix-boucle");
		// initialisation de la balance le cas échéant
		if (vtLecteur.stereo) {
//			vtLecteur.oBalance = Object.create(vtoBalance);
			vtLecteur.InitBalance();
		}
		//vtLecteur.oBalance = Object.create(datasBalance);
		
		
	}
	// pour finir : afficher (libérer le masque)
	document.getElementById("vt--lecteur-entrainement").removeAttribute("style");
	document.getElementsByTagName('body')[0].style.overflowY='hidden';
	
}


function vtDesactiverLecteurEntrainement(MasqueModalLecteur) {
// 	fusion avec vtFermeLecteur
//	document.getElementById(idMasqueLecteur).style.display='none';
	// Effacer le lecteur et rendre le scroll à body
	MasqueModalLecteur.style.display='none';
	document.getElementsByTagName('body')[0].style.overflowY='auto';
	// désactiver le lecteur
	
	vtLecteur.SetEcoutePlayPause("inactif");
	vtLecteur.pause();
	clearInterval(vtLecteur.boucleID);
	vtLecteur.boucleID = null; // V3.2
	if (vtLecteur.etatRepeterEnBoucle && vtLecteur.btnRepeterEnBoucle) {
		vtLecteur.btnRepeterEnBoucle.classList.remove("vt--bouton-clavier-enfonce");
	}
	/* pas nécessaire : initialisation faire à l'activation */
	vtLecteur.AffDebBoucle.innerHTML = '00:00';
	vtLecteur.AffFinBoucle.innerHTML = '00:00';
	document.getElementById("vt--clavier-lecteur").removeAttribute("style");
	if (vtEnvt.isIphone === false) {
		document.getElementById("vt--balance").removeAttribute("style");
	}
	vtLecteur = null;
}
/*
function vtPlayLecteur() {
	if (vtLecteur != null) {
		vtLecteur.play()
		vtLecteur.ActualiserBoutonPlayPause()
	}
}
function vtPauseLecteur() {
	if (vtLecteur != null) {
		vtLecteur.pause()
		console.log("pause")
		vtLecteur.ActualiserBoutonPlayPause()
	}
}
*/
function vtFermeLecteur() {
	if (vtLecteur != null) {
		vtLecteur.pause()
		//vtLecteur.boutonPlayPause.classList.remove("vt--pause")
		//vtLecteur.boutonPlayPause.classList.add("vt--play")
		vtBoutonPlayPause("pause")
		vtLecteur.boutonPlayPause.classList.remove("vt--bouton-init-actif")
		vtLecteur.boutonPlayPause.classList.add("vt--bouton-init")
		//vtLecteur.boutonPlayPause.removeEventListener('click', vtEventPlayPause)
		
		clearInterval(vtLecteur.boucleID)
		//RAZ de tous les attributs
		vtLecteur = null
	}
}



// fusionner init et start 


/**------------------------------------------------------------------------------------
* Fonctions de rappel des écoutes
-------------------------------------------------------------------------------------*/

// vtLecteur.PlayPause (fonction on/off)
function vtEventPlayPause() {
	if (vtLecteur != null) {
		if (vtLecteur.paused) {
			vtLecteur.play()
			vtLecteur.ActualiserBoutonPlayPause()
		} else {
			vtLecteur.pause()
//			console.log("pause")
			vtLecteur.ActualiserBoutonPlayPause()
		}
	}
}

// vetLecteur.InitBalance
function vtInitBalance() {
	vtLecteur.oBalance = Object.create(vtoBalance);
	with (vtLecteur.oBalance) {
		audioContext = new AudioContext();
		audioSource = audioContext.createMediaElementSource(vtLecteur);
		volumeNodeL = new GainNode(audioContext);
		volumeNodeR = new GainNode(audioContext);

		volumeNodeL.gain.value = 1;
		volumeNodeR.gain.value = 1;

		channelsCount = 2; // or read from: 'audioSource.channelCount'

		splitterNode = new ChannelSplitterNode(audioContext, { numberOfOutputs: channelsCount });
		mergerNode = new ChannelMergerNode(audioContext, { numberOfInputs: channelsCount });

		audioSource.connect(splitterNode);

		splitterNode.connect(volumeNodeL, 0); // connect OUTPUT channel 0
		splitterNode.connect(volumeNodeR, 1); // connect OUTPUT channel 1

		volumeNodeL.connect(mergerNode, 0, 0); // connect INPUT channel 0
		volumeNodeR.connect(mergerNode, 0, 1); // connect INPUT channel 1

		mergerNode.connect(audioContext.destination);
//	alert("volume gauche " + vtLecteur.oBalance.volumeNodeL.gain.value);
//	alert("volume droit " + vtLecteur.oBalance.volumeNodeR.gain.value);
		audioSource.src = vtLecteur.src
	}
}

// vtLecteur.SetVol
function vtSetVol(GD, val) {
	switch (GD) {
		case "G":
			vtLecteur.oBalance.volumeNodeL.gain.value = val;
			break;
		case "D":
			vtLecteur.oBalance.volumeNodeR.gain.value = val;
			break;
	}
}

function setBalance(val) {
  vtLecteur.oBalance.volumeNodeL.gain.value = 1 - val;
  vtLecteur.oBalance.volumeNodeR.gain.value = 1 + val;
}



// vtLecteur.RepeterEnBoucle
function vtRepeterEnBoucle(btnRepeterEnBoucle=null) { // push/pull répète en boucle la totalité du morceau
//	console.log(vtEtatRepeterEnBoucle);
	if (!vtLecteur) {return}
	if (!vtLecteur.btnRepeterEnBoucle && btnRepeterEnBoucle) {
		Object.assign(vtLecteur, { 		
		btnRepeterEnBoucle: btnRepeterEnBoucle    // le bouton "répète en boucle"
	});
	}
	let etatRepeterEnBoucle = vtLecteur.etatRepeterEnBoucle;
	if (!etatRepeterEnBoucle) {
		if (vtLecteur.etatBoucle) { vtOnOffBoucle();} // Si une boucle est active on l'arrête
		vtLecteur.btnRepeterEnBoucle.classList.add("vt--bouton-clavier-enfonce");
//		Lecteur.currentTime=0;
		console.log(vtLecteur.duration);
		vtLecteur.boucleID=setInterval(function(){
			if (vtLecteur.currentTime >= vtLecteur.duration) {
				vtLecteur.currentTime=0;
				if (vtLecteur.paused) {
					vtLecteur.play();
				}
			}
		},800);
		vtLecteur.etatRepeterEnBoucle = true;
		// aspect
	} else {
		clearInterval(vtLecteur.boucleID);
		vtLecteur.boucleID = null; // V3.2
		vtLecteur.btnRepeterEnBoucle.classList.remove("vt--bouton-clavier-enfonce");
		vtLecteur.etatRepeterEnBoucle = false;
		
	}
	
}

// vtLecteur.Rembobiner
function vtRembobiner(){
	if (vtLecteur) {
		vtLecteur.pause();
		vtLecteur.currentTime=0;
		vtLecteur.play();
	}
}
	
// vtLecteur.Sauter
function vtSauter(duree){
	if (vtLecteur) {
		let end = vtLecteur.seekable.end(0);
		let curseur = vtLecteur.currentTime + duree;
		vtLecteur.currentTime = curseur  > end ? end : curseur < 0 ? 0 : curseur ;
	}
}

// vtLecteur.AjusterVitesse
function vtAjusterVitesse(valeur) {
	if (vtLecteur) {
		let Rate = 0;
		switch (valeur) {
			case 'down':
				if (vtLecteur.playbackRate > .50) {
					vtLecteur.playbackRate -= .05;
				}
				Rate = parseInt(100*vtLecteur.playbackRate + 0.99,10); //Math.ceil(100*PBR);
			break;
			case 'up':
				if (vtLecteur.playbackRate < 1.25) {
					vtLecteur.playbackRate += .05;
				}
				Rate = parseInt(100*vtLecteur.playbackRate,10);
			break;
			case 'normal': 
				vtLecteur.playbackRate = 1;
				Rate = 100;
			break;
		}
		if (vtLecteur.AffVitesse != null) {
			vtLecteur.AffVitesse.innerHTML = Rate+ '%';
		}
		
	}
}

// vtLecteur.DefDebBoucle
function vtDefDebBoucle() {
	let nDeb = vtLecteur.currentTime;
	vtLecteur.tDebBoucle = parseInt(nDeb,10); //Math.floor(nDeb);
	
   if (vtLecteur.AffDebBoucle != null) {
		vtLecteur.AffDebBoucle.innerHTML = cvSecTime(vtLecteur.tDebBoucle);
   }
}

// vtLecteur.DefFinBoucle
function vtDefFinBoucle() {
	let nFin = vtLecteur.currentTime;
	vtLecteur.tFinBoucle = parseInt(nFin,10); //Math.floor(nFin);
	
   if (vtLecteur.AffFinBoucle != null) {
		vtLecteur.AffFinBoucle.innerHTML = cvSecTime(vtLecteur.tFinBoucle);
   }
}

// vtLecteur.TraiterFleche
function vtTraiterFleche(signatureFleche) {
	let borneBoucle = ""; // "debBoucle" ou "finBoucle"
	let typeFleche = "";   // "flecheGauche" (diminuer le moment) ou "flecheDroite" (augmenter le moment)
	switch (signatureFleche) {
		case 'vt--deb-boucle-moins':
			borneBoucle = "debBoucle";
			typeFleche = "flecheGauche";
		break;
		case 'vt--deb-boucle-plus':
			borneBoucle = "debBoucle";
			typeFleche = "flecheDroite";
		break;
		case 'vt--fin-boucle-moins':
			borneBoucle = "finBoucle";
			typeFleche = "flecheGauche";
		break;
		case 'vt--fin-boucle-moins':
			borneBoucle = "finBoucle";
			typeFleche = "flecheDroite";
		break;
	}
	let horodate = 0;
	let lcr = 0;
	let lcrInit = vtLecteur.currentTime;
	let dansLaBoucle = (lcrInit >= vtLecteur.tDebBoucle && lcrInit <= vtLecteur.tFinBoucle); // V3.2
	//var attente = 0;
	if (borneBoucle == "debBoucle") {horodate = parseInt(vtLecteur.tDebBoucle);} else {horodate = parseInt(vtLecteur.tFinBoucle);}
	if (typeFleche == "flecheGauche") {horodate = horodate - 1;} else {horodate = horodate + 1;}
	if (horodate < 0) {horodate = 0;}
	if (horodate > vtLecteur.seekable.end(0)) {horodate = parseInt(vtLecteur.seekable.end(0),10);}
	if (borneBoucle == "debBoucle") {
		vtLecteur.tDebBoucle = horodate;
		vtLecteur.AffDebBoucle.innerHTML = cvSecTime(horodate);
	} else {
		vtLecteur.tFinBoucle = horodate;
		vtLecteur.AffFinBoucle.innerHTML = cvSecTime(horodate);
	}
	if (vtLecteur.EtatBoucle && dansLaBoucle) {
		if (vtLecteur.boucleID != null) {
			// on est peut-être sorti de l'intervalle de la boucle (qui vient d'être modifié)
			lcr = vtLecteur.currentTime;
			if (lcr < vtLecteur.tDebBoucle || lcr >= vtLecteur.tFinBoucle) { 
				vtLecteur.currentTime = vtLecteur.tDebBoucle;
			}
/*			boucleID=setInterval(function(){
				if (vtLecteur.currentTime >= tFinBoucle) vtLecteur.currentTime=tDebBoucle;
			},800); */
			
		}
	}
}

// vtLecteur.ElargirCompteurBoucle
function vtElargirCompteur(idCompteur) {
	var x = document.getElementById(idCompteur);
	x.classList.add("vt--support-compteur-elargi");
	
}

// vtLecteur.OnOffBoucle
function vtOnOffBoucle(){ //Push / Pull bouton Lance boucle
	//alert(EtatBoucle);
	var lcr = 0;
//	var attente = 0;
	if (!vtLecteur.etatBoucle) {
		if (parseFloat(vtLecteur.tFinBoucle) <= parseFloat(vtLecteur.tDebBoucle)) {
			return;
		}
		// si on est en train de boucler sur le morceau : on arrête ce bouclage avant de lancel la boucle définie					 
		if (vtLecteur.etatRepeterEnBoucle) { vtLecteur.RepeterEnBoucle();}
		vtLecteur.btnBoucler.classList.add("vt--bouton-clavier-enfonce");
		lcr = parseInt(vtLecteur.currentTime);
		// le lecteur n'est pas dans l'intervalle de la boucle : on le ramène au début de la boucle
		// sinon on diffère la fonction interval du temps restant
		if (lcr < vtLecteur.tDebBoucle || lcr >= vtLecteur.tFinBoucle) { 
			vtLecteur.currentTime=vtLecteur.tDebBoucle;
		}
		vtLecteur.boucleID=setInterval(function(){
			if (vtLecteur.currentTime >= vtLecteur.tFinBoucle) vtLecteur.currentTime = vtLecteur.tDebBoucle;
		},800);
		vtLecteur.etatBoucle = true;
		// aspect
	} else {
		// on arrête la boucle
		clearInterval(vtLecteur.boucleID);
		vtLecteur.boucleID = null;	// V2.1
		vtLecteur.tDebBoucle = 0;
		vtLecteur.tFinBoucle = parseInt(vtLecteur.duration,10);
		vtLecteur.btnBoucler.classList.remove("vt--bouton-clavier-enfonce");
		vtLecteur.etatBoucle = false;
		// aspect
		
	}
}

// vtLecteur.SetEcoutePlayPause
function vtSetEcoutePlayPause(etatEcoute) {
	// il s'agit d'écouter ou non la touche play/pause des controls du lecteur
	// l'écoute de la touche play/pause du clavier est réaliser par addEventListener
	// etatEcoute :"actif","inactif"

	if (etatEcoute === "actif") {
		vtLecteur.addEventListener('play', vtLecteur.ActualiserBoutonPlayPause);
		vtLecteur.addEventListener('pause', vtLecteur.ActualiserBoutonPlayPause);
	} else {
		vtLecteur.removeEventListener('play', vtLecteur.ActualiserBoutonPlayPause);
		vtLecteur.removeEventListener('pause', vtLecteur.ActualiserBoutonPlayPause);
	}
}

// vetLecteur.ActualiserBoutonPlayPause
function vtActualiserBoutonPlayPause() {
	if (vtLecteur != null) {
		let etatLecteur = (vtLecteur.paused) ? "pause" : "play"
//		console.log(etatLecteur)
		let target = vtLecteur.boutonPlayPause.firstElementChild
		if (target) {
			if (etatLecteur === "pause") {
				target.classList.remove("fa-pause")
				target.classList.add("fa-play")		
			} else {
				target.classList.remove("fa-play")
				target.classList.add("fa-pause")		
			}
		}
	}
}



/*
function vtBtnPlayPause(type="audio",fichier="",bouton=null,start=true,annuleLecteurApresLecture=false) {
	if (vtLecteur == null) {
		vtInitLecteur(type="audio",fichier="",bouton=null,start=true,annuleLecteurApresLecture=false);
	}
}
*/
// passer les paramètres sous la forme d'array - prévoir la possibilité d'utiliser ou non les balises audio vidéo et leurs contrôles - ainsi on pourrait synchroniser ces contrôles avec ceux du script, voire supprimer ceux du scripts et n'ajouter que ceux qui font défaut : la balance G/D par exemple.

// UTILITE DE LA FONCTION SUIVANTE ?

function vtTraiteBoutonInitLecteur(baliseLecteur,typeLecteur,fichierMusique,boutonInitLecteur,boutonPlayPause,startAuto=true,fermeLecteurFinLecture=false) {
	// vtTraiteBoutonInitLecteur est utilisé pour le bloc 'une prononciation' seulement 

	// baliseLecteur : objet <audio> ou <video> s'il existe
	// typeLecteur : "audio" ou "video"
	// fichierMusique : fichier .mp3 ou .mp4
	// boutonInitLecteur : objet bouton qui active le lecteur (peut être, dans certain cas, le même que le boutonPlayPause)
	// boutonPlayPause : objet bouton qui commande play et pause (qui initialise le lecteur au premier clic, s'il fait fonction de boutonInitLecteur)
	// startAuto : booléen pour le start automatique de la lecture
	// fermeLecteurFinLecture : booléen pour la fermeture du lecteur en fin de lecture 

	// si l'appel est fait depuis un bouton d'activation différent de celui du lecteur actuel : on stoppe celui-ci
	if (vtLecteur != null && vtLecteur.boutonInitLecteur !== boutonInitLecteur) {
		vtFermeLecteur()
	}
	if (vtLecteur == null) {
		console.log(fichierMusique)
		vtInitLecteur(baliseLecteur,typeLecteur,fichierMusique,boutonInitLecteur,boutonPlayPause,startAuto,fermeLecteurFinLecture)
	} 
}

/*
function ActiverLecteurEntrainement(fichier, objet, typeFichier) {
	switch (typeFichier){
		case 'audio':
		blocLecteur = document.getElementById('entrainement_bloc-audio');
		blocLecteur.style.display = 'flex';
		document.getElementById('entrainement_bloc-video').style.display = 'none';
		vtLecteur = blocLecteur.firstElementChild; //document.querySelector('audio'); // document.getElementById('lecteur-audio');
		//idLecteur = "lecteur-audio";
		break;
	}
	document.getElementById('entrainement_legende-lecteur').innerHTML = objet.firstChild.textContent; //.nextElementSibling
	vtLecteur.src = fichier;
	document.getElementsByTagName('body')[0].style.overflowY='hidden';
	document.getElementById('entrainement_lecteur-audio-video').style.display='block';
	vtLecteur.onended = function(){vtLecteur = null; blocLecteur = null; document.getElementsByTagName('body')[0].style.overflowY='auto';document.getElementById('entrainement_lecteur-audio-video').style.display='none';};
}
*/
