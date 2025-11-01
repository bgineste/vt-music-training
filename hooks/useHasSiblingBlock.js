/**
Chercher si un block (dont l'identifiant est clientId) a un bloc "frère" de type BlockName
Cette fonction est nécessaire lorsqu'on crée un block de type bloc-module : elle permet de savoir si le block bloc-oeuvre dans lequel se trouve le module a un bloc index-oeuvre. Le cas échéant le module devra comporter un lien vers cet index.
*/


import { useSelect } from '@wordpress/data';

export default function useHasSiblingBlock(clientId, blockName) {
    const parentClientId = useSelect(
        (select) => select('core/block-editor').getBlockRootClientId(clientId),
        [clientId]
    );

    const siblingBlocks = useSelect(
        (select) => select('core/block-editor').getBlocks(parentClientId),
        [parentClientId]
    );

    //console.log('Parent Client ID:', parentClientId);
    //console.log('Sibling Blocks:', siblingBlocks);

    const hasSibling = siblingBlocks.some((block) => block.name === blockName);
    console.log(`Sibling "${blockName}" exists:`, hasSibling);

    return hasSibling;
}

