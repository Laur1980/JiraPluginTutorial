<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<ww:bean name="'com.atlassian.jira.web.util.HelpUtil'" id="helpUtil" />
<% request.setAttribute("jira.logout.page.executed",Boolean.TRUE); %>
<html>
<head>
    <title><ww:text name="'xsrf.logout.error.title'"/></title>
    <meta name="decorator" content="login" />
</head>
<body>
    <div class="form-body">
        <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
            <ui:param name="'mainContent'">
                <h1><ww:text name="'xsrf.logout.error.title'"/></h1>
            </ui:param>
        </ui:soy>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">warning</aui:param>
            <aui:param name="'messageHtml'">
                <p><ww:text name="'xsrf.logout.info'"/></p>
                <p>
                    <ww:text name="'logout.desc.line2'">
                        <ww:param name="'value0'"><a href="<%= request.getContextPath() %>/login.jsp"></ww:param>
                        <ww:param name="'value1'"></a></ww:param>
                    </ww:text>
                </p>
            </aui:param>
        </aui:component>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'titleText'"><ww:text name="'xsrf.info.admin.1'"/></aui:param>
            <aui:param name="'messageHtml'">
                <p>
                    <ww:text name="'xsrf.info.admin.2'">
                        <ww:param name="'value0'"><a href="<ww:property value="@helpUtil/helpPath('xsrf')/url"/>"></ww:param>
                        <ww:param name="'value1'"></a></ww:param>
                    </ww:text>
                </p>
            </aui:param>
        </aui:component>
    </div>
</body>
</html>
