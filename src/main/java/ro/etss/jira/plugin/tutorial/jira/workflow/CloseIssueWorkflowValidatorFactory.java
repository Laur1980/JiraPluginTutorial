package ro.etss.jira.plugin.tutorial.jira.workflow;

import com.opensymphony.workflow.loader.AbstractDescriptor;
import com.opensymphony.workflow.loader.ValidatorDescriptor;
import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginValidatorFactory;
import com.atlassian.jira.util.collect.MapBuilder;

import java.util.HashMap;
import java.util.Map;

public class CloseIssueWorkflowValidatorFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginValidatorFactory
{
    public static final String FIELD_WORD="word";

    protected void getVelocityParamsForInput(Map<String,Object> velocityParams){}

    protected void getVelocityParamsForEdit(Map<String,Object> velocityParams, AbstractDescriptor descriptor){}

    protected void getVelocityParamsForView(Map<String,Object> velocityParams, AbstractDescriptor descriptor){}

    public Map<String,?> getDescriptorParams(Map<String,Object> validatorParams)
    {
        return MapBuilder.emptyMap();
    }
}
