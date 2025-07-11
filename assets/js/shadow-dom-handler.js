class VTmusicTrainingContainer extends HTMLElement {
    constructor() {
        super();
        // Créer un Shadow DOM attaché
        const shadow = this.attachShadow({ mode: 'open' });

        // Ajouter un style encapsulé
        const style = document.createElement('style');
        style.textContent = `
            :host {
				all: initial;
                display: inline-block;
                font-family: 'Inter var', courier, sans-serif;
                font-size: 10px;
				font-weight: 400;
				letter-spacing: -0.015em; 
				text-align: left;
            }
			 /* Reset global pour tous les descendants */
			:host * {
				all: unset;
				box-sizing: border-box;
			}
           .vt--une-page {
				width: 100%;
				max-width: var(--vt--largeur-utile);
				margin: auto;
				padding: 0;
				box-sizing: border-box;
				overflow: hidden;
                border-radius: 4px;
				/*font-size: 1.8em;*/
				background-color: var(--vt-bg-section);
                color: #333;
				word-break: break-word;
				word-wrap: break-word;
            }
			/* Styles spécifiques pour les descendants */
			:host ::slotted(h2) {
				
				font-size: 1.5em;
				font-weight: bold;
				color: red;
				margin: 0;
				padding: 0.5em 0;
			}
		`;

        // Ajouter un conteneur pour le contenu
        const container = document.createElement('div');
        container.classList.add('vt--une-page');
        container.innerHTML = `
            <slot></slot> <!-- Permet d'insérer des enfants -->
        `;

        // Ajouter le style et le contenu au Shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(container);
    }
}

// Enregistrer la nouvelle balise
customElements.define('vt-music-training-container', VTmusicTrainingContainer);
