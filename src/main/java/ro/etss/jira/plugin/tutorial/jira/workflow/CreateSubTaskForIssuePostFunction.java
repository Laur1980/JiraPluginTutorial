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
    private final static String COUNT_OF_SUBTASKS="countOfsubtasks";
    
    
    private final JiraAuthenticationContext jiraContext;
    @ComponentImport
    private final SubTaskManager subtaskManager;
    @ComponentImport
    private final IssueService issueService;
   
	public CreateSubTaskForIssuePostFunction(@ComponentImport JiraAuthenticationContext jiraContext, 
											 @ComponentImport SubTaskManager subtaskManager,
			                                 @ComponentImport IssueService issueService) {
		this.jiraContext = jiraContext;
		this.subtaskManager = subtaskManager;
		this.issueService = issueService;
	}

	public void execute(Map transientVars, Map args, PropertySet ps) throws WorkflowException
    {
		log.info("Inside PF CreateSubTaskForIssuePostFunction");
        MutableIssue parentIssue = getIssue(transientVars);
        Integer count = null;
        try {
        	count = Integer.parseInt((String)args.get(COUNT_OF_SUBTASKS));
        }catch(NumberFormatException e) {
        	log.error(e.getMessage());
        	throw new WorkflowException("This should be a numeric value! We have: "+(String)args.get(COUNT_OF_SUBTASKS));
        }
        
        if(count != null && count >0 ) {
        	for(int i=0;i<count;i++) {
        		createSubtask(parentIssue);
        	}
        }
    }

	private void createSubtask(MutableIssue parentIssue) {
		ConstantsManager constantsManager = ComponentAccessor.getConstantsManager();
        String issueTypeId = getIssueTypeId(constantsManager, "Sub-task");
        //PF stops for a closed issue or if it is a subtask or subtask issue type is non-existent
       if(IssueFieldConstants.CLOSED_STATUS_ID == Integer.parseInt(parentIssue.getStatus().getId()) || parentIssue.isSubTask()
          || issueTypeId == null) { 
        	log.error("Can not create subtask issue!");
        	return;
        } 
//      IssueFactory issueFactory = ComponentAccessor.getIssueFactory();
//	    IssueIndexingService indexing = (IssueIndexingService) ComponentAccessor.getComponent(IssueIndexingService.class);
       	
       	ApplicationUser user = jiraContext.getLoggedInUser();
//      SubTaskManager subtaskManager = ComponentAccessor.getSubTaskManager();  
//      IssueService issueService = ComponentAccessor.getIssueService();
        
        //Adding subtask input parameters
        IssueInputParameters subtaskInputParameters = issueService.newIssueInputParameters();
        subtaskInputParameters.setReporterId(parentIssue.getReporterId());
        subtaskInputParameters.setSummary("SubTask issue created for parent issue "+parentIssue.getSummary());
        subtaskInputParameters.setIssueTypeId(issueTypeId);
        subtaskInputParameters.setProjectId(parentIssue.getProjectId());
        
        CreateValidationResult validationResult = issueService.validateSubTaskCreate(user, parentIssue.getId(),subtaskInputParameters);
        if(!validationResult.isValid()) {        	
        	addErrorsToLog(validationResult.getErrorCollection().getErrorMessages());
        	return;
        }
       
        IssueResult issueResult = issueService.create(user,validationResult);
        if(!issueResult.isValid()) {
        	addErrorsToLog(issueResult.getErrorCollection().getErrorMessages());
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
        log.info("SubTask "+subTask+" finalized for current issue: "+parentIssue);
	}
	
	private void addErrorsToLog(Collection<String> errors) {
		errors.forEach(m -> log.error("Error creating parameters for subtask: "+m));
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