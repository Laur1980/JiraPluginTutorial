/**
 * @module jira/shifter/shifter-analytics
 */
define('jira/shifter/shifter-analytics', ['jira/analytics', 'jira/util/strings', 'jira/util/data/meta', 'underscore', 'exports'], function (analytics, StringUtils, Meta, _, exports) {

    /**
     * List of IDs of groups that are privacy-policy-safe.
     * This means that any item in any of these groups doesn't
     * contain values entered by the user and we can safely trigger
     * analytics events containing these strings.
     */
    var privacyPolicySafeGroups = ["admin", "issue-actions"];

    function isGroupSafe(group) {
        return privacyPolicySafeGroups.indexOf(group) >= 0;
    }

    /**
     * List of labels that are safe to be in the analytics events.
     * These are white-listed because they are contained in a group
     * that generally can contain values that are user-provided.
     * These are transition names from standard project types in JIRA.
     */
    var privacyPolicySafeLabels = ["done", "start progress", "ready for review", "stop progress", "reopen", "approve", "reject", "reopen and start progress"];

    function isLabelSafe(label) {
        return privacyPolicySafeLabels.indexOf(label) >= 0;
    }

    function prepareLabel(label, value, group) {
        value = extractValue(value);
        label = label.toLowerCase();

        if (isGroupSafe(group) || isLabelSafe(label)) {
            return label;
        } else if (group === "edit-fields") {
            if (!StringUtils.startsWith(value, "customfield_")) {
                return value;
            }
        }

        return StringUtils.hashCode(label);
    }

    function extractValue(value) {
        if (_.isObject(value) && _.has(value, 'url')) {
            return value.url;
        } else if (_.isString(value)) {
            return value.toLowerCase();
        } else {
            return "";
        }
    }

    function trigger(eventName, attributes) {
        analytics.send({
            name: "jira.dotdialog." + eventName,
            data: attributes
        });
    }

    exports.show = function show() {
        trigger("show");
    };

    exports.selection = function selection(label, value, gorup) {
        if (gorup && value && label) {
            trigger("selection", {
                group: gorup,
                selected: prepareLabel(label, value, gorup),
                lang: Meta.getLanguage()
            });
        }
    };

    exports.selection.privacyPolicySafeGroups = privacyPolicySafeGroups;
    exports.selection.privacyPolicySafeLabels = privacyPolicySafeLabels;
});