AJS.test.require(['jira.webresources:jira-urlhelpers'], function () {
    'use strict';

    var jQuery = require('jquery');
    var urls;

    module('jira/util/urls#atl_token', {
        setup: function setup() {
            if (!jQuery('#atlassian-token').size()) {
                jQuery('<meta content="" id="atlassian-token" />').appendTo('#qunit-fixture');
            }
            urls = require('jira/util/urls');
        }
    });

    test('returns undefined if no token is set for the request', function () {
        jQuery('#atlassian-token').remove();
        equal(urls.atl_token(), undefined, 'should return undefined when there is no XSRF token');
    });

    test('returns the security token for the request', function () {
        var val = '1234|lin';
        jQuery('#atlassian-token').attr('content', val);
        equal(urls.atl_token(), val, 'should return the value of the current XSRF token');
    });
});