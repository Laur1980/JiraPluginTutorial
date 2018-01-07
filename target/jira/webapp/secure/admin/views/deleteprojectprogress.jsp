<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<ww:bean name="'com.atlassian.jira.util.JiraDateUtils'" id="dateUtils"/>
<jira:web-resource-require modules="jira.webresources:delete-project-progress"/>

<html>
<head>
    <title><ww:text name="'admin.projects.delete.project'"/></title>
    <meta name="admin.active.section" content="admin_project_menu/project_section"/>
    <meta name="admin.active.tab" content="view_projects"/>
    <ww:if test="/currentTask/finished == false">
        <meta http-equiv="refresh" content="5">
    </ww:if>
</head>
<body>
    <ui:soy moduleKey="'jira.webresources:js-soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'mainContent'">
            <h2>
                <ww:property value="/currentTask/description" />
            </h2>
        </ui:param>
        <ui:param name="'id'">delete-project-confirm-header</ui:param>
    </ui:soy>

    <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.form.form'">
        <ui:param name="'content'">
            <ww:if test="/currentTask/finished == true && /currentTask/userWhoStartedTask == false">
                <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.message.info'">
                    <ui:param name="'content'">
                        <p>
                            <ww:text name="'common.tasks.cant.acknowledge.task.you.didnt.start'">
                                <ww:param name="'value0'">
                                    <a href="<ww:property value="/currentTask/userURL"/>">
                                        <ww:property value="/currentTask/user/name"/></a>
                                </ww:param>
                            </ww:text>
                        </p>
                    </ui:param>
                </ui:soy>
            </ww:if>

            <div class="aui-group">
                <ww:property value="/currentTask">
                    <ww:if test="exceptionCause">
                        <div class="pb_section">
                            <span><ww:property value="exceptionCause/message"/></span>
                        </div>
                    </ww:if>
                    <ww:elseIf test="lastProgressEvent">
                        <div class="pb_section">
                            <ww:if test="lastProgressEvent/currentSubTask && /currentTask/finished == false">
                                <ww:property value="lastProgressEvent/currentSubTask"/><ww:if test="lastProgressEvent/message/size > 0"> - </ww:if>
                            </ww:if>
                            <ww:property value="lastProgressEvent/message"/>
                        </div>
                    </ww:elseIf>
                    <br/>

                    <div id="delete-project-progress" class="aui-progress-indicator" <ww:if test="/currentTask/finished == true">data-value="1"</ww:if>>
                        <span class="aui-progress-indicator-value"></span>
                        <span id="delete-project-progress-value" data-value="<ww:property value="progressNumber"/>"></span>
                    </div>

                    <div class="description">
                        <div class="pb_taskinfo ">
                            <span><ww:property value="formattedProgress"/></span>
                        </div>
                        <ww:if test="started == true">
                            <div class="pb_taskinfo">
                                <ww:if test="userWhoStartedTask == false">
                                <span>
                                    <ww:text name="'common.tasks.info.started.by'">
                                        <ww:param name="'value0'">
                                            <ww:property value="formattedStartedTimestamp"/>
                                        </ww:param>
                                        <ww:param name="'value1'">
                                            <a href="<ww:property value="userURL"/>"><ww:property value="userName"/></a>
                                        </ww:param>
                                    </ww:text>
                                </span>
                                </ww:if>
                                <ww:else>
                                <span><ww:text name="'common.tasks.info.started'">
                                    <ww:param name="'value0'"><ww:property value="formattedStartedTimestamp"/></ww:param>
                                </ww:text></span>
                                </ww:else>
                            </div>
                            <ww:if test="finished == true">
                                <div class="pb_taskinfo">
                                    <span>
                                        <ww:text name="'common.tasks.info.finished'">
                                            <ww:param name="'value0'"><ww:property value="formattedFinishedTimestamp"/></ww:param>
                                        </ww:text>
                                    </span>
                                </div>
                            </ww:if>
                            <ww:if test="formattedExceptionCause">
                                <div class="pb_taskexception">
                                    <pre><ww:property value="formattedExceptionCause"/></pre>
                                </div>
                            </ww:if>
                        </ww:if>
                    </div>
                </ww:property>
            </div>

            <ui:soy moduleKey="'com.atlassian.auiplugin:aui-experimental-soy-templates'" template="'aui.form.buttons'">
                <ui:param name="'content'">
                    <ww:if test="/currentTask/finished == true">
                        <ww:if test="/currentTask/userWhoStartedTask == true">
                            <button id="acknowledge-submit" class="aui-button" type="submit" name="acknowledge"><ww:text name="'common.words.acknowledge'"/></button>
                        </ww:if>
                        <ww:else>
                            <button id="done-submit" class="aui-button" type="submit" name="done"><ww:text name="'common.words.done'"/></button>
                        </ww:else>
                    </ww:if>
                    <ww:else>
                        <button id="refresh-submit" class="aui-button" type="submit" name="refresh"><ww:text name="'common.words.refresh'"/></button>
                    </ww:else>
                </ui:param>
            </ui:soy>

            <ui:component name="'taskId'" template="hidden.jsp"/>
            <ui:component name="'pid'" template="hidden.jsp"/>
            <ui:component name="'atl_token'" value="/xsrfToken" template="hidden.jsp" />
            <ui:component name="'destinationURL'" value="'/secure/project/ViewProjects.jspa'" template="hidden.jsp"/>
        </ui:param>

        <ww:if test="/currentTask/finished == true">
            <ui:param name="'action'">AcknowledgeTask.jspa</ui:param>
        </ww:if>
        <ww:else>
            <ui:param name="'action'">DeleteProjectProgress.jspa</ui:param>
        </ww:else>
        <ui:param name="'id'">project-delete-form</ui:param>
        <ui:param name="'method'">get</ui:param>
    </ui:soy>
</body>
</html>