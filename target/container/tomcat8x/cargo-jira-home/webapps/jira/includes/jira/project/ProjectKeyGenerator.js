define('jira/util/strings/character-map', function () {
    // The (non-ascii) characters used as keys will be replaced with their (ascii) value.
    var CHARACTER_MAP = {};
    CHARACTER_MAP[199] = "C"; // �
    CHARACTER_MAP[231] = "c"; // �
    CHARACTER_MAP[252] = "u"; // �
    CHARACTER_MAP[251] = "u"; // �
    CHARACTER_MAP[250] = "u"; // �
    CHARACTER_MAP[249] = "u"; // �
    CHARACTER_MAP[233] = "e"; // �
    CHARACTER_MAP[234] = "e"; // �
    CHARACTER_MAP[235] = "e"; // �
    CHARACTER_MAP[232] = "e"; // �
    CHARACTER_MAP[226] = "a"; // �
    CHARACTER_MAP[228] = "a"; // �
    CHARACTER_MAP[224] = "a"; // �
    CHARACTER_MAP[229] = "a"; // �
    CHARACTER_MAP[225] = "a"; // �
    CHARACTER_MAP[239] = "i"; // �
    CHARACTER_MAP[238] = "i"; // �
    CHARACTER_MAP[236] = "i"; // �
    CHARACTER_MAP[237] = "i"; // �
    CHARACTER_MAP[196] = "A"; // �
    CHARACTER_MAP[197] = "A"; // �
    CHARACTER_MAP[201] = "E"; // �
    CHARACTER_MAP[230] = "ae"; // �
    CHARACTER_MAP[198] = "Ae"; // �
    CHARACTER_MAP[244] = "o"; // �
    CHARACTER_MAP[246] = "o"; // �
    CHARACTER_MAP[242] = "o"; // �
    CHARACTER_MAP[243] = "o"; // �
    CHARACTER_MAP[220] = "U"; // �
    CHARACTER_MAP[255] = "Y"; // �
    CHARACTER_MAP[214] = "O"; // �
    CHARACTER_MAP[241] = "n"; // �
    CHARACTER_MAP[209] = "N"; // �

    return CHARACTER_MAP;
});

define('jira/project/project-key-generator', ['jira/util/strings/character-map', 'jira/lib/class', 'jquery', 'underscore'], function (CHARACTER_MAP, Class, jQuery, _) {
    // These words will not be used in key generation for acronyms.
    var IGNORED_WORDS = ["THE", "A", "AN", "AS", "AND", "OF", "OR"];

    function getTotalLength(words) {
        return words.join("").length;
    }

    function removeIgnoredWords(words) {
        return _.reject(words, function (word) {
            return jQuery.inArray(word, IGNORED_WORDS) !== -1;
        });
    }

    function createAcronym(words) {
        var result = "";
        jQuery.each(words, function (i, word) {
            result += word.charAt(0);
        });
        return result;
    }

    function getFirstSyllable(word) {
        // Best guess at getting the first syllable
        // Returns the substring up to and including the first consonant to appear after a vowel
        var pastVowel = false;
        var i;
        for (i = 0; i < word.length; i++) {
            if (isVowelOrY(word[i])) {
                pastVowel = true;
            } else {
                if (pastVowel) {
                    return word.substring(0, i + 1);
                }
            }
        }
        return word;
    }

    function isVowelOrY(c) {
        return c && c.length === 1 && c.search("[AEIOUY]") !== -1;
    }

    /**
     * @class ProjectKeyGenerator
     * @extends Class
     */
    return Class.extend({

        init: function init(options) {
            options = jQuery.extend({}, options);
            this.desiredKeyLength = typeof options.desiredKeyLength === 'number' ? options.desiredKeyLength : 4;
            this.maxKeyLength = typeof options.maxKeyLength === 'number' ? options.maxKeyLength : 0;
        },

        generateKey: function generateKey(name) {
            name = jQuery.trim(name);
            if (!name) {
                return "";
            }

            // Brute-force chunk-by-chunk substitution and filtering.
            var filtered = [];
            for (var i = 0, ii = name.length; i < ii; i++) {
                var sub = CHARACTER_MAP[name.charCodeAt(i)];
                filtered.push(sub ? sub : name[i]);
            }
            name = filtered.join('');

            // Split into words
            var words = [];
            jQuery.each(name.split(/\s+/), function (i, word) {
                if (word) {
                    // Remove whitespace and punctuation characters (i.e. anything not A-Z)
                    word = word.replace(/[^a-zA-Z]/g, "");
                    // uppercase the word (NOTE: JavaScript attempts to convert characters like � in to SS)
                    word = word.toUpperCase();
                    // add the word, should it be worthy.
                    word.length && words.push(word);
                }
            });

            // Remove ignored words
            if (this.desiredKeyLength && getTotalLength(words) > this.desiredKeyLength) {
                words = removeIgnoredWords(words);
            }

            var key;

            if (words.length === 0) {
                // No words were worthy!
                key = "";
            } else if (words.length === 1) {
                // If we have one word, and it is longer than a desired key, get the first syllable
                var word = words[0];
                if (this.desiredKeyLength && word.length > this.desiredKeyLength) {
                    key = getFirstSyllable(word);
                } else {
                    // The word is short enough to use as a key
                    key = word;
                }
            } else {
                // If we have more than one word, just take the first letter from each
                key = createAcronym(words);
            }

            // Limit the length of the key
            if (this.maxKeyLength && key.length > this.maxKeyLength) {
                key = key.substr(0, this.maxKeyLength);
            }

            return key;
        }
    });
});

AJS.namespace('JIRA.ProjectKeyGenerator', null, require('jira/project/project-key-generator'));