<%@ taglib prefix="ww" uri="webwork" %>
<%@ taglib prefix="aui" uri="webwork" %>
<%@ taglib prefix="page" uri="sitemesh-page" %>
<html>
<head>
    <title><ww:text name="'logout.confirm.title'"/></title>
    <meta name="decorator" content="login" />
</head>
<body>
    <div class="form-body">
        <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
            <ui:param name="'mainContent'">
                <h1><ww:text name="'logout.confirm.title'"/></h1>
            </ui:param>
        </ui:soy>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">warning</aui:param>
            <aui:param name="'messageHtml'">
                <p><ww:text name="'logout.confirm.desc'"/></p>
            </aui:param>
        </aui:component>
        <form id="confirm-logout" method="post" class="aui" action="<ww:url value="'/secure/Logout.jspa'"/>" style="margin: 1em 0 0 0;">
            <aui:component name="'confirm'" template="hidden.jsp" theme="'aui'" value="'true'" />
            <input id="confirm-logout-submit" name="Logout" type="submit" class="aui-button aui-button-primary" value="<ww:text name="'common.concepts.logout'"/>" />
        </form>
    </div>
</body>
</html>
