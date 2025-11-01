/**
hook inutilisé
La fonction n'est pas valide : elle ne retourne pas le type du bloc parent
*/

import { useSelect } from '@wordpress/data';

export default function getTypeParentBlock(clientId) {
    const parentClientId = useSelect(
        (select) => select('core/block-editor').getBlockRootClientId(clientId),
        [clientId]
    );
    const siblingBlocks = useSelect(
        (select) => select('core/block-editor').getBlocks(parentClientId),
        [parentClientId]
    );
	//console.log("@@@Parents ",siblingBlocks) 
	return siblingBlocks[0].name
}