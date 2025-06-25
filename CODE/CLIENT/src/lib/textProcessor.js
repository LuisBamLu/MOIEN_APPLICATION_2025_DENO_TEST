// -- IMPORTS

import { getLocalizedText, getProcessedMultilineText, getLocalizedTextBySlug, defineDualTag, defineLineTag, defineTag } from 'senselogic-gist';
import { languageTagStore } from '$store/languageTagStore';

// -- FUNCTIONS

export function defineTags(
    )
{
    defineLineTag( '! ', '<div class="paragraph title-1">', '</div>' );
    defineLineTag( '!! ', '<div class="paragraph title-2">', '</div>' );
    defineLineTag( '!!! ', '<div class="paragraph title-3">', '</div>' );
    defineLineTag( '!!!! ', '<div class="paragraph title-4">', '</div>' );
    defineLineTag( '- ', '<div class="paragraph dash-1">', '</div>' );
    defineLineTag( '  - ', '<div class="paragraph dash-2">', '</div>' );
    defineLineTag( '    - ', '<div class="paragraph dash-3">', '</div>' );
    defineLineTag( '      - ', '<div class="paragraph dash-4">', '</div>' );
    defineLineTag( '* ', '<div class="paragraph bullet-1">', '</div>' );
    defineLineTag( '  * ', '<div class="paragraph bullet-2">', '</div>' );
    defineLineTag( '    * ', '<div class="paragraph bullet-3">', '</div>' );
    defineLineTag( '      * ', '<div class="paragraph bullet-4">', '</div>' );
    defineLineTag( '', '<div class="paragraph">', '</div>' );

    defineDualTag( '**', '<span class="font-weight-700">', '</span>' );
    defineDualTag( '%%', '<i>', '</i>' );
    defineDualTag( '__', '<u>', '</u>' );
    defineDualTag( ',,', '<sub>', '</sub>' );
    defineDualTag( '^^', '<sup>', '</sup>' );

    defineTag( '~', '&nbsp;' );
    defineTag( '¦', '<wbr/>' );
    defineTag( '§', '<br/>' );
    defineTag( '¶', '<br class="linebreak"/>' );
    defineTag( '((', '<a class="link" href="' );
    defineTag( ')(', '" target="_blank">' );
    defineTag( '))', '</a>' );
    defineTag('||+', '<table class="table">');
    defineTag('+||', '</table>');
    defineTag('|++', '<thead><tr><th>');
    defineTag('++|', '</th></tr></thead>');
    defineTag('+|+', '</th><th>');
    defineTag('\\/', '</td><td>');
    defineTag('|*', '<tr><td>');
    defineTag('*|', '</td></tr>');
}

// ~~

export function getProcessedMultilineTranslatedText(
    text
    )
{
    let processedText = getProcessedMultilineText( getLocalizedText( text, languageTagStore ).replaceAll('\\n', '\n') );
    return processedText;
}

// ~~

export function getProcessedMultilineTranslatedTextBySlug(
    text
    )
{
    let processedText = getProcessedMultilineText( getLocalizedTextBySlug( text, languageTagStore ).replaceAll('\\n', '\n') );
    return processedText;
}
