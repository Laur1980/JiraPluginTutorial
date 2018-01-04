package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.fields.CustomField;
import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginValidatorFactory;
import com.atlassian.jira.util.collect.MapBuilder;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.workflow.loader.AbstractDescriptor;
import com.opensymphony.workflow.loader.ValidatorDescriptor;

@Scanned
public class WorkFlowFieldValueValidatorFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginValidatorFactory
{

    private static final String FIELDS = "fields";
    private static final String FIELD_NAME ="field";
    private static final String NOT_DEFINE ="Not Defined";
    @ComponentImport
    private final CustomFieldManager customFieldManager;
    
    public WorkFlowFieldValueValidatorFactory(CustomFieldManager customFieldManager) {
		this.customFieldManager = customFieldManager;
	}

	protected void getVelocityParamsForInput(Map<String, Object> velocityParams)
    {
        velocityParams.put(FIELDS, getCFFields());
    }

    protected void getVelocityParamsForEdit(Map<String, Object> velocityParams, AbstractDescriptor descriptor)
    {
    	velocityParams.put(FIELD_NAME, getFieldName(descriptor));
    	velocityParams.put(FIELDS, getCFFields());
    }

    private Collection<CustomField> getCFFields() {
		Collection<CustomField> customFields = Collections.unmodifiableCollection(customFieldManager.getCustomFieldObjects());
		return customFields;
	}

	private String getFieldName(AbstractDescriptor descriptor) {
		 if (!(descriptor instanceof ValidatorDescriptor))  
	            throw new IllegalArgumentException("Descriptor must be a ValidatorDescriptor.");
		 ValidatorDescriptor validatorDescriptor = (ValidatorDescriptor) descriptor;
		 String field = (String) validatorDescriptor.getArgs().get(FIELD_NAME);
		return (field != null && field.trim().length()>0)?field:null;
	}

	protected void getVelocityParamsForView(Map<String, Object> velocityParams, AbstractDescriptor descriptor)
    {
        if (!(descriptor instanceof ValidatorDescriptor))
            throw new IllegalArgumentException("Descriptor must be a ValidatorDescriptor.");

        ValidatorDescriptor validatorDescriptor = (ValidatorDescriptor)descriptor;

        velocityParams.put(FIELD_NAME, getFieldName(descriptor));
    }

    public Map<String, String> getDescriptorParams(Map<String, Object> validatorParams)
    {	
    	if(validatorParams != null && validatorParams.containsKey(FIELD_NAME))
    		return MapBuilder.build(FIELD_NAME, extractSingleParam(validatorParams, FIELD_NAME));
        return MapBuilder.emptyMap();
    }
}
