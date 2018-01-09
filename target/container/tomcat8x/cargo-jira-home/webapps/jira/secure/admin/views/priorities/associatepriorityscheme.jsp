<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>

<html>
<head>
    <meta name="admin.active.section" content="admin_issues_menu/priorities_section"/>
    <meta name="admin.active.tab" content="priority_schemes"/>
    <title><ww:text name="'admin.issuesettings.priorities.associate.priorityscheme'"/></title>
</head>

<body>
<div id="associate-priority-scheme">
    <header class="aui-page-header">
        <div class="aui-page-header-inner">
            <div class="aui-page-header-main">
                <h2><ww:text name="'admin.issuesettings.priorities.associate.priorityscheme'"/></h2>
            </div>
        </div>
    </header>

    <ww:if test="/allProjects/empty == true">
        <p class="instructions">
            <ww:text name="'admin.issuesettings.priorities.associate.priorityscheme.no.projects.available'">
                <ww:param name="'value0'"><ww:property value="configScheme/name"/></ww:param>
            </ww:text>
        </p>
        <ui:soy moduleKey="'jira.webresources:priority-schemes-sd-warning'" template="'JIRA.Templates.Admin.PrioritySchemes.SDProjectsWarning.filteredSDProjectsWarning'">
            <ui:param name="'displaySDWarning'" value="/displaySDWarning"/>
        </ui:soy>
        <div class="buttons-container form-footer">
            <div class="buttons">
                <a class="aui-button cancel" href="ViewPrioritySchemes.jspa" id="cancel"
                   title="<ww:text name="'common.words.cancel'"/>"><ww:text name="'common.words.cancel'"/></a>
            </div>
        </div>
    </ww:if>
    <ww:else>
        <p>
            <ww:text name="'admin.issuesettings.priorities.associate.priorityscheme.instructions'"/>
        </p>
        <ui:soy moduleKey="'jira.webresources:priority-schemes-sd-warning'" template="'JIRA.Templates.Admin.PrioritySchemes.SDProjectsWarning.filteredSDProjectsWarning'">
            <ui:param name="'displaySDWarning'" value="/displaySDWarning"/>
        </ui:soy>
        <ww:if test="/default == true">
            <aui:component template="auimessage.jsp" theme="'aui'">
                <aui:param name="'messageType'">info</aui:param>
                <aui:param name="'messageHtml'">
                    <p><ww:text name="'admin.issuesettings.priorities.associate.only.unassociated.displayed'"/></p>
                </aui:param>
            </aui:component>
        </ww:if>

        <page:applyDecorator name="auiform">
            <page:param name="submitButtonIsPrimary">true</page:param>
            <page:param name="submitButtonText"><ww:text name="'common.words.next'"/></page:param>
            <page:param name="submitButtonName"><ww:text name="'common.words.next'"/></page:param>
            <page:param name="cancelLinkURI">ViewPrioritySchemes.jspa</page:param>
            <page:param name="action">AssociatePriorityScheme.jspa</page:param>
            <page:param name="width">100%</page:param>

            <ui:component template="multihidden.jsp">
                <ui:param name="'fields'">schemeId,fieldId</ui:param>
            </ui:component>

            <page:applyDecorator name="auifieldgroup">
                <label><ww:text name="'admin.issuesettings.priorities.scheme.name'"/></label>
                <span id="schemeName" class="field-value">
                <ww:property value="configScheme/name"/>
            </span>
            </page:applyDecorator>
            <page:applyDecorator name="auifieldgroup">
                <ui:select label="text('common.concepts.projects')" name="'projects'"
                           list="/allProjects" listKey="'id'" listValue="'name'" theme="'aui'"
                           template="selectmap.jsp">
                    <ui:param name="'rows'">9</ui:param>
                    <ui:param name="'multiselectByListKeys'">true</ui:param>
                </ui:select>
            </page:applyDecorator>
        </page:applyDecorator>
    </ww:else>
</div>
</body>
</html>
