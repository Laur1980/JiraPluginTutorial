define('jira/ajs/list/list-with-messages', ['jira/ajs/list/list', 'jira/ajs/list/message-descriptor', 'jira/util/strings', 'jquery'], function (List, MessageDescriptor, strings, $) {
    'use strict';

    /**
     * AJS.List that can contain {@see MessageDescriptor}s as well
     *
     * @class ListWithMessages
     * @extends List
     */

    var ListWithMessages = List.extend({
        _filterOption: function _filterOption(item, keywordsRegex, labelRegex) {
            if (item instanceof MessageDescriptor) {
                // Always display messages
                return item;
            } else {
                return this._super(item, keywordsRegex, labelRegex);
            }
        },
        _computeVisibleItems: function _computeVisibleItems() {
            return this.items.not(".hidden, .disabled, .nofocus");
        },
        _generateOption: function _generateOption(item, query, labelRegex) {
            if (item instanceof MessageDescriptor) {
                return this._render(item.useAUI() ? "AUImessage" : "message", item);
            } else {
                return this._super(item, query, labelRegex);
            }
        }
    });

    /**
     * Renders a regular message
     * @param descriptor {MessageDescriptor} Descriptor to render
     * @return {*} Enhanced DOMElement that represents the descriptor
     */
    ListWithMessages.prototype._renders.message = function (descriptor) {
        //adding the label as a class for testing.
        var rawItemId = descriptor.messageID() || descriptor.fieldText() || descriptor.label();
        var itemId = strings.escapeHtml($.trim(rawItemId).toLowerCase()).replace(/[\s\.]+/g, "-");
        var listElem = $('<li class="aui-list-item nofocus">').addClass('aui-list-item-li-' + itemId);
        var messageElem = $('<span class="aui-list-item-message" />');

        //If no styleClass, use 'generic' as default
        if (descriptor.styleClass()) {
            messageElem.addClass(descriptor.styleClass());
        }

        //Add the text
        messageElem.text(descriptor.label());

        //Assemble the html and return it
        listElem.append(messageElem).data("descriptor", descriptor);

        return listElem;
    };

    /**
     * Renders an AUI message
     * @param descriptor {MessageDescriptor} Descriptor to render
     * @return {*} Enhanced DOMElement that represents the descriptor
     */
    ListWithMessages.prototype._renders.AUImessage = function (descriptor) {
        //adding the label as a class for testing.
        var rawItemId = descriptor.messageID() || descriptor.fieldText() || descriptor.label();
        var itemId = strings.escapeHtml($.trim(rawItemId).toLowerCase()).replace(/[\s\.]+/g, "-");
        var listElem = $('<li class="aui-list-item nofocus">').addClass('aui-list-item-li-' + itemId);
        var messageElem = $('<div class="aui-list-item-aui-message aui-message" />');
        var iconElem = $('<span class="aui-icon"/>');
        var contentElem = $('<p />');

        //If no styleClass, use 'generic' as default
        if (descriptor.styleClass()) {
            messageElem.addClass(descriptor.styleClass());
            iconElem.addClass("icon-" + descriptor.styleClass());
        } else {
            iconElem.addClass("icon-generic");
        }

        //Add the text
        contentElem.text(descriptor.label());

        //Assemble the html and return it
        messageElem.append(iconElem).append(contentElem);
        listElem.append(messageElem).data("descriptor", descriptor);

        return listElem;
    };

    return ListWithMessages;
});

AJS.namespace('AJS.ListWithMessages', null, require('jira/ajs/list/list-with-messages'));