/**
 * Escape CSS selectors
 *
 * P(r)olyfill for https://drafts.csswg.org/cssom/#the-css.escape()-method
 *
 * Technically - a backport of jQuery 3.0 escapeSelector
 *
 */
define('jira/polyfill/escapeCSSSelector', [], function() {
    // CSS string/identifier serialization
    // https://drafts.csswg.org/cssom/#common-serializing-idioms
    var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
    var fcssescape = function( ch, asCodePoint ) {

        if ( asCodePoint ) {
            // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
            if ( ch === "\0" ) {
                return "\uFFFD";
            }
            // Control characters and (dependent upon position) numbers get escaped as code points
            return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
        }

        // Other potentially-special ASCII characters get backslash-escaped
        return "\\" + ch;
    };


    function escape( sel ) {
        return ( sel + "" ).replace( rcssescape, fcssescape );
    }

    return escape;
});
