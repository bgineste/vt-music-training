/* Fonctions générales pour le plugin vt-music-training */
/* V 1.4 */

/*
Variables globales 
*/

/*
Fonctions diverses 
*/

function vtmusicTruncate(str, maxlength) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + '…' : str;
}

function vtmusicScrollToAncor(ancorId, topOffset = 0) {
	/* 
	ancorId : Id du bloc à mettre en haut de page
	topOffset : décalage du bloc par rapport au haut de page 
			   (utile lorsque le haut de page est occupé par un bandeau fixe en avant plan, tel un menu),
			   par exemple : topOffset=document.getElementById("site-header").offsetHeight
	*/
    const element = document.getElementById(ancorId);
    if (!element) return;

    const targetY = element.getBoundingClientRect().top + window.pageYOffset - topOffset;

    window.scrollTo({
        top: Math.round(targetY),
		left: 0,
        behavior: 'smooth'
    });
}

function vtmusicNormalizePath(path) {
	if (path === undefined) {return path}
	return (path.endsWith('/')) ? path : path + '/'
}

window.fileExists = async function (url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    return false;
  }
};

/**-------------------------------------------
* Eviter que plusieurs lecteurs soient activés
--------------------------------------------*/
var vtPreviousAudio; 
document.addEventListener('play', function(e){

	if(vtPreviousAudio && vtPreviousAudio != e.target){
		vtPreviousAudio.pause();     }
	vtPreviousAudio = e.target; },
	true);
