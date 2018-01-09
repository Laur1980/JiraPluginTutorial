<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<html>
<head>
    <title><ww:text name="'admin.issuefields.screens.configure.screen'"/></title>
    <meta name="admin.active.section" content="admin_issues_menu/element_options_section/screens_section"/>
    <meta name="admin.active.tab" content="field_screens"/>
</head>
<body>
<ww:if test="/invalidInput == false">

    <page:applyDecorator name="jirapanel">
        <page:param name="title"><ww:text name="'admin.issuefields.screens.configure.screen'"/></page:param>
        <page:param name="width">100%</page:param>
        <page:param name="helpURL">fieldscreens</page:param>
        <page:param name="postTitle">
            <ui:soy moduleKey="'com.atlassian.jira.jira-project-config-plugin:project-config-used-by-lozenge'" template="'JIRA.Templates.ProjectAdmin.UsedBy.usedBy'">
                <ui:param name="'projects'" value="/usedIn"/>
                <ui:param name="'title'">
                    <ww:text name="'admin.common.project.used.list.heading.scheme'">
                        <ww:param name="'value0'" value="/usedIn/size"></ww:param>
                    </ww:text>
                </ui:param>
            </ui:soy>
        </page:param>
        <p>
            <ww:text name="'admin.issuefields.screens.configure.main.page.description'">
                <ww:param name="'value0'"><b id="screenName"><ww:property value="/fieldScreen/name" /></b></ww:param>
            </ww:text>
        </p>

        <p>
            <ww:text name="'admin.issuefields.screens.configure.note'">
                <ww:param name="'value0'"><span class="warning"></ww:param>
                <ww:param name="'value1'"></span></ww:param>
            </ww:text>
        </p>
    </page:applyDecorator>

    <div id="screen-editor" data-screen="<ww:property value="/fieldScreen/id" />"></div>
</ww:if>
<ww:else>
    <page:applyDecorator name="jirapanel">
        <page:param name="title"><ww:text name="'admin.issuefields.screens.configure.screen'"/></page:param>
        <page:param name="width">100%</page:param>
        <page:param name="helpURL">fieldscreens</page:param>
    </page:applyDecorator>
</ww:else>
</body>
</html>
