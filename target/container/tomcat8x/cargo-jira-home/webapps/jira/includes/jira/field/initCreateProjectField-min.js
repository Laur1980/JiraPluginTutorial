define("jira/field/init-create-project-field",["jira/field/create-project-field","jira/util/events","jira/util/events/types","jira/util/events/reasons","jquery"],function(e,i,t,n,r){i.bind(t.NEW_CONTENT_ADDED,function(i,t,a){a!==n.panelRefreshed&&t.find("#add-project-fields").each(function(){new e({element:r(this)})})})});