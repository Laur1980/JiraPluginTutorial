package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Collection;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.bc.issue.IssueService;
import com.atlassian.jira.bc.issue.IssueService.CreateValidationResult;
import com.atlassian.jira.bc.issue.IssueService.IssueResult;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.config.ConstantsManager;
import com.atlassian.jira.config.SubTaskManager;
import com.atlassian.jira.exception.CreateException;
import com.atlassian.jira.issue.IssueFactory;
import com.atlassian.jira.issue.IssueFieldConstants;
import com.atlassian.jira.issue.IssueInputParameters;
import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.issue.index.IndexException;
import com.atlassian.jira.issue.index.IssueIndexingService;
import com.atlassian.jira.issue.issuetype.IssueType;
import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.user.ApplicationUser;
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
public class CreateSubTaskForIssuePostFunction extends AbstractJiraFunctionProvider
{
    private static final Logger log = LoggerFactory.getLogger(CreateSubTaskForIssuePostFunction.class);
    @ComponentImport
    private final JiraAuthenticationContext jiraContext;
   
	public CreateSubTaskForIssuePostFunction(JiraAuthenticationContext jiraContext) {
		this.jiraContext = jiraContext;
	}

	public void execute(Map transientVars, Map args, PropertySet ps) throws WorkflowException
    {
		log.info("Inside PF CreateSubTaskForIssuePostFunction");
        MutableIssue parentIssue = getIssue(transientVars);
        ConstantsManager constantsManager = ComponentAccessor.getConstantsManager();
        String issueTypeId = getIssueTypeId(constantsManager, "Sub-task");
        //PF stops for a closed issue or if it is a subtask or subtask issue type is non-existent
       if(IssueFieldConstants.CLOSED_STATUS_ID == Integer.parseInt(parentIssue.getStatus().getId()) || parentIssue.isSubTask()
          || issueTypeId == null) { 
        	log.error("Can not create subtask issue!");
        	return;
        } 
       	ApplicationUser user = jiraContext.getLoggedInUser();
        SubTaskManager subtaskManager = ComponentAccessor.getSubTaskManager();
        IssueFactory issueFactory = ComponentAccessor.getIssueFactory();
        IssueService issueService = ComponentAccessor.getIssueService();
        //IssueIndexingService indexing = (IssueIndexingService) ComponentAccessor.getComponent(IssueIndexingService.class);
        //Adding subtask input parameters
        IssueInputParameters subtaskInputParameters = issueService.newIssueInputParameters();
        subtaskInputParameters.setReporterId(parentIssue.getReporterId());
        subtaskInputParameters.setSummary("SubTask issue created for parent issue "+parentIssue.getSummary());
        subtaskInputParameters.setIssueTypeId(issueTypeId);
        subtaskInputParameters.setProjectId(parentIssue.getProjectId());
        CreateValidationResult validationResult = issueService.validateSubTaskCreate(user, parentIssue.getId(),subtaskInputParameters);
        if(!validationResult.isValid()) {        	
        	addErrorsToLog(validationResult);
        	return;
        }
       
        IssueResult issueResult = issueService.create(user,validationResult);
        if(!issueResult.isValid()) {
        	addErrorsToLog(issueResult);
        	return;
        }
        
        MutableIssue subTask = issueResult.getIssue();
        try {
        	//indexing.reIndex(subTask);
			subtaskManager.createSubTaskIssueLink(parentIssue, subTask, user);
		} catch (CreateException e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}
        /*
		}catch(IndexException e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}
		*/
        log.info("SubTask finalized for current issue: "+subTask);
    }
	
	private void addErrorsToLog(CreateValidationResult validationResult) {
		Collection<String> errors = validationResult.getErrorCollection().getErrorMessages();
		errors.forEach(m -> log.error("Error creating parameters for subtask: "+m));
	}
	
	private void addErrorsToLog(IssueResult issueResult) {
		Collection<String> errors = issueResult.getErrorCollection().getErrorMessages();
		errors.forEach(m -> log.error("Error creating IssueResult object for subtask: "+m));
	}
	
	private String getIssueTypeId(ConstantsManager constantsManager, String issueName) {
		Collection<IssueType> issueTypes = constantsManager.getAllIssueTypeObjects();
		for(IssueType it: issueTypes) {
			if(it.getName().equals(issueName)) {
				return it.getId();
			}
		}
		return null;
	}
	
}