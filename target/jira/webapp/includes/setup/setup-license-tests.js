AJS.test.require(["jira.webresources:jira-setup"], function () {
    'use strict';

    var $ = require("jquery");
    var Flag = require("jira/flag");
    var wrmContextPath = require("wrm/context-path");

    var licenseKeyFromMAC = "AAA";

    module("jira/setup/setup-license", {
        setup: function setup() {
            this.fixture = $("#qunit-fixture");
            this.fixture.append(JIRA.Templates.LicenseSetup.pageMockForQUnit({
                macLicense: licenseKeyFromMAC
            }));

            this.sandbox = sinon.sandbox.create({
                useFakeTimers: true,
                useFakeServer: true
            });

            this.sandbox.stub(Flag, "showSuccessMsg");

            this.setupLicenseModule = require("jira/setup/setup-license");
        },

        teardown: function teardown() {
            this.sandbox.restore();
        },

        find: function find(selector) {
            return this.fixture.find(selector);
        },

        getSubmitButton: function getSubmitButton() {
            return this.find("input[type=submit]").eq(0);
        },

        startPage: function startPage() {
            this.setupLicenseModule.startPage();
            this.sandbox.clock.tick(1000); // to make the flags appear.
        }
    });

    test("existing license form: submit button should be enabled by default", function () {
        this.startPage();

        equal(this.getSubmitButton().is(":disabled"), false, "submit button should be enabled by default");
    });

    test("existing license form: m.a.c license is copied into the textarea", function () {
        this.startPage();

        equal(this.find("#licenseKey").html(), licenseKeyFromMAC, "License from m.a.c was not copied to the textarea");
    });

    test("existing license form: submit button is disabled while form is being submitted", function () {
        this.startPage();

        this.find("#importLicenseForm").submit();
        equal(this.getSubmitButton().is(":disabled"), true, "submit button should be disabled");
    });

    test("existing license form: error is displayed if license submitted is invalid (HTTP 403)", function () {
        var invalidLicenseKey = "foo";
        var formErrorTitleText = "setup.importlicense.validation.failure.header";
        var fakeFormError = "The license you submitted is invalid and other stuff the server would probably say.";

        this.startPage();

        this.find("#licenseKey").val(invalidLicenseKey);
        this.find("#importLicenseForm").submit();

        var req = this.sandbox.server.requests[0];

        equal(req instanceof Object, true, "should make an AJAX server request upon submit");
        equal(req.url, wrmContextPath() + "/secure/SetupLicense!validateLicense.jspa", "should send to the right location and not include license details in the URL");
        equal(req.requestBody, "licenseToValidate=" + invalidLicenseKey, "should send the license data in the multipart-form portion of the POST");

        req.respond(403, { "Content-Type": "application/json" }, JSON.stringify({ errors: [fakeFormError] }));

        equal(this.find("#formError").text(), formErrorTitleText + fakeFormError);
    });

    [200, 201, 204, 304].forEach(function (statusCode) {
        test("existing license form: form will submit if the server responds with a success HTTP code of " + statusCode, function () {
            var submitStub = this.sandbox.stub().returns(false);
            this.startPage();

            this.find("#setupLicenseForm").get(0).onsubmit = submitStub;
            this.find("#importLicenseForm").submit();

            var req = this.sandbox.server.requests[0];

            equal(req instanceof Object, true, "should make an AJAX server request upon submit");
            equal(req.url, wrmContextPath() + "/secure/SetupLicense!validateLicense.jspa", "should send to the right location and not include license details in the URL");

            req.respond(statusCode, { "Content-Type": "application/json" }, JSON.stringify({}));

            equal(submitStub.callCount, 1, "form should have been submitted");
        });
    });

    [300, 301, 302, 400, 401, 404, 500, 501, 503].forEach(function (statusCode) {
        test("existing license form: form will NOT submit if the server responds with a failure HTTP code of " + statusCode, function () {
            var submitStub = this.sandbox.stub().returns(false);
            this.startPage();

            this.find("#setupLicenseForm").get(0).onsubmit = submitStub;
            this.find("#importLicenseForm").submit();

            var req = this.sandbox.server.requests[0];

            equal(req instanceof Object, true, "should make an AJAX server request upon submit");
            equal(req.url, wrmContextPath() + "/secure/SetupLicense!validateLicense.jspa", "should send to the right location and not include license details in the URL");

            req.respond(statusCode, { "Content-Type": "application/json" }, JSON.stringify({ errors: ["An HTTP " + statusCode + " is a failure state"] }));

            equal(submitStub.callCount, 0, "form should NOT have been submitted");
        });
    });
});