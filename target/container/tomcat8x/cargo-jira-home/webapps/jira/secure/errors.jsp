<%@ taglib prefix="ww" uri="webwork" %>
<%@ page import="com.atlassian.jira.health.web.JohnsonPageDataProvider" %>
<%@ page import="com.atlassian.jira.health.web.JohnsonPageEndpointsProvider" %>
<%@ page import="com.atlassian.jira.health.web.JohnsonPageI18NProvider" %>
<%@ page import="com.atlassian.johnson.Johnson" %>
<%@ page import="com.atlassian.johnson.JohnsonEventContainer" %>
<%
    final JohnsonEventContainer appEventContainer = Johnson.getEventContainer(pageContext.getServletContext());

    // If there are events outstanding, then display them in a table.
    if (appEventContainer.hasEvents()) {
        response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
    }

    final JohnsonPageDataProvider dataProvider = JohnsonPageDataProvider.createInstance(pageContext.getServletContext());
%>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><ww:text name="'system.error.access.constraints.title'"/></title>
    <script>
        window.endpoints = <%=JohnsonPageEndpointsProvider.asJSON(request.getContextPath()).toString()%>;
        window.initialData = <%=dataProvider.asJSON().toString()%>;
        window.i18n = <%=JohnsonPageI18NProvider.asJSON().toString()%>;
    </script>
  </head>
  <jsp:include page="./johnson-page/johnson-error-page.html" />
</html>
