<%@ page import="com.atlassian.jira.component.ComponentAccessor" %>
<%@ page import="com.atlassian.jira.plugin.navigation.HeaderFooterRendering" %>
<%@ page import="com.atlassian.web.servlet.api.LocationUpdater" %>

<!--[if IE]><![endif]--><%-- Leave this here - it stops IE blocking resource downloads - see http://www.phpied.com/conditional-comments-block-downloads/ --%>
<script type="text/javascript">
    (function() {
        var contextPath = '<%=request.getContextPath()%>';
        var eventBuffer = [];

        function printDeprecatedMsg() {
            if (console && console.warn) {
                console.warn('DEPRECATED JS - contextPath global variable has been deprecated since 7.4.0. Use `wrm/context-path` module instead.');
            }
        }

        function sendEvent(analytics, postfix) {
            analytics.send({
                name: 'js.globals.contextPath.' + postfix
            });
        }

        function sendDeprecatedEvent(postfix) {
            try {
                var analytics = require('jira/analytics');
                if (eventBuffer.length) {
                    eventBuffer.forEach(function(value) {
                        sendEvent(analytics, value);
                    });
                    eventBuffer = [];
                }

                if (postfix) {
                    sendEvent(analytics, postfix);
                }
            } catch(ex) {
                eventBuffer.push(postfix);
                setTimeout(sendDeprecatedEvent, 1000);
            }
        }

        Object.defineProperty(window, 'contextPath', {
            get: function() {
                printDeprecatedMsg();
                sendDeprecatedEvent('get');
                return contextPath;
            },
            set: function(value) {
                printDeprecatedMsg();
                sendDeprecatedEvent('set');
                contextPath = value;
            }
        });
    })();

</script>
<%
    final LocationUpdater locationUpdater = ComponentAccessor.getOSGiComponentInstanceOfType(LocationUpdater.class);
    locationUpdater.updateLocation(out);

    HeaderFooterRendering headerAndFooter = ComponentAccessor.getComponent(HeaderFooterRendering.class);

    headerAndFooter.requireCommonResources();
    headerAndFooter.includeResources(out);
    headerAndFooter.requireLookAndFeelResources();
    headerAndFooter.includeResources(out);
%>
<script type="text/javascript" src="<%=headerAndFooter.getKeyboardShortCutScript(request) %>"></script>
<%
    headerAndFooter.includeWebPanels(out, "atl.header.after.scripts");
%>
