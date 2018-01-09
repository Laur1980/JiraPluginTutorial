<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<%@ taglib prefix="jira" uri="jiratags" %>
<html>
<head>
    <title><ww:text name="'admin.projects.details'"/></title>
    <jira:web-resource-require modules="jira.webresources:autocomplete"/>
    <meta name="decorator" content="admin">
    <meta name="projectKey" content='<ww:property value="/projectObject/key"/>'/>
    <meta name="admin.active.tab" content="edit_project"/>
    <meta name="admin.active.section" content="atl.jira.proj.config"/>
</head>
<body>

<fieldset class="hidden parameters">
    <input type="hidden" id="uploadImage" value="<ww:text name="'avatarpicker.upload.image'"/>">
</fieldset>

<page:applyDecorator id="project-edit" name="auiform">

    <page:param name="action">EditProject.jspa</page:param>

    <page:param
            name="cancelLinkURI"><%= request.getContextPath() %>/secure/project/EditProject!default.jspa?pid=<ww:property
            value="/projectObject/id"/></page:param>

    <aui:component template="formHeading.jsp" theme="'aui'">
        <aui:param name="'text'"><ww:text name="'admin.projects.details'"/></aui:param>
    </aui:component>

    <page:param name="submitButtonText"><ww:text name="'admin.projects.details.save'"/></page:param>
    <page:param name="submitButtonName">save_details</page:param>
    <page:param name="cssClass">js-edit-project-fields</page:param>

    <ww:bean name="'com.atlassian.jira.web.util.HelpUtil'" id="helpUtil"/>
    <div class="aui-group">
        <page:applyDecorator name="auifieldgroup">
            <aui:textfield label="/text('common.words.name')" name="'name'" size="'50'" maxlength="/maxNameLength"
                           mandatory="'true'" theme="'aui'"/>
        </page:applyDecorator>

        <ui:soy moduleKey="'jira.webresources:soy-templates'"
                template="'JIRA.Templates.EditProject.textFieldWithSubTemplate'">
            <ui:param name="'id'">project-edit-key</ui:param>
            <ui:param name="'name'">key</ui:param>
            <ui:param name="'isRequired'">true</ui:param>
            <ui:param name="'maxLength'"><ww:property value="/maxKeyLength" escape="false"/></ui:param>
            <ui:param name="'labelContent'"><ww:property value="/text('common.concepts.key')" escape="false"/></ui:param>
            <ui:param name="'value'"><ww:property value="/key" escape="false"/></ui:param>
            <ui:param name="'errorTexts'"><ww:property value="/errors['key']" escape="false"/></ui:param>
            <ui:param name="'isEditable'"><ww:property value="/projectKeyRenameAllowed" escape="false"/></ui:param>
            <ui:param name="'subTemplateHtml'">
                <a class="help-link" aria-controls="inline-project-key-help" data-aui-trigger id="project-key-help-trigger" href="#inline-project-key-help">
                    <span class="aui-icon aui-icon-small aui-iconfont-info project-edit-help-icon"></span>
                </a>
                <aui-inline-dialog id="inline-project-key-help" class="edit-project-help-bubble" alignment="bottom center">
                    <p>
                    <ww:property value="/text('admin.projects.edit.project.key.warning.message')" escape="false"/>
                    </p>
                    <p>
                        <a href="<ww:property value="@helpUtil/helpPath('editing_project_key')/url"/>">
                            <ww:text name="'admin.projects.edit.project.key.learn.more'"/>
                        </a>
                    </p>
                </aui-inline-dialog>
            </ui:param>

        </ui:soy>
        <input type="hidden" id="edit-project-original-key" name="originalKey"
               value="<ww:property value="/originalKey"/>"/>
        <input type="hidden" id="edit-project-key-edited" name="keyEdited"
               value="<ww:property value="/keyEdited"/>"/>

        <page:applyDecorator name="auifieldgroup">
            <aui:textfield label="/text('common.concepts.url')" name="'url'" size="'50'" maxlength="255"
                           theme="'aui'"/>
        </page:applyDecorator>

        <page:applyDecorator name="auifieldgroup">
            <page:param name="id">project-type-container</page:param>
            <label for="projectTypeKey">
                <ww:text name="'admin.projects.change.project.type.label'"/>
                <span class="aui-icon icon-required"><ww:text name="'common.icons.required'"/></span>
            </label>
            <select class="project-type-select select" name="projectTypeKey" id="projectTypeKey" <ww:if test="/projectTypeChangeAllowed == 'false'"> disabled="disabled" </ww:if> >
                <ww:iterator value="projectTypeOptions">
                    <option class="imagebacked"
                            data-icon="data:image/svg+xml;base64,<ww:text name="./icon"/>"
                            value="<ww:text name="./key/key"/>"
                            <ww:if test="/projectTypeKey == ./key/key">selected </ww:if> >
                        <ww:text name="./formattedKey"/>
                    </option>
                </ww:iterator>
            </select>
            <a class="help-link" aria-controls="project-type-help" data-aui-trigger id="project-type-help-trigger" href="#project-type-help">
                <span class="aui-icon aui-icon-small aui-iconfont-info project-edit-help-icon"></span>
            </a>
            <aui-inline-dialog id="project-type-help" class="edit-project-help-bubble" alignment="bottom center">
                <p>
                    <ww:text name="'admin.projects.edit.project.type.warning.message'"/>
                </p>
                <p>
                    <a href="<ww:property value="/projectTypeHelpUrl"/>">
                        <ww:text name="'admin.projects.change.project.type.differences'"/>
                    </a>
                </p>
            </aui-inline-dialog>
            <ww:if test="/errors['projectTypeKey']">
                <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'aui.form.fieldError'">
                    <ui:param name="'id'" value="'project-type-error'"/>
                    <ui:param name="'message'"><ww:property value="/errors['projectTypeKey']" escape="false"/></ui:param>
                </ui:soy>
            </ww:if>
        </page:applyDecorator>

        <!-- Project category dropdown -->
        <page:applyDecorator name="auifieldgroup">
            <page:param name="id">project-category-container</page:param>
            <label for="project-category-selector">
                <ww:text name="'portlet.projects.field.project.category.name'"/>
            </label>
            <select id="project-category-selector" class="select" name="projectCategoryId" property="projectCategoryId"
                    <ww:if test="/hasAdminPermission == false || projectCategories/size == 1">disabled</ww:if>>
                <ww:iterator value="/projectCategories">
                    <option value="<ww:property value="./id"/>"
                            <ww:if test="/projectCategoryId == ./id">selected</ww:if>>
                        <ww:property value="./name"/>
                    </option>
                </ww:iterator>
            </select>

            <a class="help-link" aria-controls="project-category-help" data-aui-trigger id="project-category-help-trigger" href="#project-category-help">
                <span class="aui-icon aui-icon-small aui-iconfont-info project-edit-help-icon"></span>
            </a>
            <aui-inline-dialog id="project-category-help" class="edit-project-help-bubble" alignment="bottom center">
                <ww:if test="/hasAdminPermission == false">
                    <p>
                        <ww:text name="'admin.projects.service.error.no.admin.permission.projectcategory'"/>
                    </p>
                </ww:if>
                <ww:else>
                    <ww:if test="projectCategories/size == 1">
                        <p>
                            <ww:text name="'admin.projects.no.categories.created'"/>
                        </p>
                    </ww:if>
                    <p>
                        <ww:text name="'admin.projects.add.new.project.category'">
                            <ww:param name="'value0'"><a href="<%= request.getContextPath() %>/secure/admin/projectcategories/ViewProjectCategories!default.jspa"></ww:param>
                            <ww:param name="'value1'"></a></ww:param>
                        </ww:text>
                    </p>
                </ww:else>
            </aui-inline-dialog>

            <ww:if test="/errors['projectCategoryId']">
                <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'aui.form.fieldError'">
                    <ui:param name="'id'" value="'project-category-selector-error'"/>
                    <ui:param name="'message'"><ww:property value="/errors['projectCategoryId']"  escape="false"/></ui:param>
                </ui:soy>
            </ww:if>
        </page:applyDecorator>

        <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Avatar.picker'">
            <ui:param name="'labelContent'"><ww:property
                    value="/text('common.concepts.project.avatar')"/></ui:param>
            <ui:param name="'defaultId'"><ww:property value="/defaultAvatar"/></ui:param>
            <ui:param name="'avatarId'"><ww:property value="/avatarId"/></ui:param>
            <ui:param name="'src'"><ww:property value="/avatarUrl"/></ui:param>
            <ui:param name="'size'">large</ui:param>
            <ui:param name="'isProject'">true</ui:param>
            <ui:param name="'title'"><ww:text name="'admin.projects.edit.avatar.click.to.edit'"/></ui:param>
            <ui:param name="'avatarOwnerId'"><ww:property value="/pid"/></ui:param>
            <ui:param name="'avatarOwnerKey'"><ww:property value="/originalKey"/></ui:param>
            <ui:param name="'mandatory'">true</ui:param>
            <ui:param name="'fieldId'">avatarId</ui:param>
            <ui:param name="'avatarType'">project</ui:param>
        </ui:soy>

        <page:applyDecorator name="auifieldgroup">
            <label><ww:text name="'common.words.description'"/></label>
            <ww:property value="/projectDescriptionEditHtml" escape="false"/>
        </page:applyDecorator>

        <aui:component name="'pid'" template="hidden.jsp" theme="'aui'"/>
        <aui:component name="'avatarId'" template="hidden.jsp" theme="'aui'"/>
    </div>

</page:applyDecorator>
<%-- Script to initialise the edit project details form --%>
<script type="application/javascript">
    require(['wrm/require', 'jquery'], function(wrmRequire, $) {
        wrmRequire(['wrc!jira.webresources:edit-project-details'], function() {
            var EditProjectDetails = require('jira/project/edit-project-details');
            new EditProjectDetails({
                el: $('#project-edit')
            });
        });
    });
</script>
</body>
</html>
