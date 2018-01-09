<%@ page import="com.atlassian.jira.component.ComponentAccessor" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>

<ww:if test="/schemeId != null">
    <ww:property id="command" value="/text('admin.common.words.modify')"/>
</ww:if>
<ww:else>
    <ww:property id="command" value="/text('common.words.add')"/>
</ww:else>

<%-- The page is used for the manageable option object --%>
<ww:property value="/manageableOption">
    <html>
    <head>
        <meta name="admin.active.section" content="admin_issues_menu/priorities_section"/>
        <meta name="admin.active.tab" content="priority_schemes"/>
        <title>
            <ww:property value="@command"/>
            <ww:text name="'admin.issuesettings.priorities.priorityscheme'"/>
        </title>
    </head>
    <body>
    <header class="aui-page-header">
        <div class="aui-page-header-inner">
            <div class="aui-page-header-main">
                <h2>
                    <ww:property value="@command"/>
                    <ww:text name="'admin.issuesettings.priorities.priorityscheme'"/>
                </h2>
            </div>
        </div>
    </header>

    <fieldset class="hidden parameters">
        <input type="hidden" title="fieldId" value="<ww:property value="fieldId"/>"/>
    </fieldset>

    <ui:soy moduleKey="'com.atlassian.jira.jira-project-config-plugin:project-config-used-by-lozenge'" template="'JIRA.Templates.ProjectAdmin.UsedBy.usedBy'">
        <ui:param name="'projects'" value="/projectsForScheme"/>
        <ui:param name="'title'">
            <ww:text name="'admin.common.project.used.list.heading.scheme'">
                <ww:param name="'value0'" value="/projectsForScheme/size"></ww:param>
            </ww:text>
        </ui:param>
    </ui:soy>

    <page:applyDecorator name="auiform">
        <page:param name="useCustomButtons">true</page:param>
        <page:param name="method">post</page:param>
        <page:param name="id">configure-priority-scheme-form</page:param>
        <ww:if test="/schemeId != null">
            <page:param name="action">EditPriorityScheme.jspa</page:param>
        </ww:if>
        <ww:else>
            <page:param name="action">AddPriorityScheme.jspa</page:param>
        </ww:else>

        <aui:component template="multihidden.jsp" theme="'aui'">
            <aui:param name="'fields'">schemeId,fieldId,projectId</aui:param>
        </aui:component>

        <page:applyDecorator name="auifieldgroup">
            <aui:textfield theme="'aui'" label="text('common.words.name')" name="'name'"
                           mandatory="'true'" id="'priority -scheme-name'"/>
        </page:applyDecorator>

        <page:applyDecorator name="auifieldgroup">
            <aui:textfield theme="'aui'" label="text('common.words.description')" name="'description'" size="'long'"
                           id="'priority-scheme-description'"/>
        </page:applyDecorator>

        <div>
            <h4 id="select-priorities">
                <span><ww:text name="'common.words.select'"></ww:text></span>
                <span class="lowercase"><ww:property value="title"/></span>
            </h4>
            <p>
                <span class="break-line"><ww:text
                        name="'admin.issuesettings.priorities.change.order.by.drag.drop'"></ww:text></span>
                <span><ww:text name="'admin.issuesettings.priorities.similarly.drag.drop.to.remove'"/></span>
            </p>
        </div>

        <div id="optionsContainer" class="ab-drag-wrap">

            <div id="left" class="ab-drag-container">
                <p class="sentence-case">
                    <span class="lowercase"><ww:text name="'admin.common.words.selected'"></ww:text></span>
                    <span class="lowercase"><ww:property value="title"/></span>
                </p>
                <div class="ab-items">
                    <a class="ab-all" href="#" id="removeAllSelectedOptions"><ww:text
                            name="'admin.issuesettings.remove.all'"/></a>
                    <ul id="selectedOptions" class="grabable" style="min-height:<ww:property value="/maxHeight"/>px;">
                        <ww:iterator value="/optionsForScheme" status="'status'">
                            <li id="selectedOptions_<ww:property value="./id" />">
                                <span class="icon icon-vgrabber"></span>
                                <img class="icon jira-icon-image" src="<ww:url value="./imagePath" />" alt=""/>
                                <span class="priority-name"><ww:property value="./name"/></span>
                            </li>
                        </ww:iterator>
                    </ul>
                </div>
            </div>

            <div id="right" class="ab-drag-container">
                <p class="sentence-case lowercase">
                    <ww:text name="'admin.issuesettings.available.issue.types'">
                        <ww:param name="'value0'"><ww:property value="title"/></ww:param>
                    </ww:text>
                </p>
                <div class="ab-items">
                    <a class="ab-all" href="#" id="addAllAvailableOptions">
                        <ww:text name="'admin.issuesettings.add.all'"/>
                    </a>
                    <ul id="availableOptions" class="grabable"
                        style="min-height:<ww:property value="/maxHeight"/>px;">
                        <ww:iterator value="/availableOptions" status="'status'">
                            <li id="availableOptions_<ww:property value="./id" />">
                                <span class="icon icon-vgrabber"></span>
                                <img class="icon jira-icon-image" src="<ww:url value="./imagePath" />" alt=""/>
                                <span class="priority-name"><ww:property value="./name"/></span>
                            </li>
                        </ww:iterator>
                    </ul>
                </div>
            </div>
        </div>

        <page:applyDecorator name="auifieldgroup">
            <aui:select theme="'aui'" label="text('admin.issuesettings.priorities.add.priorityscheme.default')"
                        name="'defaultOption'" list="/allOptions"
                        listKey="'id'" listValue="'name'" id="'default-priority-select'">
                <aui:param name="'defaultOptionText'"><ww:text name="'common.words.none'"/></aui:param>
                <aui:param name="'defaultOptionValue'" value="''"/>
            </aui:select>
        </page:applyDecorator>

        <page:applyDecorator name="auifieldgroup">
            <page:param name="type">buttons-container</page:param>
            <page:applyDecorator name="auifieldgroup">
                <page:param name="type">buttons</page:param>
                <aui:component template="formSubmit.jsp" theme="'aui'">
                    <aui:param name="'submitButtonName'">save</aui:param>
                    <ww:if test="/schemeId != null">
                        <aui:param name="'submitButtonText'"><ww:text name="'common.words.update'"/></aui:param>
                    </ww:if>
                    <ww:else>
                        <aui:param name="'submitButtonText'"><ww:text name="'common.words.add'"/></aui:param>
                    </ww:else>
                    <aui:param name="'submitButtonCssClass'">aui-button aui-button-primary</aui:param>
                    <aui:param name="'id'">submitSave</aui:param>
                </aui:component>
                <aui:component template="formCancel.jsp" theme="'aui'">
                    <aui:param name="'cancelLinkURI'">ViewPrioritySchemes.jspa</aui:param>
                </aui:component>
            </page:applyDecorator>
        </page:applyDecorator>

    </page:applyDecorator>
    <%
        WebResourceManager webResourceManager = ComponentAccessor.getWebResourceManager();
        webResourceManager.requireResource("jira.webresources:configure-priority-scheme");
    %>
    </body>
    </html>
</ww:property>
