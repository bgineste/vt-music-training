/*
Fonctions lecteurs audio et video (plugin vt-music-training)
V 1.0
*/
// DANS CE SCRIPT ON POSTULE QU'IL N'Y A, A TOUT INSTANT, QU'UN SEUL LECTEUR DEFINI DANS LE NAVIGATEUR


class VtMpLecteur {
    constructor(tagVideoOuAudio) {
        if (!(tagVideoOuAudio instanceof HTMLMediaElement)) {
            throw new Error("Il faut un <audio> ou <video>");
        }
        this.player = tagVideoOuAudio;

        // Optionnel : garder des références aux handlers si besoin de removeEventListener
        //this._onPlayHandler = () => {};
        //this._onPauseHandler = () => {};

        // Abonner aux changements de vitesse natifs (menu options du navigateur chrome)
       // On garde une référence au handler
        this._onRateChange = () => {
            this.dispatchEventCustom("vitesseChanged", { 
                playbackRate: this.player.playbackRate 
            });
        };

        this.player.addEventListener("ratechange", this._onRateChange);
		

    }


    // Émettre des événements personnalisés
    dispatchEventCustom(name, detail = {}) {
        const event = new CustomEvent(name, { detail });
        this.player.dispatchEvent(event);
    }
    // Abonnement/désabonnement
    on(name, handler) {
        this.player.addEventListener(name, handler);
    }
    off(name, handler) {
        this.player.removeEventListener(name, handler);
    }

    // Contrôles de base
    play() {
        this.player.play();
    }
    #pause() {
        this.player.pause();
    }
    togglePlayPause() {
        if (this.player.paused) {
            this.play();
        } else {
            this.#pause();
        }
    }

	getCurrentTime() {
		return this.player.currentTime;
	}

	tFinMorceau() {
		return this.player.duration;
	}

	isBoucleActive = false;
	isBoucleValide = false
	#boucleID = null; // setInterval
	// propriétés de boucle
	nomBoucle = null;
	tDebBoucle = 0;
	tFinBoucle = 0; 

	setBoucle(nomBoucle, debBoucle, finBoucle) {
		// nomBoucle : nom des boucles enregistrées ou ""
		// debBoucle : instant début boucle (format ?)
		// finBoucle ! instant fin boucle (format ?)
		this.nomBoucle = nomBoucle;
		this.tDebBoucle = debBoucle;
		this.tFinBoucle = finBoucle;

		this.dispatchEventCustom("boucleSetted",{nomBoucle: this.nomBoucle, debBoucle: this.tDebBoucle, finBoucle: this.tFinBoucle});
		console.log("lecteur : setted boucle");
	}

	onOffBoucle(supprimerBoucle = false) {
		console.log("Bcl on/off ", this.tDebBoucle," / ",this.tFinBoucle);
		//alert(EtatBoucle);
		let lcr = 0;
	//	var attente = 0;
		if (!this.isBoucleActive) {
			if (parseFloat(this.tFinBoucle) <= parseFloat(this.tDebBoucle)) {
				console.log("❌ activation boucle inattendue");
				this.dispatchEventCustom("bouclerDenied");
				return;
			}
			// si on est en train de boucler sur le morceau : on arrête ce bouclage avant de lancel la boucle définie					 
			if (this.#boucleActiveSurToutLeMorceau) { this.toggleBouclerSurToutLeMorceau();}
//			vtLecteur.boutonBoucler.classList.add("vt--bouton-clavier-enfonce");
			lcr = parseInt(this.player.currentTime);
			// le lecteur n'est pas dans l'intervalle de la boucle : on le ramène au début de la boucle
			// sinon on diffère la fonction interval du temps restant
			if (lcr < this.tDebBoucle || lcr >= this.tFinBoucle) { 
				this.player.currentTime=this.tDebBoucle;
			}
			this.#boucleID=setInterval(()=>{
				if (this.player.currentTime >= this.tFinBoucle || this.player.currentTime <= this.tDebBoucle) this.player.currentTime = this.tDebBoucle;
			},800);
			this.isBoucleActive = true;
		} else {
			// on arrête la boucle
			clearInterval(this.#boucleID);
			this.#boucleID = null;	// V2.1
			// mais on conserve les données
			//this.tDebBoucle = 0;
			//this.tFinBoucle = 0;
			this.isBoucleActive = false;
		}
		this.dispatchEventCustom("bouclerChanged", { isBoucleActive: this.isBoucleActive, supprimer: supprimerBoucle });
	}

	#boucleActiveSurToutLeMorceau = false;

	toggleBouclerSurToutLeMorceau() {
		if (!this.#boucleActiveSurToutLeMorceau) {
			if (this.isBoucleActive) { this.onOffBoucle({suppimerBoucle: true});} // Si une boucle est active on l'arrête

			this.#boucleID=setInterval(()=>{
				if (this.player.currentTime >= this.player.duration) {
					this.player.currentTime=0;
					if (this.player.paused) {
						this.play();
					}
				}
			},800);
			this.#boucleActiveSurToutLeMorceau = true;
		} else {
			clearInterval(this.#boucleID);
			this.#boucleID = null; // V3.2
			this.#boucleActiveSurToutLeMorceau = false;
			
		}
		this.dispatchEventCustom("bouclerSurMorceauChanged", { etat: this.#boucleActiveSurToutLeMorceau});
	}

	rembobiner(){
		this.player.currentTime=0;
	}

	sauter(duree){
		let end = this.player.seekable.end(0);
		let curseur = this.player.currentTime + duree;
		this.player.currentTime = curseur  > end ? end : curseur < 0 ? 0 : curseur ;
	}


	// Gestion des paramètres du lecteur
	setAjusterVitesse(valeur) {
		console.log(this.player.playbackRate);
		switch (valeur) {
			case 'down':
				if (this.player.playbackRate > .50) {
					this.player.playbackRate -= .05;
				}
			break;
			case 'up':
				if (this.player.playbackRate < 1.25) {
					this.player.playbackRate += .05;
				}
			break;
			case 'normal': 
				this.player.playbackRate = 1;
	//			Rate = 100;
			break;
		}
	}



    // Exemple : paramètres du lecteur
    setSegments(segments) {
        this.segments = segments;
        this.dispatchEventCustom("segmentsChanged", { segments });
    }
    setStereo(value) {
        this.stereo = value;
        this.dispatchEventCustom("stereoChanged", { stereo: value });
    }

    // Nettoyage complet
    destroy() {
        // Arrêter le média
        try {
            this.#pause();
        } catch (e) {
            console.warn("Erreur lors de l'arrêt du média", e);
        }

        // Libérer la source
        this.player.removeAttribute("src");
        //this.player.load(); // force le reset de <audio>/<video>
/*
        // Retirer tous les écouteurs éventuellement ajoutés
        if (this._onPlayHandler) {
            this.off("play", this._onPlayHandler);
            this._onPlayHandler = null;
        }
        if (this._onPauseHandler) {
            this.off("pause", this._onPauseHandler);
            this._onPauseHandler = null;
        }
*/

		// Retirer proprement l'écouteur "vitesse"
		this.player.removeEventListener("ratechange", this._onRateChange);

		// Arrêter les répétitions
		if (this.#boucleID !== null) {		
			clearInterval(this.#boucleID);
			this.#boucleID = null; // V3.2
			this.#boucleActiveSurToutLeMorceau = false;
		}


		// Nettoyer les propriétés
        this.segments = null;
        this.stereo = null;
		this.player.playbackRate = 1;


        // Prévenir la vue que le lecteur est détruit
        this.dispatchEventCustom("fermeture", { message: "Lecteur détruit" });

        // Briser la référence au tag
        this.player = null;

        console.log("Lecteur détruit et nettoyé");
    }
}

/*
Fonctions lecteurs audio et video (plugin vt-music-training)
V 1.0
*/
// DANS CE SCRIPT ON POSTULE QU'IL N'Y A, A TOUT INSTANT, QU'UN SEUL LECTEUR DEFINI DANS LE NAVIGATEUR



/**-----------------------------------------------------------------------------------------------
* FONCTIONS DU LECTEUR
------------------------------------------------------------------------------------------------*/

var vtLecteur = null;

var vtIdUtilisateur = null; 
var vtNomFonctionGetIdUtilisateur = null;  

//const urlPHP_TraitementBoucles ='http://voce-tolosa.ddns.net/sript-php-externe/';

//var vtAffVitesse = null; // champ d'affichage de la vitesse d'exécution
//var vtBtnPlayPause = null; // Bouton play/pause
//var vtBtnRepeteEnBoucle = null // Bouton Répète tout le morceau push/pull
//var vtEtatRepeteEnBoucle = false; // indique sila répétition du morceau est activée
//var vtRepeteEnBoucleID = null;
//var vtboutonBoucler = null; // Bouton boucle push/pull
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


/*
Récupérer l'id de l'utilisateur (pour l'enregistrement des boucles)
*/

const blockElement = document.querySelector('[data-fonction-get-id-utilisateur]');
if (!blockElement) {
	console.warn('Bloc avec "data-fonction-get-id-utilisateur" n\' pas été trouvé. C\'est normal si la page n\'est pas une page d\'entrainement');
	vtNomFonctionGetIdUtilisateur = null;
} else {
	vtNomFonctionGetIdUtilisateur = blockElement.getAttribute('data-fonction-get-id-utilisateur');
}
 
function vtGetvtIdUtilisateur(vtNomFonctionGetIdUtilisateur) {
	if (!vtNomFonctionGetIdUtilisateur) {
		console.warn('Aucune fonction d\'initialisation fournie');
		return null;
	}

	// Vérifie que la fonction existe dans window
	if (typeof window[vtNomFonctionGetIdUtilisateur] !== 'function') {
		console.warn(`La fonction ${vtNomFonctionGetIdUtilisateur} n'existe pas sur cette page`);
		return null;
	}

	try {
		// Appel de la fonction pour récupérer l'identifiant alias pseudo de l'utilisateur
		const idUser = window[vtNomFonctionGetIdUtilisateur]();
		console.log('Pseudo récupéré :', idUser);
		return idUser;
	} catch (err) {
		console.error('Erreur lors de l’appel de la fonction', err);
		return null;
	}
}

if (vtNomFonctionGetIdUtilisateur != null) {
	vtIdUtilisateur = vtGetvtIdUtilisateur(vtNomFonctionGetIdUtilisateur);

}


function vtActiverLecteur(cheminFichier, nomFichier, typeFichier, affichageClavier, fichierStereo) {
	
	alert("caller is " + vtActiverLecteur.caller); // Deprecated
	let source = cheminFichier + nomFichier;
	
	console.log('vtActiverLecteur/source : ' + cheminFichier + ' - ' + nomFichier);

	window.VtGestionLecteur.vtInstalleLecteur(typeFichier, source);

	let vtBlocLecteur = window.VtGestionLecteur.vtBlocLecteur();
	vtLecteur = vtBlocLecteur.firstElementChild;
	// Initialiser tous les attributs 
	Object.assign(vtLecteur, {
		// les attributs
		src: source,
		blocLecteurEntrainement: null,	// enveloppe du lecteur
		blocClavier: null,				// fichier audio ou vidéo 
		boutonPlayPause: null,

		etatRepeterEnBoucle: false,  // boucle sur tout de morceau
		boutonRepeterEnBoucle: null,    // le bouton "répète en boucle tout le morceau"
		//affVitesse: null,			// le champ d'affichage de la vitesse
		etatBoucle: false,			// boucle active sur un segment
		boutonBoucler: null, 			// Bouton boucle push/pull
		affDebBoucle: null,			// le champ d'affichage du début de boucle
		affFinBoucle: null,			// le champ d'affichage de la fin de boucle
		tDebBoucle: 0,				// moment du début de boucle
		tFinBoucle: 0,				// moment de fin de boucle
		boucleID: null,				// constante associée à l'itération de la boucle
		bouclesDefinies: {},
		//idSaisieNomBoucle: "vt--saisie-nom-boucle",
		//idChoixBoucle: "choix-boucle",
		oChoixBoucle: null,			// objet html 'select' associé au tableau des boucles enregistrées
		boucleChoisie: "",		// identifiant de la boucle choisie
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
		ChargeBouclesDefinies: vtChargeBouclesDefinies,
		SelectBoucle: vtSelectBoucle,
		LanceEnregBoucle: vtLanceEnregBoucle,
		//Play: vtPlay,
		//Pause: vtPause,
		DesactiverLecteurEntrainement: vtDesactiverLecteurEntrainement
	});

	
	[ 
		vtLecteur.blocLecteurEntrainement,
		vtLecteur.blocClavier,
		vtLecteur.blocLecteur,
		vtLecteur.boutonPlayPause,
		vtLecteur.boutonRepeterEnBoucle
	] = window.VtGestionLecteur.vtInitParamsLecteur();

	vtLecteur.SetEcoutePlayPause("actif");

	// affichage du clavier ?
	if (affichageClavier === "false") {
		window.VtGestionLecteur.VtAfficherClavier(false);
	} else {
		vtLecteur.stereo = !(fichierStereo === "false" || vtEnvt.isIphone === true);
		// affichage de la balance stéréo ?
		if (!vtLecteur.stereo) {
			//document.getElementById("vt--balance").style.display = 'none';
			window.VtGestionLecteur.VtAfficherBalance(false);
		}

		// actualisation symbole bouton play/pause
		console.log("initialisation du bouton play/pause : ",vtLecteur.boutonPlayPause);
		vtLecteur.ActualiserBoutonPlayPause();

		// actualisation du compteur de vitesse
		let PBR = vtLecteur.playbackRate;
		let Rate = parseInt(100*PBR,10);

		/*vtLecteur.AffVitesse = document.getElementById("vt--aff-vitesse");			   
		if (vtLecteur.AffVitesse != null) {
			vtLecteur.AffVitesse.innerHTML = Rate+ '%';
		}*/
		window.VtGestionLecteur.VtAffVitesse(Rate);
		
		
		// initialisation des compteurs de boucles
		/*vtLecteur.AffDebBoucle = document.getElementById("vt--deb-boucle");			   
		vtLecteur.AffFinBoucle = document.getElementById("vt--fin-boucle");			   
		vtLecteur.AffDebBoucle.innerHTML = '00:00';
		vtLecteur.AffFinBoucle.innerHTML = '00:00';*/
		window.VtGestionLecteur.VtSetCompteursBoucle(0, 0);
		// initialisation du bouton de lancement des boucles
		vtLecteur.boutonBoucler = document.getElementById("vt--onoff-boucle");
		vtLecteur.oChoixBoucle = document.getElementById("vt--choix-boucle");
		// initialisation du tableua des boucles enregistrées
		vtLecteur.ChargeBouclesDefinies();
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
	if (vtLecteur.etatRepeterEnBoucle && vtLecteur.boutonRepeterEnBoucle) {
		vtLecteur.boutonRepeterEnBoucle.classList.remove("vt--bouton-clavier-enfonce");
	}
	/* pas nécessaire : initialisation faite à l'activation */
	/*vtLecteur.AffDebBoucle.innerHTML = '00:00';
	vtLecteur.AffFinBoucle.innerHTML = '00:00';*/
	window.VtGestionLecteur.VtSetCompteursBoucle(0, 0);
	window.VtGestionLecteur.VtAfficherClavier(true);
	//document.getElementById("vt--clavier-lecteur").removeAttribute("style");
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

// vtLecteur.ChargeBouclesDefinies()
async function vtChargeBouclesDefinies() {

	// Préparation des données à envoyer
	const data = new FormData();
	data.append('action', 'lecture-boucles');
	data.append('utilisateur', vtIdUtilisateur);
	data.append('nomfic', vtLecteur.src);
	console.log("nomfic : ",vtLecteur.src);

	// Envoi via fetch
	try {
		const response = await fetch(fonctionsBouclesLecteur.ajaxUrl, {
			method: 'POST',
			body: data
		})
		console.log("response : ",response);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const result = await response.json();
		console.log("result : ", result);
		console.log("result data : ", result.data);
		if (typeof result.data === 'object') {
			// traiter l'objet
			vtLecteur.bouclesDefinies = JSON.parse(result.data);
			var oOption = document.createElement("option");
			oOption.text = "";
			oOption.value = "choisir boucle";
			vtLecteur.oChoixBoucle.add(oOption);
			var j = 1;
			var x = "";
			for(bcl in vtLecteur.bouclesDefinies) {
				alert("bcl : "+bcl);
				var oOption = document.createElement("option");
				oOption.text = bcl;
				oOption.value = bcl;
				//alert(BouclesDefinies[bcl][0]);
				//alert(BouclesDefinies[bcl][1]);
				//alert(BouclesDefinies[bcl][2]);
				vtLecteur.oChoixBoucle.add(oOption);
				j++;
			}
			vtLecteur.oChoixBoucle.style.display = "block";
			vtLecteur.ElargirCompteurBoucle("compteur-deb-boucle"); //-"+suffixeLecteur);
			vtLecteur.ElargirCompteurBoucle("compteur-fin-boucle"); //-"+suffixeLecteur);

		} else {
			console.log("result data : ", result.data);
		}
	} catch (error) {
			console.error(error.message);
	}
/*
	.then(response => {response.text(); console.log("response : ",response);}) // On traite la réponse en tant que JSON
//	.then(console.log(response)) // On traite la réponse en tant que JSON
	.then(data => {
		console.log("data : ",data);
		if (data.success) {
			console.log("Réponse du serveur: ", data.data);
		} else {
			console.log(data);
			console.error("Erreur: ", data.data);
		}
	})
	.catch(error => {
		console.error('Erreur lors de l\'envoi du message:', error);
	});
*/

}

// vtLecteur.InitBalance
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

// vtLecteur.SetChoixBoucle
function vtSelectBoucle(nomBoucle) {
	vtLecteur.boucleChoisie = nomBoucle;
	let bornesBoucles = vtLecteur.BouclesDefinies(nomBoucle).split('|');
	vtLecteur.tDebBoucle = parsInt(bornesBoucles[0],10);
	vtLecteur.tFinBoucle = parsInt(bornesBoucles[1],10);
	
   /*if (vtLecteur.AffDebBoucle != null) {
		vtLecteur.AffDebBoucle.innerHTML = cvSecTime(vtLecteur.tDebBoucle);
   }
   if (vtLecteur.AffFinBoucle != null) {
		vtLecteur.AffFinBoucle.innerHTML = cvSecTime(vtLecteur.tFinBoucle);
   }*/
	window.VtGestionLecteur.VtSetCompteursBoucle(vtLecteur.tDebBoucle, vtLecteur.tFinBoucle);
}

// vtLecteur.RepeterEnBoucle
function vtRepeterEnBoucle(boutonRepeterEnBoucle=null) { // push/pull répète en boucle la totalité du morceau
//	console.log(vtEtatRepeterEnBoucle);
	if (!vtLecteur) {return}
	if (!vtLecteur.boutonRepeterEnBoucle && boutonRepeterEnBoucle) {
		Object.assign(vtLecteur, { 		
		boutonRepeterEnBoucle: boutonRepeterEnBoucle    // le bouton "répète en boucle"
	});
	}
	let etatRepeterEnBoucle = vtLecteur.etatRepeterEnBoucle;
	if (!etatRepeterEnBoucle) {
		if (vtLecteur.etatBoucle) { vtOnOffBoucle();} // Si une boucle est active on l'arrête
		vtLecteur.boutonRepeterEnBoucle.classList.add("vt--bouton-clavier-enfonce");
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
		vtLecteur.boutonRepeterEnBoucle.classList.remove("vt--bouton-clavier-enfonce");
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
		/*if (vtLecteur.AffVitesse != null) {
			vtLecteur.AffVitesse.innerHTML = Rate+ '%';
		}*/
		window.VtGestionLecteur.VtAffVitesse(Rate);
	}
}

// vtLecteur.DefDebBoucle
function vtDefDebBoucle() {
	let nDeb = vtLecteur.currentTime;
	vtLecteur.tDebBoucle = parseInt(nDeb,10); //Math.floor(nDeb);
	
   /*if (vtLecteur.AffDebBoucle != null) {
		vtLecteur.AffDebBoucle.innerHTML = cvSecTime(vtLecteur.tDebBoucle);
   }*/
	window.VtGestionLecteur.VtSetCompteursBoucle(vtLecteur.tDebBoucle, vtLecteur.tFinBoucle);   
}

// vtLecteur.DefFinBoucle
function vtDefFinBoucle() {
	let nFin = vtLecteur.currentTime;
	vtLecteur.tFinBoucle = parseInt(nFin,10); //Math.floor(nFin);
	
   /*if (vtLecteur.AffFinBoucle != null) {
		vtLecteur.AffFinBoucle.innerHTML = cvSecTime(vtLecteur.tFinBoucle);
   }*/
	window.VtGestionLecteur.VtSetCompteursBoucle(vtLecteur.tDebBoucle, vtLecteur.tFinBoucle);   
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
		vtLecteur.boutonBoucler.classList.add("vt--bouton-clavier-enfonce");
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
		vtLecteur.boutonBoucler.classList.remove("vt--bouton-clavier-enfonce");
		vtLecteur.etatBoucle = false;
		// aspect
		
	}
}

// vt--lecteur.LanceEnregBoucle
function vtLanceEnregBoucle() {
/*	var idSaisieNomGroupe = "saisie-nom-boucle-"+SuffixePlayer;
	var ValideNomGroupe =  document.getElementById(idValideNomGroupe);
	var divEncadreValidationNomGroupe = ValideNomGroupe.parentElement;
	divEncadreValidationNomGroupe.style.display="flex";*/
	if (vtIdUtilisateur === "" || vtIdUtilisateur === null) {
		alert("Cette fonction est réservée\naux choristes identifiés\n\nPour cela, sélectionner dans le menu\n : Paramètres> Inscription pseudo choriste\n\nPour connaître votre pseudo, contactez le webmaster");
		return;
	}
	// traiter cela en amont (filtre pour autoriser le bouton enreg)
	if (!vtLecteur.etatBoucle && (parseFloat(vtLecteur.tFinBoucle) <= parseFloat(vtLecteur.tDebBoucle))) {
		alert("Boucle incorrecte !");
		return;
	}
	var SaisieNomBoucle =  document.getElementById("vt--saisie-nom-boucle"); // input pour la saisie du nom de la boucle
	var nomBoucle = document.getElementById("vt--choix-boucle").value;
	if (nomBoucle === "choisir boucle") {
		SaisieNomBoucle.value = "";
	} else {
		SaisieNomBoucle.value = nomBoucle;
	}
//	SaisieNomBoucle.value = document.getElementById(idChoixBoucle).value;
	var divEncadreValidationNomBoucle = SaisieNomBoucle.parentElement; // la div qui reçoit input de saisie et bouton de validation de saisie
	divEncadreValidationNomBoucle.style.display="flex";
	SaisieNomBoucle.focus();
	SaisieNomBoucle.select(); // sélecté si possible
}

function EnregBoucle() {
	$.ajax({
		url:urlPHP_TraitementBoucles, 
//		url:'<?php echo get_permalink( 2520 );?>', 
		method:'POST',
		data:{
			action:"enreg-boucle",
			nomFic:NomFichierSourceAudioVideo,
			choriste: vtIdUtilisateur,
			nomBoucle:document.getElementById(idSaisieNomBoucle).value,
			dBoucle:tDebBoucle,
			fBoucle:tFinBoucle
		},
		dataType:"text",
		success:function(response){
			document.getElementById(idSaisieNomBoucle).parentElement.style.display="none";
			// actualiser la liste de boucles
			BouclesDefinies[document.getElementById(idSaisieNomBoucle).value] = tDebBoucle+"|"+tFinBoucle;
			var oChoixBoucle = document.getElementById(idChoixBoucle);
			// s'il s'agit d'une création on ajoute un item à la liste
			if (!response.includes("mise à jour")) {
				if (oChoixBoucle === null || oChoixBoucle.length == 0) {
					//oChoixBoucle.add("choisir boucle");
					var oOption0 = document.createElement("option");
					oOption0.text = "choisir boucle";
					oOption0.value = "choisir boucle";
					oChoixBoucle.add(oOption0);
				}
				var oOption = document.createElement("option");
				oOption.text = document.getElementById(idSaisieNomBoucle).value;
				oOption.value = document.getElementById(idSaisieNomBoucle).value;
						//alert(BouclesDefinies[bcl][0]);
						//alert(BouclesDefinies[bcl][1]);
				oChoixBoucle.add(oOption);
				// on selectione le nouvel élément
				document.getElementById(idChoixBoucle).value = oOption.value;
			}
			oChoixBoucle.style.display = "block";
			alert(response);

		},
		error:function (xhr, textStatus, errorThrown) {
			alert(textStatus);
		}
	});
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
		let etatLecteur = (vtLecteur.paused) ? "pause" : "play";
		window.VtGestionLecteur.VtActualiserBoutonPlayPause(etatLecteur);
//		console.log(etatLecteur)
		/*let target = vtLecteur.boutonPlayPause.firstElementChild
		if (target) {
			if (etatLecteur === "pause") {
				target.classList.remove("fa-pause")
				target.classList.add("fa-play")		
			} else {
				target.classList.remove("fa-play")
				target.classList.add("fa-pause")		
			}
		}*/
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
