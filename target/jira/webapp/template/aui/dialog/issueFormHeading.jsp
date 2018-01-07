<%--

Required Parameters:
    * title                      - The text to be used in the heading
    * issueKey                   - The issue key
    * issueSummary               - The summary of the issue
    * cameFromParent             - Whether this dialog was triggered from the parent issue
    * cameFromSelf               - Whether this dialog was triggered from viewing itself

Optional Params:
    * subtaskTitle               - The title of the dialog for when it was opened as subtask

--%>
<%@ taglib prefix="ww" uri="webwork" %>
<%@ taglib prefix="aui" uri="webwork" %>
<aui:component template="formHeading.jsp" theme="'aui'">
    <aui:param name="'escape'" value="false"/>
    <aui:param name="'cssClass'">dialog-title</aui:param>
    <aui:param name="'text'">
        <ww:property value="parameters['cameFromParent']">
            <ww:if test=". && . == true">
                <ww:property value="parameters['subtaskTitle']"/>
            </ww:if>
            <ww:else>
                <ww:property value="parameters['title']"/>
            </ww:else>
        </ww:property>
    </aui:param>
</aui:component>
