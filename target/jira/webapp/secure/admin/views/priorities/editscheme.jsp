<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<html>
<head>
    <meta name="admin.active.section" content="admin_issues_menu/priorities_section"/>
    <meta name="admin.active.tab" content="priority_schemes"/>
    <jira:web-resource-require modules="jira.webresources:priority-administration"/>
    <title><ww:text name="'admin.schemes.priority.edit.priority.scheme'"/></title>
</head>
<body>

<page:applyDecorator id="edit-priority-scheme" name="auiform">
    <page:param name="action">EditPriorityScheme.jspa</page:param>
    <page:param name="method">post</page:param>
    <page:param name="submitButtonText"><ww:text name="'common.forms.edit'"/></page:param>
    <page:param name="submitButtonName"><ww:text name="'common.forms.edit'"/></page:param>
    <page:param name="cancelLinkURI">ViewPrioritySchemes.jspa</page:param>

    <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'mainContent'">
            <h2><ww:text name="'admin.schemes.priority.edit.priority.scheme'"/></h2>
        </ui:param>
    </ui:soy>

<pre style="background: #464646; color: #cbcbcb;">
      ,{
      '_}
   ;._'.             .-'
   (             \-./ ;.-;
    ; _      |'--,| `  '< ___,
      __)     \`-.__.   /`.-'/
    {;         `/o(o \ | / ,'
      ;  _  __.-'-'`-'  \'`
      ' (-,`  .-.     _ -.          _.-.
         /     _))  _/    |        <   `.
        |         /-.   -'        <|      \
         \ _.'"-'`   |  /-.       _;   \   \
          '         /-. |/_       \|   |`.  ;
                  /   \ \ /       \;   ;  `. \
                .;     | `.-'     <|   ;    `-.
               / |._   /   \|--.  _|    ;
             /`_/  -7  |    `\/--.\;    ;
            |   _,/'`  _\   | `./.-|     |
            \_./     /`  __/ _ _\|/      ;
            / |     //||/ ,'`   `:-.     ;
           ; ;      `' "'/        `.`.    |
           | |          |           \     |
           \  \         ;            ;   ;
            `. `.        \      .    |  /
       __.--'"`.-'"--.____`. _   \    .'
______(_(_____/   _         `"`   `.-'
              '-/`  .-'     _____.._)mx ____
</pre>
</page:applyDecorator>

</body>
</html>
