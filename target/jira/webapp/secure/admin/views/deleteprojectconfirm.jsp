<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>

<html>
<head>
	<title>
        <ww:text name="'admin.deleteproject.delete.project'"/><ww:if test="$pcp != 'true'">: <ww:property value="project/name" /></ww:if>
    </title>
    <ww:if test="$pcp == 'true'">
        <meta name="decorator" content="admin">
        <meta name="projectKey" content='<ww:property value="/project/key"/>'/>
        <meta name="admin.active.section" content="atl.jira.proj.config"/>
        <meta name="admin.active.tab" content="view_delete_project"/>
    </ww:if>
    <ww:else>
        <meta name="admin.active.section" content="admin_project_menu/project_section"/>
        <meta name="admin.active.tab" content="view_projects"/>
    </ww:else>
</head>
<body>
    <ui:soy moduleKey="'jira.webresources:js-soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'mainContent'">
            <h2>
                <ww:text name="'admin.deleteproject.delete.project'"/><ww:if test="$pcp != 'true' && hasErrorMessages != 'true'">: <ww:property value="project/name" /></ww:if>
            </h2>
        </ui:param>
        <ui:param name="'id'">delete-project-confirm-header</ui:param>
    </ui:soy>

    <ww:if test="hasErrorMessages == 'true'">
        <div id="delete-project-no-such-project-error" class="aui-message error aui-message-error">
            <ww:iterator value="flushedErrorMessages">
                <p><ww:property value="." /></p>
            </ww:iterator>
        </div>
    </ww:if>
    <ww:else>
        <div id="delete-project-confirm-warning" class="aui-message aui-message-warning">
            <ww:if test="/systemAdministrator == 'true'">
                <ww:text name="'admin.deleteproject.warning'">
                    <p class="title">
                        <ww:param name="'value0'"><strong></ww:param>
                        <ww:param name="'value1'"></strong></ww:param>
                    </p>
                    <ww:param name="'value2'"><a href="XmlBackup!default.jspa"></ww:param>
                    <ww:param name="'value3'"></a></ww:param>
                </ww:text>
            </ww:if>
            <ww:else>
                <ww:text name="'admin.deleteproject.warning.admin'">
                    <p class="title">
                        <ww:param name="'value0'"><strong></ww:param>
                        <ww:param name="'value1'"></strong></ww:param>
                    </p>
                    <ww:param name="'value2'"> </ww:param>
                    <ww:param name="'value3'"> </ww:param>
                </ww:text>
            </ww:else>
        </div>

        <p><ww:text name="'admin.deleteproject.confirmation'"/></p>

        <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.form.form'">
            <ui:param name="'content'">
                <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.form.buttons'">
                    <ui:param name="'content'">
                        <button id="delete-project-confirm-submit" class="aui-button" type="submit" name="delete"><ww:text name="'common.words.delete'"/></button>
                        <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.form.linkButton'">
                            <ui:param name="'id'">delete-project-confirm-cancel</ui:param>
                            <ui:param name="'text'"><ww:text name="'common.words.cancel'"/></ui:param>
                            <ui:param name="'url'">
                                <ww:if test="$pcp == 'true'">
                                    <%= request.getContextPath() %>/plugins/servlet/project-config/<ww:property value="/project/key"/>
                                </ww:if>
                                <ww:else>
                                    <%= request.getContextPath() %>/secure/project/ViewProjects.jspa
                                </ww:else>
                            </ui:param>
                        </ui:soy>
                    </ui:param>
                </ui:soy>

                <ui:component name="'pid'" template="hidden.jsp" />
                <ui:component name="'atl_token'" value="/xsrfToken" template="hidden.jsp" />
                <input type="hidden" name="confirm" value="true">
            </ui:param>
            <ui:param name="'id'">delete-project-confirm</ui:param>
            <ui:param name="'action'">DeleteProject.jspa</ui:param>
        </ui:soy>
    </ww:else>
</body>
</html>
