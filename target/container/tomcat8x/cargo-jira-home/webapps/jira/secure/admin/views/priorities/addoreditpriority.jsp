<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<html>
<head>
    <title><ww:property value="pageTitle"/></title>
    <meta name="admin.active.section" content="admin_issues_menu/priorities_section"/>
    <meta name="admin.active.tab" content="priorities"/>
</head>
<body>
<script language="JavaScript">
    function openWindow() {
        var vWinUsers = window.open('<%= request.getContextPath() %>/secure/popups/IconPicker.jspa?fieldType=priority&formName=jiraform', 'IconPicker', 'status=no,resizable=yes,top=100,left=200,width=580,height=650,scrollbars=yes');
        vWinUsers.opener = self;
        vWinUsers.focus();
    }
</script>

<page:applyDecorator name="auiform" id="add-edit-priority-form">
    <page:param name="formName">jiraform</page:param>
    <page:param name="action"><ww:property value="targetActionName"/></page:param>
    <page:param name="method">post</page:param>
    <page:param name="submitButtonText"><ww:property value="submitName"/></page:param>
    <page:param name="cancelLinkURI">ViewPriorities.jspa</page:param>
    <page:param name="submitButtonIsPrimary">true</page:param>

    <aui:component template="formHeading.jsp" theme="'aui'">
        <aui:param name="'text'"><ww:property value="title"/></aui:param>
    </aui:component>

    <page:applyDecorator name="auifieldgroup">
        <aui:textfield theme="'aui'" size="'medium'" label="text('common.words.name')" name="'name'" mandatory="'true'"/>
    </page:applyDecorator>

    <page:applyDecorator name="auifieldgroup">
        <aui:textarea label="text('common.words.description')" rows="3" name="'description'" theme="'aui'"/>
    </page:applyDecorator>

    <page:applyDecorator name="auifieldgroup">
        <aui:textfield theme="'aui'" label="text('admin.common.phrases.icon.url')" name="'iconurl'" mandatory="'true'"/>
        <span class="icon-picker-link">
            [<a href="#" class="subText" onclick="openWindow();return false;">
                <ww:text name="'admin.text.image.select.image'"/>
            </a>]
        </span>
        <div class="description">
            <ww:text name="'admin.issuesettings.priorities.relative.to.jira'"/>
        </div>
    </page:applyDecorator>

    <page:applyDecorator name="auifieldgroup">
        <aui:textfield theme="'aui'"
                       id="status-color-input"
                       size="'medium'"
                       label="text('admin.issuesettings.priorities.status.color')"
                       name="'statusColor'"
                       mandatory="'true'"/>
        <div class="color-display" id="statusColor-rep"
             onclick="window.open('<%= request.getContextPath() %>/secure/popups/<ww:url value="\'colorpicker.jsp\'"/>&amp;element=statusColor', 'colorpicker', 'menubar=yes,location=no,personalbar=no,scrollbar=yes,width=580,height=300,resizable');"
             style="background-color: <ww:property value="statusColor"/>">
        </div>
    </page:applyDecorator>

    <ww:if test="addIdField">
        <ui:component name="'id'" template="hidden.jsp"/>
    </ww:if>

    <input type="hidden" name="preview" value="false"/>
</page:applyDecorator>
</body>
</html>
