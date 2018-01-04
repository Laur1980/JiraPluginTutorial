package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.module.propertyset.PropertySet;
import com.opensymphony.workflow.InvalidInputException;
import com.opensymphony.workflow.Validator;
@Scanned
public class WorkFlowFieldValueValidator implements Validator
{
    private static final Logger log = LoggerFactory.getLogger(WorkFlowFieldValueValidator.class);
    private static final String FIELDS = "fields";
    private static final String FIELD_NAME ="field";
    @ComponentImport
    private final CustomFieldManager customFieldManager;
    
    public WorkFlowFieldValueValidator(CustomFieldManager customFieldManager) {
		this.customFieldManager = customFieldManager;
	}

	public void validate(Map transientVars, Map args, PropertySet ps) throws InvalidInputException
    {
		
        Issue issue = (Issue)transientVars.get("issue");
        String description = issue.getDescription();
        String field = (String) args.get(FIELD_NAME);
        List<CustomField> customFields = (List<CustomField>) customFieldManager.getCustomFieldObjectsByName(field);
        
        if(customFields!=null && !customFields.isEmpty()) {
        	CustomField customField = customFields.get(0);
        	if(issue.getCustomFieldValue(customField) == null ) {
        		throw new InvalidInputException("The field: "+field+" is required!");
        	}
        }
    }
}
