var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

AJS.test.require(["jira.webresources:inline-layer", "jira.webresources:ajs-underscorejs-amd-shim"], function () {

    var JS_TICK = 4;

    var Class = require('jira/lib/class');
    var ContentRetriever = require('jira/ajs/contentretriever/content-retriever');
    var OptionsDescriptor = require('jira/ajs/layer/inline-layer/options-descriptor');
    var WindowPositioning = require('jira/ajs/layer/inline-layer/window-positioning');
    var StandardPositioning = require('jira/ajs/layer/inline-layer/standard-positioning');
    var LayerConstants = require('jira/ajs/layer/layer-constants');
    var _ = require('underscore');
    var $ = require('jquery');
    var InlineLayer;

    function fakeStandardPositioning() {
        return Class.extend({
            offset: function offset() {
                return { top: 0, left: 0 };
            }
        });
    }

    var assert = {
        dropdown: {
            isLeftAligned: function isLeftAligned($field, $layer, message) {
                message = message ? message : 'should be left-aligned';
                equal($layer.offset().left, $field.offset().left, message);
            },

            isRightAligned: function isRightAligned($field, $layer, message) {
                message = message ? message : 'should be right-aligned';
                equal($layer.offset().left + $layer.outerWidth(true), $field.offset().left + $field.outerWidth(true), message);
            },

            isOnLeftSide: function isOnLeftSide($field, $layer, message) {
                message = message ? message : 'should be on the left of the trigger';
                equal($layer.offset().left + $layer.outerWidth(true), $field.offset().left, message);
            },

            isOnRightSide: function isOnRightSide($field, $layer, message) {
                message = message ? message : 'should be on the right of the trigger';
                equal($layer.offset().left, $field.offset().left + $field.outerWidth(true), message);
            },

            isUnderneath: function isUnderneath($field, $layer, message) {
                message = message ? message : 'should have been placed underneath the trigger';
                equal($layer.offset().top, $field.offset().top + $field.outerHeight(true), message);
            },

            /**
             *  For cushion see:
             *   {@link InlineLayer.OptionsDescriptor._getDefaultOptions}
             *   {@link InlineLayer.WindowPositioning._minWindowMargin}
             */
            isNearBottom: function isNearBottom($layer, message) {
                var cushion = 0;
                message = message ? message : 'should have been placed near the bottom of the page';
                equal($layer.offset().top + $layer.outerHeight(true), $(window).height() - cushion, message);
            }
        }
    };

    module('jira/ajs/layer/inline-layer', {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();
            this.context.mock('jira/ajs/layer/inline-layer/options-descriptor', OptionsDescriptor); // to make instanceof checks work
            this.context.mock('jira/ajs/contentretriever/content-retriever', ContentRetriever); // to make instanceof checks work
            this.$field = $('<button type="button">Offset target</button>').appendTo(document.body);
            this.$field.css({ position: 'absolute', width: '100px', height: '100px' });
        },
        teardown: function teardown() {
            this.$field.remove();
            if (this.__layer) {
                this.__layer.hide();
                this.clock && this.clock.tick(0);
                this.__layer.layer().remove();
            }
        },
        makeLayer: function makeLayer(opts) {
            opts = (typeof opts === "undefined" ? "undefined" : _typeof(opts)) === 'object' ? opts : {};
            InlineLayer = this.context.require('jira/ajs/layer/inline-layer');
            this.__layer = new InlineLayer(_.extend({
                content: '<p>dummy</p>',
                offsetTarget: this.$field
            }, opts));
            this.__layer.layer().css({
                padding: '0px',
                margin: '0px',
                border: '0px'
            });
            return this.__layer;
        }
    });

    test('can be constructed', function () {
        InlineLayer = require('jira/ajs/layer/inline-layer');
        var layer = new InlineLayer({
            content: '<p>dummy</p>'
        });
        equal(typeof layer === "undefined" ? "undefined" : _typeof(layer), 'object', 'should be an object');
    });

    /**
     * trigger ($field) has width of 100px
     * layer has width of 200px
     * dropdown is left aligned
     * if trigger is placed more than 200px away (e.g. 250px) from window edge it should not change alignment to right
     *
     *     100px
     *  ###########              # window edge
     *  # trigger #              #
     *  ######################   #
     *  #        layer       #   #
     *  ######################   #
     *           200px        50px
     */
    test('keep left align when near right window edge and still having space', function () {
        var windowWidth = $(window).width();
        this.$field.css({ left: windowWidth - 250, top: 0 });
        var layer = this.makeLayer({
            width: 200, // inner
            positioningController: new StandardPositioning(),
            alignment: LayerConstants.LEFT
        });
        layer.show();
        assert.dropdown.isLeftAligned(this.$field, layer.layer());
        assert.dropdown.isUnderneath(this.$field, layer.layer());
    });

    /**
     * trigger ($field) has width of 100px
     * layer has width of 200px
     * dropdown is left aligned
     * if trigger is placed less than 200px away (e.g. 150px) from window edge it should have right alignment
     *
     *     100px
     *  ###########     #  window edge
     *  # trigger #     #
     *  ######################
     *  #        layer  #    #
     *  ######################
     *           200px  # 50px
     */
    test('change align to right from left if out of right window edge', function () {
        var windowWidth = $(window).width();
        this.$field.css({ left: windowWidth - 150, top: 0 });
        var layer = this.makeLayer({
            width: 200, // inner
            positioningController: new StandardPositioning(),
            alignment: LayerConstants.LEFT
        });
        layer.show();
        assert.dropdown.isRightAligned(this.$field, layer.layer());
        assert.dropdown.isUnderneath(this.$field, layer.layer());
    });

    test('keep right align when near left window edge and still having space', function () {
        this.$field.css({ left: 101, top: 0 });
        var layer = this.makeLayer({
            width: 200, // inner
            positioningController: new StandardPositioning(),
            alignment: LayerConstants.RIGHT
        });
        layer.show();
        assert.dropdown.isRightAligned(this.$field, layer.layer());
        assert.dropdown.isUnderneath(this.$field, layer.layer());
    });

    test('change align to left from right if out of left window edge', function () {
        this.$field.css({ left: 100, top: 0 });
        var layer = this.makeLayer({
            width: 200, // inner
            positioningController: new StandardPositioning(),
            alignment: LayerConstants.RIGHT
        });
        layer.show();
        assert.dropdown.isLeftAligned(this.$field, layer.layer());
        assert.dropdown.isUnderneath(this.$field, layer.layer());
    });

    test('[WindowPositioning] should appear below trigger if enough room', function () {
        this.$field.css({ left: 0, top: 0 });
        var layer = this.makeLayer({ positioningController: new WindowPositioning() });
        layer.show();
        assert.dropdown.isLeftAligned(this.$field, layer.layer());
        assert.dropdown.isUnderneath(this.$field, layer.layer());
    });

    test('[WindowPositioning] should move to the RHS if not enough room below', function () {
        this.$field.css({ left: 0, bottom: 0 });
        var layer = this.makeLayer({ positioningController: new WindowPositioning() });
        layer.show();
        assert.dropdown.isOnRightSide(this.$field, layer.layer());
        assert.dropdown.isNearBottom(layer.layer());
    });

    test('[WindowPositioning] should move to the LHS if not enough room below or to the right', function () {
        this.$field.css({ right: 0, bottom: 0 });
        var layer = this.makeLayer({ positioningController: new WindowPositioning() });
        layer.show();
        assert.dropdown.isOnLeftSide(this.$field, layer.layer());
        assert.dropdown.isNearBottom(layer.layer());
    });

    test('[WindowPositioning] should move to the LHS when would otherwise clip if moved to the RHS (JSEV-397)', function () {
        var windowWidth = $(window).width();
        this.$field.css({ left: windowWidth - 250, bottom: 10, width: 175 });
        var layer = this.makeLayer({ positioningController: new WindowPositioning(), alignment: LayerConstants.LEFT });
        layer.show();
        assert.dropdown.isOnLeftSide(this.$field, layer.layer());
        assert.dropdown.isNearBottom(layer.layer());
    });

    test('[WindowPositioning] should move to the RHS when would otherwise clip if moved to the LHS', function () {
        this.$field.css({ left: 50, bottom: 10, width: 175 });
        var layer = this.makeLayer({ positioningController: new WindowPositioning(), alignment: LayerConstants.RIGHT });
        layer.show();
        assert.dropdown.isOnRightSide(this.$field, layer.layer());
        assert.dropdown.isNearBottom(layer.layer());
    });

    module('jira/ajs/layer/inline-layer - XSS', {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();
            this.context.mock('jira/ajs/layer/inline-layer/standard-positioning', fakeStandardPositioning());
            this.xssElement = document.createElement('iframe');
            document.querySelector('#qunit-fixture').appendChild(this.xssElement);
        },
        teardown: function teardown() {
            window.xssSpy = null;
        }
    });

    asyncTest("offset still works without window.name xss", function (assert) {
        window.xssSpy = this.spy();
        var xssName = "1,<img src='/' onerror=xssSpy()>";
        this.xssElement.name = xssName;
        var IFramePositioning = this.context.require('jira/ajs/layer/inline-layer/iframe-positioning');
        this.stub(IFramePositioning, 'window').returns({ name: xssName });
        this.stub(IFramePositioning, 'topWindow').returns(window); // i.e., the context of this test, not the test runner
        var ours = new IFramePositioning();

        ours.offset(); // throws exception if fails

        setTimeout(function () {
            ok(window.xssSpy.notCalled, "xssSpy() was called, when it shouldn't have");
            start();
        }, JS_TICK);
    });
});