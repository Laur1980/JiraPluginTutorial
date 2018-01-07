package ro.etss.jira.plugin.tutorial.jira.workflow;

import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginFunctionFactory;
import com.atlassian.jira.util.collect.MapBuilder;
import com.atlassian.jira.workflow.JiraWorkflow;
import com.atlassian.jira.workflow.WorkflowManager;
import com.opensymphony.workflow.loader.*;
import webwork.action.ActionContext;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This is the factory class responsible for dealing with the UI for the post-function.
 * This is typically where you put default values into the velocity context and where you store user input.
 */

public class SetUserCFFunctionFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginFunctionFactory
{
    private final static String CURRENT_USER="Current User";
    private final static String USER_NAME="user";

    @Override
    protected void getVelocityParamsForInput(Map<String, Object> velocityParams) {
    	velocityParams.put(USER_NAME, CURRENT_USER);
    }

    @Override
    protected void getVelocityParamsForEdit(Map<String, Object> velocityParams, AbstractDescriptor descriptor) {
    	velocityParams.put(USER_NAME, getUserName(descriptor));
    }

    private String getUserName(AbstractDescriptor descriptor) {
		if(!(descriptor instanceof FunctionDescriptor)) {
			throw new IllegalArgumentException("The descriptor must be FunctionDescriptor type!");
		}
		FunctionDescriptor functionDescriptor = (FunctionDescriptor) descriptor;
		String user = (String)functionDescriptor.getArgs().get(USER_NAME);
		if(user!=null && user.trim().length()>0)
			return user;
		else
			return CURRENT_USER;
		
	}

	@Override
    protected void getVelocityParamsForView(Map<String, Object> velocityParams, AbstractDescriptor descriptor) {
		velocityParams.put(USER_NAME, getUserName(descriptor));     
    }

    public Map<String,?> getDescriptorParams(Map<String, Object> formParams) {
       if(formParams != null && formParams.containsKey(USER_NAME))
    	   return MapBuilder.build(USER_NAME, extractSingleParam(formParams, USER_NAME));
    	return MapBuilder.emptyMap(); 
    }
    

}