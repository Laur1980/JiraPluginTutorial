define('jira/project/project-edit-key/element', ['require'], function (require) {
    var ProjectEditKey = require('jira/project/project-edit-key');
    var skate = require('jira/skate');

    return skate('js-edit-project-fields', {
        type: skate.type.CLASSNAME,
        attached: function editProjectFieldsAttached(form) {
            if (!form.projectEditKey) {
                form.projectEditKey = new ProjectEditKey(form);
            }
        },
        events: {
            "input #project-edit-key": function modified(element) {
                element.modified();
            }
        },
        prototype: {
            modified: function modified() {
                this.projectEditKey.checkModified();
            }
        }
    });
});

// Invoke immediately.
require(['jira/project/project-edit-key/element']);