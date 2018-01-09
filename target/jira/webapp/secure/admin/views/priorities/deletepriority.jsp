
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>


<html>
<head>
	<title><ww:text name="'admin.issuesettings.priorities.delete.priority'"/></title>
    <meta name="admin.active.section" content="admin_issues_menu/priorities_section"/>
    <meta name="admin.active.tab" content="priorities"/>
</head>
<body>

<ww:if test="/hasErrorMessages == true">
    <ui:soy moduleKey="'jira.webresources:priority-delete'" template="'JIRA.Templates.Admin.Priority.Delete.errorContent'">
        <ui:param name="'errorMessages'" value="/errorMessages">
        </ui:param>
    </ui:soy>
</ww:if>
<ww:else>

    <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.page.pageHeader'">
        <ui:param name="'content'">
            <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.page.pageHeaderMain'">
                <ui:param name="'content'">
                    <h2><ww:text name="'admin.issuesettings.priorities.delete.priority'"/></h2>
                </ui:param>
            </ui:soy>
        </ui:param>
    </ui:soy>

    <ww:if test="/showNextId == false">
        <p>
            <ww:text name="'admin.issuesettings.priorities.delete.confirm.no.issues'">
                <ww:param name="'value0'"><strong></ww:param>
                <ww:param name="'value1'"><ww:property value="constant/string('name')" /></ww:param>
                <ww:param name="'value2'"></strong></ww:param>
            </ww:text>
        </p>
    </ww:if>
    <ww:else>
        <p>
            <ww:text name="'admin.issuesettings.priorities.delete.confirm'">
                <ww:param name="'value0'"><strong></ww:param>
                <ww:param name="'value1'"><ww:property value="constant/string('name')" /></ww:param>
                <ww:param name="'value2'"></strong></ww:param>
                <ww:param name="'value3'" value="matchingIssues/size" />
            </ww:text>
        </p>
    </ww:else>

    <page:applyDecorator name="auiform">
        <page:param name="action">DeletePriority.jspa</page:param>
        <page:param name="enableFormErrors">false</page:param>

        <ww:if test="/showNextId == true">
            <page:applyDecorator name="auifieldgroup">
                <label for="newId"><ww:text name="'admin.issuesettings.priorities.delete.new.priority'"/></label>
                <aui-select
                        id="newId"
                        name="newId"
                        placeholder="<ww:text name="'admin.issuesettings.priorities.delete.new.priority.placeholder'"/>"
                >
                    <ww:iterator value="/newConstants">
                        <aui-option value="<ww:property value="./id"/>"
                                    data-option-name="<ww:property value="./name"/>"
                        ><ww:property value="./name"/></aui-option>
                    </ww:iterator>
                </aui-select>

                <ww:if test="newIdError">
                    <div class="error"><ww:property value="newIdError"/></div>
                </ww:if>


            </page:applyDecorator>
        </ww:if>

        <page:param name="submitButtonText"><ww:text name="'common.words.delete'"/></page:param>
        <page:param name="submitButtonName">delete</page:param>
        <page:param name="submitButtonIsPrimary">true</page:param>

        <page:param name="cancelLinkURI">ViewPriorities.jspa</page:param>


        <ui:component name="'id'" template="hidden.jsp" />
        <input type="hidden" name="confirm" value="true">
    </page:applyDecorator>
</ww:else>



</body>
</html>
