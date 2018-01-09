AJS.test.require(["jira.webresources:key-commands", "jira.webresources:dropdown"], function () {

    var $ = require("jquery");
    var dropDown;
    var trigger;

    module("Dropdown Menus", {
        setup: function setup() {
            this.clock = sinon.useFakeTimers();
            trigger = $("<a id='trigger' href='#whoops'>Trigger</a>").appendTo("#qunit-fixture");
            dropDown = $("<div id='dropDown' class='aui-list'>" + "<ul id='list_id'>" + "<li><a id='test-link-1' href='/test/path/1'>Test 1</a></li>" + "<li><a id='test-link-2' href='/test/path/2'>Test 2</a></li>" + "<li><a id='test-link-3' href='/test/path/3'>Test 3</a></li>" + "</ul>" + "</div>");
        },
        teardown: function teardown() {
            this.clock.restore();
            $(".ajs-layer").remove();
            dropDown.remove();
            trigger.remove();
        }
    });

    function click(target) {
        return target.click ? target.click() : $(target).click();
    }

    function focus(target) {
        return target.focus ? target.focus() : $(target).focus();
    }

    function pressKey(keyCode, target) {
        target = target || document;
        $(target).trigger({
            type: "keydown",
            keyCode: keyCode,
            which: keyCode
        });
    }

    test("Pressing enter on the trigger should open the dropdown and not follow the trigger's link", function () {
        trigger.appendTo(document.body);
        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });
        equal(dropDown.is(":visible"), false, "should not be visible upon creation");

        focus(trigger);
        pressKey(13, trigger); // = Enter key

        equal(dropDown.is(":visible"), true, "should be visible when the enter key is pressed on the trigger");
        equal(window.location.hash, "", "the URL hash should not have changed to '#whoops' as a result of activating the trigger");
        // NOTE: I know that not auto-focussing the first dropdown item is not the best option for an accessible dropdown.
        // AUI's Dropdown2 does better, and all usages of JIRA Dropdown should be refactored to use AUI's instead of JIRA's.
        // This behaviour will either change or be obsoleted in a future JIRA version.
        equal(trigger.get(0) === document.activeElement, true, "focus should stay on the trigger because this dropdown is not an auto-focus dropdown");
    });

    /**
     * We need to check for this, because some browser + screen-reader combos can effectively trigger toggle twice
     * via a double keydown or a click + keydown within the same user interaction.
     */
    test("Activating trigger multiple times should toggle the dropdown in a human-friendly way", function () {
        trigger.appendTo(document.body);
        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });
        equal(dropDown.is(":visible"), false, "should not be visible upon creation");

        // Try to open the dropdown by hitting enter twice 'at the same time'
        pressKey(13, trigger);
        pressKey(13, trigger);
        equal(dropDown.is(":visible"), true, "should be visible despite interacting with the toggle twice");

        // let a reasonable amount of time pass to signal the end of a single interaction
        this.clock.tick(4);

        pressKey(13, trigger);
        equal(dropDown.is(":visible"), false, "should disappear after the second interaction");

        // more time passes...
        this.clock.tick(4);

        click(trigger);
        pressKey(13, trigger);
        click(trigger);
    });

    // NOTE: I know that not auto-focussing the first dropdown item is not the best option for an accessible dropdown.
    // AUI's Dropdown2 does better, and all usages of JIRA Dropdown should be refactored to use AUI's instead of JIRA's.
    // This behaviour will either change or be obsoleted in a future JIRA version.
    test("Pressing enter on a trigger for an autofocus dropdown should focus the first dropdown item when opened", function () {
        trigger.appendTo(document.body);
        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger,
            focusFirstItem: true
        });

        focus(trigger);
        pressKey(13, trigger);

        equal(trigger.get(0) === document.activeElement, false, "focus should not be on the trigger because this dropdown is an auto-focus dropdown");
        equal($("#test-link-1").get(0) === document.activeElement, true, "focus should be on the first menu item");
    });

    test("Pressing escape while keyboard focus is inside the dropdown should return focus to the trigger", function () {
        trigger.appendTo(document.body);
        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });

        focus(trigger);
        pressKey(13, trigger);
        pressKey(40); // down, to focus the first item.
        equal(document.activeElement === document.getElementById('test-link-1'), true, "the first dropdown item should be focussed");

        // let a reasonable amount of time pass to signal the end of a single interaction
        this.clock.tick(4);
        pressKey(27);

        equal(document.activeElement === trigger.get(0), true, "the dropdown's trigger should be focussed");
    });

    test("Clicking outside the dropdown should NOT return focus to the trigger", function () {
        var $focusTrap = $('<textarea>Click me!</textarea>').appendTo("#qunit-fixture");
        trigger.appendTo(document.body);
        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });

        focus(trigger);
        pressKey(13, trigger);
        pressKey(40); // down, to focus the first item.
        equal(document.activeElement === document.getElementById('test-link-1'), true, "the first dropdown item should be focussed");

        // let a reasonable amount of time pass to signal the end of a single interaction
        this.clock.tick(4);
        click($focusTrap.get(0));

        equal(document.activeElement === trigger.get(0), false, "the dropdown's trigger should NOT be focussed");
    });

    module("Dropdown Menu Items", {
        setup: function setup() {
            trigger = $("<button type='button' id='trigger'>Trigger</button>").appendTo("#qunit-fixture");
        },
        teardown: function teardown() {
            $(".ajs-layer").remove();
            dropDown.remove();
            trigger.remove();
        }
    });

    test("An arrow keypress does not select hidden list entries", function () {
        dropDown = $("<div id='dropDown' class='aui-list'>" + "<ul id='list_id'>" + "<li id='visible-list-entry'>" + "<a id='test-link-1' href='/test/path/1'>Test 1</a>" + "</li>" + "<li id='hidden-list-entry' class='hidden'>" + "<a id='test-link-2' href='/test/path/2'>Test 2</a>" + "</li>" + "</ul>" + "</div>");

        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });

        click(trigger);
        pressKey(40);

        equal($('#visible-list-entry').hasClass("active"), true, "First LI has active class when down pressed once.");
        equal($('#visible-list-entry').find("a").get(0) === document.activeElement, true, "Menu item link should have document focus");

        pressKey(40);

        equal($('#hidden-list-entry').hasClass("active"), false, "Hidden LI doesn't have active class when down pressed twice.");
        equal($('#hidden-list-entry').find("a").get(0) === document.activeElement, false, "Hidden LI should not have document focus.");
    });

    test("An arrow keypress does not select nested list entries", function () {
        dropDown = $("<div id='dropDown'>" + "<ul id='nested_list_id'>" + "<li id='first-level-list-entry-1'>" + "<ul><li id='nested-list-entry'><a id='test-link-1' href='/test/path/1'>Test 1</a></li></ul>" + "</li>" + "<li id='first-level-list-entry-2'><a id='test-link-2' href='/test/path/2'>Test 2</a></li>" + "</ul>" + "</div>");

        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });

        click(trigger);
        pressKey(40);

        equal($('#nested-list-entry').hasClass("active"), false, "Nested LI does not have active class when down pressed once.");
        equal($('#first-level-list-entry-1').hasClass("active"), true, "Top level LI has active class when down pressed once.");

        pressKey(40);

        ok($('#first-level-list-entry-2').hasClass("active"), "Second top level LI has active class when down pressed twice.");
        ok($('#first-level-list-entry-2').find("a").get(0) === document.activeElement, true, "Second menu item should have document focus when down pressed twice.");
    });

    test("An arrow keypress does not select an list entry with no anchor", function () {
        dropDown = $("<div id='dropDown'>" + "<ul id='nested_list_id'>" + "<li id='empty-first-level-list-entry'>" + "<ul></ul>" + "</li>" + "<li id='first-level-list-entry-1'><a id='test-link-1' href='/test/path/1'>Test 1</a></li>" + "</ul>" + "</div>");

        AJS.Dropdown.create({
            content: dropDown,
            trigger: trigger
        });

        click(trigger);
        pressKey(40);

        equal($('#empty-first-level-list-entry').hasClass("active"), false, "Empty LI does not have active class when down pressed.");
        equal($('#first-level-list-entry-1').hasClass("active"), true, "First level LI has active class when down pressed once.");
        equal($('#first-level-list-entry-1').find("a").get(0) === document.activeElement, true, "First level menu item should have document focus when down pressed once.");
    });
});