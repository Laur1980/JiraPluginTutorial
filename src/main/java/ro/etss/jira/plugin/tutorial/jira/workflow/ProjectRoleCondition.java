package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.security.roles.ProjectRoleManager;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.util.collect.MapBuilder;
import com.atlassian.jira.workflow.condition.AbstractJiraCondition;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.module.propertyset.PropertySet;

@Scanned
public class ProjectRoleCondition extends AbstractJiraCondition
{
    private static final Logger log = LoggerFactory.getLogger(ProjectRoleCondition.class);
    private static final String ROLE ="role";
    public static final String FIELD_WORD = "word";
    @ComponentImport
    private final ProjectRoleManager projectRoleManager;
    
    public ProjectRoleCondition(ProjectRoleManager projectRoleManager) {
		this.projectRoleManager = projectRoleManager;
	}

	public boolean passesCondition(Map transientVars, Map args, PropertySet ps)
    {
        Issue issue = getIssue(transientVars);
        log.info("Retrieving the current issue: "+issue.getKey());
        ApplicationUser user = getCallerUser(transientVars, args);
        log.info("Retrieving the current loggedin user: "+user.getDisplayName());
        Project project = issue.getProjectObject();
        log.info("Retrieving the current project: "+project.getKey());
        String role = (String) args.get(ROLE);
        log.info("Retrieving the current project role: "+role);
        Long roleId = new Long(role);
        return projectRoleManager.isUserInProjectRole(user, projectRoleManager.getProjectRole(roleId), project);
    }
	
	
}
