// /hooks/useClosestParentAttribute.js

import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Custom hook pour trouver la valeur d'un attribut dans le premier parent qui le définit.
 *
 * @param {string} clientId  ID du bloc courant
 * @param {string} attrName  Nom de l'attribut à rechercher
 * @returns {*} Valeur trouvée ou null
 */
export function useClosestParentAttribute(clientId, attrName) {
    console.log("Hook Closest parent attribute",clientId,attrName);
    return useSelect(
        (select) => {
            const { getBlockParents, getBlockAttributes } = select(blockEditorStore);
            const parents = getBlockParents(clientId);
            console.log("parents", parents);

            for (const parentId of parents) {
                /*const attrs = getBlockAttributes(parentId);
                console.log("attrs",parentId,attrs);
                if (attrs?.[attrName]) {
                    return attrs[attrName];
                }*/
    const attrs = getBlockAttributes(parentId);
    console.log('Parent ID:', parentId, 'Attributes:', attrs);

    if (attrName in attrs) {
        console.log(`→ L’attribut ${attrName} existe avec valeur:`, attrs[attrName]);
    } else {
        console.log(`→ L’attribut ${attrName} est absent`);
    }

    if (attrs?.[attrName]) {
        console.log(`✔ Trouvé ${attrName} avec valeur:`, attrs[attrName]);
        return attrs[attrName];
    }
            }

            return null;
        },
        [clientId, attrName]
    );
}
