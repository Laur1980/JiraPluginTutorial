package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginFunctionFactory;
import com.atlassian.jira.util.collect.MapBuilder;
import com.atlassian.jira.workflow.JiraWorkflow;
import com.atlassian.jira.workflow.WorkflowManager;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.workflow.loader.AbstractDescriptor;
import com.opensymphony.workflow.loader.FunctionDescriptor;

import ro.etss.jira.plugin.tutorial.jira.util.Utilities;
import webwork.action.ActionContext;

/**
 * This is the factory class responsible for dealing with the UI for the post-function.
 * This is typically where you put default values into the velocity context and where you store user input.
 */
@Scanned
public class CreateSubTaskForIssuePostFunctionFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginFunctionFactory{
	
	private static final Logger log = LoggerFactory.getLogger(CreateSubTaskForIssuePostFunctionFactory.class);
	private final static String COUNT_OF_SUBTASKS="countOfsubtasks";
	private final static String DEFAULT_COUNT="1";
	
	private final WorkflowManager workflowManager;
		
	public CreateSubTaskForIssuePostFunctionFactory(@ComponentImport WorkflowManager workflowManager) {
		this.workflowManager= workflowManager;
	}
	
	@Override
	protected void getVelocityParamsForEdit(Map<String, Object> velocityParams, AbstractDescriptor abstractDescriptor) {
		getVelocityParamsForInput(velocityParams);	
		getVelocityParamsForView(velocityParams,abstractDescriptor);
	}

	@Override
	protected void getVelocityParamsForInput(Map<String, Object> velocityParams) {     
		velocityParams.put(COUNT_OF_SUBTASKS, DEFAULT_COUNT);
	}

	@Override
	protected void getVelocityParamsForView(Map<String, Object> velocityParams, AbstractDescriptor abstractDescriptor) {
			velocityParams.put(COUNT_OF_SUBTASKS, getCount(abstractDescriptor));		
	}
	
	private String getCount(AbstractDescriptor abstractDescriptor) {
		if(!(abstractDescriptor instanceof FunctionDescriptor)) {
			throw new IllegalArgumentException("Descriptor must be a FunctionDescriptor!");
		}
		FunctionDescriptor functionDescriptor = (FunctionDescriptor) abstractDescriptor;
		String numberOfSubtasks = (String) functionDescriptor.getArgs().get(COUNT_OF_SUBTASKS);
		return (numberOfSubtasks != null && 
				numberOfSubtasks.trim().length()>0 &&
				Utilities.isNumber(numberOfSubtasks) && 
				Integer.parseInt(numberOfSubtasks)>0)?numberOfSubtasks.trim():DEFAULT_COUNT;
	}
	 
	public Map<String, ?> getDescriptorParams(Map<String, Object> formParams) {
		if(formParams != null && formParams.containsKey(COUNT_OF_SUBTASKS)) {
			return MapBuilder.build(COUNT_OF_SUBTASKS, extractSingleParam(formParams, COUNT_OF_SUBTASKS));
		}
		return MapBuilder.emptyMap();
	}

}