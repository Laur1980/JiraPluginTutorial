AJS.test.require('jira.webresources:projectpermissions', function () {
    "use strict";

    require(['jira/project/permissions/permissionmodel', 'jquery', 'wrm/context-path'], function (PermissionModel, $, wrmContextPath) {
        var CHECKBOX_CHECKED = true;
        var CHECKBOX_UNCHECKED = false;
        var EXTENDED_ADMINISTER_PROJECTS_ENABLED_ATTRIBUTE = 'ADMINISTER_PROJECTS.extended.enabled';

        function mockPermissionRowView() {
            this.context = AJS.test.mockableModuleContext();

            this.AnalyticsMock = {
                send: sinon.spy()
            };
            this.context.mock('jira/analytics', this.AnalyticsMock);

            this.jQueryMock = {
                ajax: sinon.spy()
            };
            this.context.mock('jquery', this.jQueryMock);

            this.context.mock('jira/project/permissions/grantsview', function () {
                var render = sinon.stub();
                render.returns({ el: undefined });
                return { render: render };
            });

            return this.context.require('jira/project/permissions/permissionrowview');
        }

        function getPermissionRowModel(checked) {
            return new PermissionModel({
                id: 112233,
                permissionKey: 'ADMINISTER_PROJECTS',
                permissionName: 'Administer Projects',
                permissionDesc: 'Ability to administer a project in JIRA.',
                grants: [{
                    "securityType": "group",
                    "displayName": "Group",
                    "values": [{
                        "id": 10004,
                        "value": "jira-administrators",
                        "displayValue": "jira-administrators"
                    }]
                }],
                extPermission: {
                    "key": EXTENDED_ADMINISTER_PROJECTS_ENABLED_ATTRIBUTE,
                    "name": "Extended project administration",
                    "description": "If checked, project administrators will be able to edit workflows, screens, and notifications, and set default values for fields and custom fields.",
                    "endpointURI": "/rest/api/superduper-uri/attribute/" + EXTENDED_ADMINISTER_PROJECTS_ENABLED_ATTRIBUTE,
                    "checked": checked
                }
            });
        }

        module('Extended Permission - checked', {
            setup: function setup() {
                this.sandbox = sinon.sandbox.create();

                this.model = getPermissionRowModel(CHECKBOX_CHECKED);
                this.extPermission = this.model.get('extPermission');
                var MockedPermissionRowView = mockPermissionRowView.call(this);

                this.view = new MockedPermissionRowView({
                    el: $('#qunit-fixture'),
                    model: this.model
                });

                this.view.render();
            },

            teardown: function teardown() {
                this.sandbox.restore();
            }
        });

        test('Should render the extended permission', function () {
            var extPermissionContainer = $(this.view.el).find('.extended-permission');
            ok(extPermissionContainer.length > 0, 'Could not locate extended-permission container');

            strictEqual(extPermissionContainer.find('label').text().trim(), this.extPermission.name);
            strictEqual(extPermissionContainer.find('.description').text(), this.extPermission.description);
        });

        test('Extended permission checkbox should be checked', function () {
            ok(this.view.ui.extToggle.get(0).checked);
        });

        test('Should perform AJAX call to given endpoint', function () {
            this.view.ui.extToggle.click();

            sinon.assert.calledOnce(this.jQueryMock.ajax);
            sinon.assert.calledWithMatch(this.jQueryMock.ajax, sinon.match.has('url', wrmContextPath() + this.extPermission.endpointURI));
            sinon.assert.calledWithMatch(this.jQueryMock.ajax, sinon.match.has('data', JSON.stringify(CHECKBOX_UNCHECKED)));
            sinon.assert.calledWithMatch(this.jQueryMock.ajax, sinon.match.has('type', 'PUT'));
        });

        test('Should not perform another AJAX call when the previous is not completed yet', function () {
            this.view.ui.extToggle.get(0).busy = true;
            this.view.ui.extToggle.click();
            sinon.assert.notCalled(this.jQueryMock.ajax);
        });

        module('Extended Permission - unchecked', {
            setup: function setup() {
                this.sandbox = sinon.sandbox.create();

                this.model = getPermissionRowModel(CHECKBOX_UNCHECKED);
                this.extPermission = this.model.get('extPermission');
                var MockedPermissionRowView = mockPermissionRowView.call(this);

                this.view = new MockedPermissionRowView({
                    el: $('#qunit-fixture'),
                    model: this.model
                });

                this.view.render();
            },

            teardown: function teardown() {
                this.sandbox.restore();
            }
        });

        test('Extended permission checkbox should be unchecked', function () {
            ok(!this.view.ui.extToggle.get(0).checked);
        });

        test('Should perform AJAX call to given endpoint', function () {
            this.view.ui.extToggle.click();

            sinon.assert.calledOnce(this.jQueryMock.ajax);
            sinon.assert.calledWithMatch(this.jQueryMock.ajax, sinon.match.has('url', wrmContextPath() + this.extPermission.endpointURI));
            sinon.assert.calledWithMatch(this.jQueryMock.ajax, sinon.match.has('data', JSON.stringify(CHECKBOX_CHECKED)));
            sinon.assert.calledWithMatch(this.jQueryMock.ajax, sinon.match.has('type', 'PUT'));
        });
    });
});