package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.ModifiedValue;
import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.issue.fields.CustomField;
import com.atlassian.jira.issue.fields.layout.field.FieldLayoutItem;
import com.atlassian.jira.issue.util.DefaultIssueChangeHolder;
import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.user.util.UserManager;
import com.atlassian.jira.workflow.function.issue.AbstractJiraFunctionProvider;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.module.propertyset.PropertySet;
import com.opensymphony.workflow.WorkflowException;

/**
 * This is the post-function class that gets executed at the end of the transition.
 * Any parameters that were saved in your factory class will be available in the transientVars Map.
 */
@Scanned
public class SetUserCFFunction extends AbstractJiraFunctionProvider
{
    private static final Logger log = LoggerFactory.getLogger(SetUserCFFunction.class);
    private final JiraAuthenticationContext jiraAuthentificationContext;
    private final CustomFieldManager customFieldManager;
    private final UserManager userManager;	
       
    public SetUserCFFunction( @ComponentImport JiraAuthenticationContext jiraAuthentificationContext,
    		 @ComponentImport CustomFieldManager customFieldManager, @ComponentImport UserManager userManager) {
		this.jiraAuthentificationContext = jiraAuthentificationContext;
		this.customFieldManager = customFieldManager;
		this.userManager = userManager;
	}
    
	public void execute(Map transientVars, Map args, PropertySet ps) throws WorkflowException
    {
        MutableIssue issue = getIssue(transientVars);
        ApplicationUser user = null;
        log.info("User present: "+args.get("user"));
        if(args.get("user") != null) {
        	String userName = (String) args.get("user");
        	if(userName.equals("Current User")) {
        		//Set current user here
        		user = jiraAuthentificationContext.getLoggedInUser();
        	}else {
        		user = userManager.getUserByName(userName);
        	}
        }else {
        	//Set current user here
        	user = jiraAuthentificationContext.getLoggedInUser();
        }
        log.info("User: "+user.getDisplayName());
        //Setting the user value to the custom field
        CustomField cf = customFieldManager.getCustomFieldObjectByName("Test User");
        if(cf != null) {
        	setUserValue(issue,user,cf);
        }
        log.info("It is done!");
        
    }
	
	private void setUserValue(MutableIssue issue, ApplicationUser user, CustomField cf) {
		issue.setCustomFieldValue(cf, user);
		Map<String,ModifiedValue> modifiedFields = issue.getModifiedFields();
		FieldLayoutItem fieldLayoutItem = ComponentAccessor.getFieldLayoutManager().getFieldLayout(issue).getFieldLayoutItem(cf);
		DefaultIssueChangeHolder issueChangeHolder = new DefaultIssueChangeHolder();
		final ModifiedValue modifiedValue = (ModifiedValue) modifiedFields.get(user.getId());
		cf.updateValue(fieldLayoutItem, issue, modifiedValue, issueChangeHolder);
	}

}