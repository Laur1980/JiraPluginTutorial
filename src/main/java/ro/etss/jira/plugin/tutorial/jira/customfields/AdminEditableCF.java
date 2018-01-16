package ro.etss.jira.plugin.tutorial.jira.customfields;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.customfields.impl.GenericTextCFType;
import com.atlassian.jira.issue.customfields.manager.GenericConfigManager;
import com.atlassian.jira.issue.customfields.persistence.CustomFieldValuePersister;
import com.atlassian.jira.issue.fields.CustomField;
import com.atlassian.jira.issue.fields.TextFieldCharacterLengthValidator;
import com.atlassian.jira.issue.fields.layout.field.FieldLayoutItem;
import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.security.roles.ProjectRole;
import com.atlassian.jira.security.roles.ProjectRoleManager;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
@Scanned
public class AdminEditableCF extends GenericTextCFType {
    
	private static final Logger log = LoggerFactory.getLogger(AdminEditableCF.class);
	
	private final JiraAuthenticationContext jiraAuthenticationContext;
	private final ProjectRoleManager projectRoleManager;
	
    public AdminEditableCF(@ComponentImport CustomFieldValuePersister customFieldValuePersister, 
    					   @ComponentImport GenericConfigManager genericConfigManager, 
    					   @ComponentImport TextFieldCharacterLengthValidator textFieldCharacterLengthValidator, 
    					   @ComponentImport JiraAuthenticationContext jiraAuthenticationContext,
    					   @ComponentImport ProjectRoleManager projectRoleManager) {
    	super(customFieldValuePersister, genericConfigManager, textFieldCharacterLengthValidator, jiraAuthenticationContext);
    	 this.jiraAuthenticationContext = jiraAuthenticationContext;
    	 this.projectRoleManager = projectRoleManager;
    }

	@Override
	public Map<String, Object> getVelocityParameters(Issue issue, CustomField field, FieldLayoutItem fieldLayoutItem) {
		 Map<String, Object> velocityParams = super.getVelocityParameters(issue, field, fieldLayoutItem);
		 ApplicationUser user = jiraAuthenticationContext.getLoggedInUser();
		 ProjectRole currentUserProjectRole = ((List<ProjectRole>)projectRoleManager.getProjectRoles(user, issue.getProjectObject())).get(0);
		 velocityParams.put("currentUserProjectRole", currentUserProjectRole.getName());
		 velocityParams.put("userName", currentUserProjectRole.getName());
		 return velocityParams;
	}
    
    
   
}