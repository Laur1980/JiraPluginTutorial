var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('jira/admin/analytics', ['jira/project/projectdata', 'jira/util/events', 'jira/admin/admindata', 'jira/common/page', 'wrm/context-path', 'jira/util/data/meta', 'jquery', 'jira/analytics', 'jira/libs/parse-uri'], function (projectData, Events, adminData, Page, wrmContextPath, Meta, jQuery, analytics, parseUri) {
    var $document = jQuery(document);
    var activeSection = Meta.get('admin.active.section');
    var inProject = activeSection === "atl.jira.proj.config";

    /**
     * Convenience to create and return an object that represents an administrative action.
     *
     * @param namespace a namespace for the event
     * @param type      a unique name to represent the specific kind of action used
     * @param opts      an object containing any particular properties of relevance for this navigation type.
     */
    function event(namespace, type, opts) {
        opts = (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== "object" ? {} : opts;
        type = type || "unknown";

        var props = jQuery.extend({
            type: type,
            tab: Meta.get('admin.active.tab'),
            section: Meta.get('admin.active.section')
        }, opts);

        return {
            name: "administration." + namespace + "." + type,
            properties: props
        };
    }

    /**
     * Convenience to create and return an object that represents a workflow scheme action in project context.
     *
     * @param type    a unique name to represent the specific kind of navigation action used
     * @param opts    an object containing any particular properties of relevance for this navigation type.
     */
    function sendProjectWorkflowSchemeEvent(type, opts) {
        analytics.send(event("projectconfig.workflowscheme", type, opts));
    }

    /**
     * Convenience to send an event that represents a workflow scheme action in administration.
     *
     * @param type    a unique name to represent the specific kind of navigation action used
     * @param opts    an object containing any particular properties of relevance for this navigation type.
     */
    function sendAdminWorkflowSchemeEvent(type, opts) {
        analytics.send(event("workflowscheme", type, opts));
    }

    function inWorkflowDraftScheme() {
        return !!jQuery(".status-draft").length;
    }

    /**
     * Convenience to create and return an object that represents a workflow action in administration.
     *
     * @param type    a unique name to represent the specific kind of navigation action used
     * @param opts    an object containing any particular properties of relevance for this navigation type.
     */
    function adminWorkflowEvent(type, opts) {
        return event("workflow", type, opts);
    }
    /**
     * Convenience to send an event that represents a navigation action in administration.
     *
     * @param type    a unique name to represent the specific kind of navigation action used
     * @param opts    an object containing any particular properties of relevance for this navigation type.
     */
    function sendAdminNavEvent(type, opts) {
        analytics.send(event("navigate", type, opts));
    }

    /**
     * Convenience to send an event that represents a workflow action in project context.
     *
     * @param type    a unique name to represent the specific kind of navigation action used
     * @param opts    an object containing any particular properties of relevance for this navigation type.
     */
    function sendAdminProjectWorkflowEvent(type, opts) {
        analytics.send(event("projectconfig.workflow", type, opts));
    }

    function bindSelectWorkflowModeClick(selector, edit) {
        $document.on("click", selector, function () {
            var mode = jQuery(this).data("mode");

            analytics.send(adminWorkflowEvent("selectmode", {
                mode: mode,
                edit: edit
            }));
        });
    }

    function sendEditWorkflowEvent(mode, action, object) {
        analytics.send(adminWorkflowEvent("edit", {
            mode: mode,
            action: action,
            object: object
        }));
    }

    function sendLoadWorkflowsTabEvent() {
        sendAdminProjectWorkflowEvent("loadworkflowstab", {
            referrer: filterUri(document.referrer)
        });
    }

    function bindEditWorkflowTextModeClicks(selector, action, object) {
        $document.on("click", selector, function () {
            sendEditWorkflowEvent("text", action, object);
        });
    }

    function sendProjectIssueTypeConfigTabEvent(name, event) {
        // Only trigger the event if the current toggle is not selected.
        if (jQuery(event.currentTarget).attr('aria-pressed') !== "true") {
            analytics.send({
                name: "projectconfig.toggle." + name
            });
        }
    }

    /**
     * Remove, anonymize and normalize any sensitive information in a URL for the purposes of
     * collection for statistical analysis.
     */
    function filterUri(href) {
        if (typeof href !== "string") {
            return null;
        }

        var uri = parseUri(href);
        var filtered;
        var projectKey = Meta.get('projectKey');

        // Remove the protocol, domain and context path from the URL.
        filtered = uri.path.slice(wrmContextPath().length);

        // Remove project keys
        filtered = filtered.replace(/project-config\/(.*?)(\/|$)/, "project-config/PROJECTKEY$2");
        if (projectKey && projectKey.length) {
            filtered = filtered.split(projectKey).join("PROJECTKEY");
        }

        return filtered;
    }

    /**
     * Bind to events in JIRA and emit appropriate analytics events.
     */
    function bindEvents() {
        Events.bind("addworkflow", function () {
            if (inWorkflowDraftScheme()) {
                sendAdminWorkflowSchemeEvent("addworkflowtodraft");
            }
        });
        Events.bind("assignissuetypes", function () {
            if (inWorkflowDraftScheme()) {
                sendAdminWorkflowSchemeEvent("assignissuetypestodraft");
            }
        });
        $document.on("click", ".remove-all-issue-types", function () {
            if (inWorkflowDraftScheme()) {
                sendAdminWorkflowSchemeEvent("deleteworkflowfromdraft");
            }
        });
        $document.on("click", "#discard-draft-dialog input[type=submit]", function () {
            if (inProject) {
                sendProjectWorkflowSchemeEvent("discarddraft");
            } else {
                sendAdminWorkflowSchemeEvent("discarddraft");
            }
        });
        $document.on("click", "#view-original", function () {
            sendAdminWorkflowSchemeEvent("vieworiginalofdraft");
        });
        $document.on("click", "#view-draft", function () {
            sendAdminWorkflowSchemeEvent("viewdraft");
        });
        $document.on("click", "#publish-draft", function () {
            sendAdminWorkflowSchemeEvent("publishclicked");
        });
        if (!inProject && parseUri(location).anchor === "draftMigrationSuccess") {
            sendAdminWorkflowSchemeEvent("migrationcompleted");
        }
        Events.bind("draftcreated", function () {
            if (inProject) {
                sendProjectWorkflowSchemeEvent("draftcreated");
            } else {
                sendAdminWorkflowSchemeEvent("draftcreated");
            }
        });
        $document.on("click", "#workflowscheme-editor .workflow-text-view", function () {
            sendAdminWorkflowSchemeEvent("viewworkflow", {
                mode: "text"
            });
        });
        $document.on("click", "#workflowscheme-editor .workflow-diagram-view", function () {
            sendAdminWorkflowSchemeEvent("viewworkflow", {
                mode: "diagram"
            });
        });
        $document.on("click", "#project-config-panel-fields .project-config-icon-edit", function () {
            analytics.send({
                name: "administration.fields.edit.link.clicked.project"
            });
        });
        $document.on("click", "#project-config-issuetype-scheme-edit", function () {
            analytics.send({
                name: "administration.issuetypeschemes.edit.link.clicked.project"
            });
        });
        $document.on("click", "#project-config-issuetype-scheme-change", function () {
            analytics.send({
                name: "administration.issuetypeschemes.switch.link.clicked.project"
            });
        });
        $document.on("click", "#project-config-panel-screens a.project-config-screen", function () {
            var operationId = jQuery(this).data("operationId");
            if (operationId === 1) {
                analytics.send({
                    name: "administration.screenschemes.editlink.clicked.operation.edit"
                });
            } else if (operationId === 2) {
                analytics.send({
                    name: "administration.screenschemes.editlink.clicked.operation.view"
                });
            } else {
                analytics.send({
                    name: "administration.screenschemes.editlink.clicked.operation.create"
                });
            }
        });
        // Capture clicks on project summary "more" links
        $document.on("click", ".project-config-more-link", function () {
            var el = jQuery(this);
            sendAdminNavEvent("morelink", {
                href: filterUri(el.attr("href")),
                title: el.attr("title")
            });
        });
        // Capture clicks on the navigation sidebar tabs
        Page.relatedContentElement().on("click", "a", function () {
            var $el = jQuery(this);
            var id = $el.attr('id');

            id = /^view_project_issuetype_\d+$/.test(id) ? "view_project_issuetype" : id;

            var data = {
                id: id,
                href: filterUri($el.attr("href")),
                title: $el.text(),
                isAdmin: adminData.isUserAdmin(),
                isSysAdmin: adminData.isUserSysAdmin(),
                projectType: projectData.getProjectType()
            };

            sendAdminNavEvent("tabs", data);
        });
        // Capture clicks on a project header (even if it wouldnt"t do anything)
        // we wonder if people think it"ll take them back to hte summary page
        $document.on("click", "#project-config-header-name", function () {
            sendAdminNavEvent("projectheader");
        });

        // Capture clicks on a project avatar (even if it wouldn"t do anything)
        $document.on("click", "#project-config-header-avatar", function () {
            sendAdminNavEvent("projectavatar");
        });

        // Capture clicks on the "back to project: X" back-links on some configuration pages.
        $document.on("click", ".back-to-proj-config", function () {
            sendAdminNavEvent("backtoproject", {
                href: filterUri(jQuery(this).attr("href"))
            });
        });
        // Capture clicks on selected scheme links
        $document.on("click", ".project-config-summary-scheme a", function () {
            sendAdminNavEvent("selectedscheme", {
                href: filterUri(jQuery(this).attr("href"))
            });
        });
        $document.on("click", ".project-config-workflow-text-link", function () {
            sendAdminProjectWorkflowEvent("viewastext");
        });
        $document.on("click", ".project-config-screen", function () {
            sendAdminProjectWorkflowEvent("gotoscreen");
        });
        $document.on("click", ".project-config-workflow-edit", function () {
            if (jQuery(this).closest(".project-config-workflow-default").length) {
                sendAdminProjectWorkflowEvent("copyworkflow");
            } else {
                sendAdminProjectWorkflowEvent("editworkflow");
            }
        });
        //CAS-233: Fire event when editing workflow from issue type config rather than old workflow tab.
        $document.on("click", ".issuetypeconfig-edit-workflow", function () {
            sendAdminProjectWorkflowEvent("editworkflowissuetype");
        });
        $document.on("click", "#toggleWorkflowTab", function (event) {
            sendProjectIssueTypeConfigTabEvent("workflow", event);
        });
        $document.on("click", "#toggleViewTab", function (event) {
            sendProjectIssueTypeConfigTabEvent("view", event);
        });
        $document.on("click", ".project-config-workflow-diagram-container", function () {
            sendAdminProjectWorkflowEvent("enlargeworkflow");
        });
        $document.on("click", "#project-config-workflows-view-original", function () {
            sendProjectWorkflowSchemeEvent("vieworiginalofdraft");
        });
        $document.on("click", "#project-config-workflows-view-draft", function () {
            sendProjectWorkflowSchemeEvent("viewdraft");
        });
        $document.on("click", "#project-config-workflows-scheme-change", function () {
            sendProjectWorkflowSchemeEvent("switchscheme");
        });
        $document.on("click", "#project_import_link_lnk", function () {
            sendAdminNavEvent("topnav.jim");
        });
        bindSelectWorkflowModeClick(".workflow-view-toggle", false);
        bindSelectWorkflowModeClick(".workflow-edit-toggle", true);
        bindEditWorkflowTextModeClicks("#workflow-step-add-submit", "add", "step");
        bindEditWorkflowTextModeClicks("#workflow-step-update", "update", "step");
        bindEditWorkflowTextModeClicks("#workflow-step-delete", "remove", "step");
        bindEditWorkflowTextModeClicks("#workflow-transition-add", "add", "transition");
        bindEditWorkflowTextModeClicks("#workflow-transition-update", "update", "transition");
        bindEditWorkflowTextModeClicks("#workflow-transition-delete", "remove", "transition");
        bindEditWorkflowTextModeClicks("#workflow-global-transition-update", "update", "globaltransition");
        Events.bind("wfd-edit-action", function (e, data) {
            sendEditWorkflowEvent("diagram", data.action, data.object);
        });
    }

    return {
        bindEvents: bindEvents,
        event: event,
        sendProjectWorkflowSchemeEvent: sendProjectWorkflowSchemeEvent,
        sendLoadWorkflowsTabEvent: sendLoadWorkflowsTabEvent
    };
});

AJS.namespace('JIRA.Analytics', null, require('jira/admin/analytics'));