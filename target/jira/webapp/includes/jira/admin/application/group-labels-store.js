define("jira/admin/application/group-labels-store", ["jquery", "underscore", "wrm/context-path"], function ($, _, wrmContextPath) {
    var GroupLabelsStore = {
        listeners: [],
        lastResult: null,
        lastRequest: null,

        syncLabels: function syncLabels(groupName, roleName, callback) {
            var listener = {
                groupName: groupName,
                roleName: roleName,
                callback: callback
            };
            this.listeners.push(listener);

            if (this.lastResult) {
                this.triggerListener(listener, this.lastResult);
            }

            this.fetchLabels();

            // return value used in tests
            return listener;
        },

        removeHandler: function removeHandler(callback) {
            this.listeners = this.listeners.filter(function (listener) {
                return listener.callback !== callback;
            });
        },

        fetchLabels: function fetchLabels() {
            // nevermind any ongoing request as it may return outdated information
            if (this.lastRequest && !this.lastRequest.isResolved()) {
                this.lastRequest.abort();
            }

            this.doRequest();
        },

        // Postponing request with debounce until input stops arriving
        doRequest: _.debounce(function () {
            this.lastRequest = $.get(wrmContextPath() + "/rest/internal/2/applicationrole/groups").then(this.triggerListeners.bind(this));
        }, 50),

        triggerListeners: function triggerListeners(result) {
            this.lastResult = result;
            this.listeners.forEach(function (listener) {
                this.triggerListener(listener, result);
            }, this);
        },

        triggerListener: function triggerListener(listener, result) {
            result.forEach(function (group) {
                if (listener.groupName == group.name) {
                    listener.callback(group.labels);
                }
            });
        }
    };

    return GroupLabelsStore;
});