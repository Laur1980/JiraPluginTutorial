<%@ page import="com.atlassian.jira.component.ComponentAccessor" %>
<%@ page import="com.atlassian.jira.plugin.keyboardshortcut.KeyboardShortcutManager" %>
<%@ taglib prefix="ww" uri="webwork" %>
<%@ taglib prefix="ui" uri="webwork" %>
<%@ taglib prefix="aui" uri="webwork" %>
<%@ taglib prefix="page" uri="sitemesh-page" %>
<html>
<head>
    <ww:if test="/parentIssueKey != null && allowedProjects/size > 0">
        <title><ww:text name="'createsubtaskissue.title'"/></title>
        <link rel="index" href="<ww:url value="/parentIssuePath" atltoken="false"/>" />
        <%
            KeyboardShortcutManager keyboardShortcutManager = ComponentAccessor.getComponent(KeyboardShortcutManager.class);
            keyboardShortcutManager.requireShortcutsForContext(KeyboardShortcutManager.Context.issuenavigation);
        %>
    </ww:if>
    <ww:else>
        <title><ww:text name="'common.words.error'"/></title>
        <meta name="decorator" content="message" />
    </ww:else>
</head>
<body class="aui-page-focused aui-page-focused-large">
<ww:if test="/parentIssueKey != null && allowedProjects/size > 0">
    <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'mainContent'">
            <h1><ww:text name="'createsubtaskissue.title'"/></h1>
        </ui:param>
    </ui:soy>
    <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.page.pagePanel'">
        <ui:param name="'content'">
        <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.page.pagePanelContent'">
            <ui:param name="'content'">
                <page:applyDecorator id="subtask-create-start" name="auiform">
                    <page:param name="action">CreateSubTaskIssue.jspa</page:param>
                    <page:param name="submitButtonName">Create</page:param>
                    <page:param name="submitButtonText"><ww:text name="'common.forms.next'" /></page:param>
                    <page:param name="cancelLinkURI"><ww:url value="/parentIssuePath" atltoken="false"/></page:param>

                    <aui:component id="'project'" name="'pid'" template="hidden.jsp" theme="'aui'">
                        <aui:param name="'cssClass'">project-field-readonly</aui:param>
                    </aui:component>

                    <aui:component name="'parentIssueId'" template="hidden.jsp" theme="'aui'" />

                    <ww:property value="/field('issuetype')/createHtml(null, /, /, /issueObject, /displayParams)" escape="'false'" />

                </page:applyDecorator>
            </ui:param>
        </ui:soy>
        </ui:param>
    </ui:soy>
</ww:if>
<ww:elseIf test="/parentIssueKey != null">
    <div class="form-body">
        <header>
            <h1><ww:text name="'common.words.error'"/></h1>
        </header>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">error</aui:param>
            <aui:param name="'messageHtml'">
                <%@ include file="/includes/noprojects.jsp" %>
            </aui:param>
        </aui:component>
    </div>
</ww:elseIf>
<ww:else>
    <div class="form-body">
        <header>
            <h1><ww:text name="'common.words.error'"/></h1>
        </header>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">error</aui:param>
            <aui:param name="'messageHtml'">
                <p><ww:text name="'issue.service.issue.wasdeleted'"/></p>
            </aui:param>
        </aui:component>
    </div>
</ww:else>
</body>
</html>
