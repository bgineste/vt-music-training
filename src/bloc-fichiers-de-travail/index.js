/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
/*import { addFilter } from '@wordpress/hooks';
import { select } from '@wordpress/data';*/

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/*
// Définitions spécifiques au bloc enfant
const ALLOWED_PARENT_BLOCKS = [ 'vt-music-training/bloc-oeuvre' ];
const TARGET_BLOCK = 'vt-music-training/bloc-module';

const restrictInnerBlocks = (allowedBlocks, blockEditorSettings, editorContext) => {
    const { getBlockHierarchyRootClientId, getBlock } = select('core/block-editor');
    const { clientId } = editorContext;

    const rootClientId = getBlockHierarchyRootClientId(clientId);
console.log("rootClientId " + cliendID )
    if (!rootClientId) {
        return allowedBlocks;
    }

    const parentBlock = getBlock(rootClientId);
console.log("parent " + parentBlock )

    if (parentBlock && !ALLOWED_PARENT_BLOCKS.includes(parentBlock.name)) {
        if (allowedBlocks === true) {
            return [ TARGET_BLOCK ];
        }
        return allowedBlocks.filter(blockName => blockName !== TARGET_BLOCK);
    }

    return allowedBlocks;
};

addFilter(
    'editor.BlockEdit.allowedBlocks',
    'vt-music-training/restrict-inner-blocks',
    restrictInnerBlocks
);
*/


/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,


} );
