package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Map;

import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginFunctionFactory;
import com.atlassian.jira.util.collect.MapBuilder;
import com.opensymphony.workflow.loader.AbstractDescriptor;
import com.opensymphony.workflow.loader.FunctionDescriptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This is the factory class responsible for dealing with the UI for the post-function.
 * This is typically where you put default values into the velocity context and where you store user input.
 */
public class CreateSubTaskForIssuePostFunctionFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginFunctionFactory{
	private static final Logger log = LoggerFactory.getLogger(CreateSubTaskForIssuePostFunctionFactory.class);
	private final static String COUNT="count";
	private final static String DEFAULT_COUNT="1";
		
	@Override
	protected void getVelocityParamsForEdit(Map<String, Object> velocityParams, AbstractDescriptor abstractDescriptor) {
		getVelocityParamsForInput(velocityParams);	
		getVelocityParamsForView(velocityParams,abstractDescriptor);
	}

	@Override
	protected void getVelocityParamsForInput(Map<String, Object> velocityParams) {
		velocityParams.put(COUNT, DEFAULT_COUNT);
	}

	@Override
	protected void getVelocityParamsForView(Map<String, Object> velocityParams, AbstractDescriptor abstractDescriptor) {
			velocityParams.put(COUNT, getCount(abstractDescriptor));		
	}
	
	private String getCount(AbstractDescriptor abstractDescriptor) {
		if(!(abstractDescriptor instanceof FunctionDescriptor)) {
			throw new IllegalArgumentException("Descriotor must be a FunctionDescriptor!");
		}
		FunctionDescriptor functionDescriptor = (FunctionDescriptor) abstractDescriptor;
		String numberOfSubtasks = (String) functionDescriptor.getArgs().get(COUNT);
		if (numberOfSubtasks == null)log.error("Something is wrong! Count is: "+numberOfSubtasks);
		return (numberOfSubtasks != null && numberOfSubtasks.trim().length()>0)?numberOfSubtasks:DEFAULT_COUNT;
	}
	 
	public Map<String, ?> getDescriptorParams(Map<String, Object> formParams) {
		if(formParams != null && formParams.containsKey(COUNT)) {
			return MapBuilder.build(COUNT, extractSingleParam(formParams, COUNT));
		}
		return MapBuilder.emptyMap();
	}

}