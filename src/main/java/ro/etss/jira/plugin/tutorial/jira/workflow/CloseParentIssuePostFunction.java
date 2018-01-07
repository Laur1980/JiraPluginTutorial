package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.bc.issue.IssueService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.config.ConstantsManager;
import com.atlassian.jira.config.SubTaskManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.IssueFieldConstants;
import com.atlassian.jira.issue.IssueInputParameters;
import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.issue.status.Status;
import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.workflow.JiraWorkflow;
import com.atlassian.jira.workflow.WorkflowManager;
import com.atlassian.jira.workflow.function.issue.AbstractJiraFunctionProvider;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.module.propertyset.PropertySet;
import com.opensymphony.workflow.WorkflowException;
import com.opensymphony.workflow.loader.ActionDescriptor;

/**
 * This is the post-function class that gets executed at the end of the transition.
 * Any parameters that were saved in your factory class will be available in the transientVars Map.
 */
@Scanned
public class CloseParentIssuePostFunction extends AbstractJiraFunctionProvider
{
    private static final Logger log = LoggerFactory.getLogger(CloseParentIssuePostFunction.class);
    @ComponentImport
    private final WorkflowManager workflowManager;
    @ComponentImport
    private final SubTaskManager subTaskManager;
    @ComponentImport
    private final JiraAuthenticationContext jiraContext;
    private final Status status;
    @ComponentImport
    private final ConstantsManager constantsManager;
    
    
    public CloseParentIssuePostFunction(WorkflowManager workflowManager, SubTaskManager subTaskManager,
			JiraAuthenticationContext jiraContext, ConstantsManager constantsManager) {
		this.workflowManager = workflowManager;
		this.subTaskManager = subTaskManager;
		this.jiraContext = jiraContext;
		this.constantsManager = constantsManager;
		this.status = constantsManager.getStatus(new Integer(IssueFieldConstants.CLOSED_STATUS_ID).toString());
	}



	public void execute(Map transientVars, Map args, PropertySet ps) throws WorkflowException
    {
       MutableIssue subTask = getIssue(transientVars);
       MutableIssue parent = ComponentAccessor.getIssueManager().getIssueObject(subTask.getParentId());
       
       if(parent == null || !areSubTasksClosed(parent, subTask))
    	   return;
       
       try {
    	   closeIssue(parent);
       }catch(com.atlassian.jira.workflow.WorkflowException e) {
    	   log.error("Error occured while closing the issue: "+parent);
    	   e.printStackTrace();
       }
    }

	private boolean areSubTasksClosed(Issue parent, Issue subTask) {
		Collection<Issue> issues = subTaskManager.getSubTaskObjects(parent);
	       Iterator<Issue> iterator = issues.iterator();
	       while(iterator.hasNext()) {
	    	   Issue associatedIssue = iterator.next();
	    	   if(!subTask.getKey().equals(associatedIssue.getKey())) {
	    		   if(IssueFieldConstants.CLOSED_STATUS_ID != Integer.parseInt(associatedIssue.getStatus().getId()))
	    			   return false;
	    	   }
	       }
	       return true;
	}

	private void closeIssue(Issue parent) {
		
		    Status currentStatus = parent.getStatus();
		    JiraWorkflow workflow = workflowManager.getWorkflow(parent);
		    List<ActionDescriptor> actions = workflow.getLinkedStep(currentStatus).getActions();
		    // look for the closed transition
		    ActionDescriptor closeAction = null;
		    for (ActionDescriptor descriptor : actions)
		    {
		        if (descriptor.getUnconditionalResult().getStatus().equals(currentStatus.getName()))
		        {
		            closeAction = descriptor;
		            break;
		        }
		    }
		    if (closeAction != null)
		    {
		        ApplicationUser currentUser =  jiraContext.getLoggedInUser();
		        IssueService issueService = ComponentAccessor.getIssueService();
		        IssueInputParameters parameters = issueService.newIssueInputParameters();
		        parameters.setRetainExistingValuesWhenParameterNotProvided(true);
		        IssueService.TransitionValidationResult validationResult =  
		                issueService.validateTransition(currentUser, parent.getId(), 
		                                                closeAction.getId(), parameters);
		        IssueService.IssueResult result = issueService.transition(currentUser, validationResult);
		    }
		
	}
}