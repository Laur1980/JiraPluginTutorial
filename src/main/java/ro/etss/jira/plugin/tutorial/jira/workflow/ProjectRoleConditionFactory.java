package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginConditionFactory;
import com.atlassian.jira.security.roles.ProjectRole;
import com.atlassian.jira.security.roles.ProjectRoleManager;
import com.atlassian.jira.util.collect.MapBuilder;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.opensymphony.workflow.loader.AbstractDescriptor;
import com.opensymphony.workflow.loader.ConditionDescriptor;

/**
 * This is the factory class responsible for dealing with the UI for the post-function.
 * This is typically where you put default values into the velocity context and where you store user input.
 */
@Scanned
public class ProjectRoleConditionFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginConditionFactory
{

    private static final String ROLE = "role";
    private static final String ROLES = "roles";
    @ComponentImport
    private final ProjectRoleManager projectRoleManager;
    
    public ProjectRoleConditionFactory(ProjectRoleManager projectRoleManager) {
		this.projectRoleManager = projectRoleManager;
	}

	protected void getVelocityParamsForInput(Map<String,Object> velocityParams)
    {
        //the default message
    	velocityParams.put(ROLES, getProjectRoles());
    }

    protected void getVelocityParamsForEdit(Map<String,Object> velocityParams, AbstractDescriptor descriptor)
    {
    	velocityParams.put(ROLE, getRole(descriptor));
    	velocityParams.put(ROLES, getProjectRoles());
    }

    private Collection<ProjectRole> getProjectRoles() {
		
    	Collection<ProjectRole> projectRoles = Collections.unmodifiableCollection(projectRoleManager.getProjectRoles());
    	
		return projectRoles;
	}

	private ProjectRole getRole(AbstractDescriptor descriptor) {
		if (!(descriptor instanceof ConditionDescriptor))
            throw new IllegalArgumentException("Descriptor must be a ConditionDescriptor.");
		ConditionDescriptor functionDescriptor = (ConditionDescriptor) descriptor;
		String role = (String) functionDescriptor.getArgs().get(ROLE);
		if(role != null && role.trim().length()>0)
			return getProjectRole(role);
		else 
			return null;
	}

	private ProjectRole getProjectRole(String role2) {
		ProjectRole projectRole = projectRoleManager.getProjectRole(role2);
		return projectRole;
	}

	protected void getVelocityParamsForView(Map velocityParams, AbstractDescriptor descriptor)
    {
        if (!(descriptor instanceof ConditionDescriptor))
            throw new IllegalArgumentException("Descriptor must be a ConditionDescriptor.");

        velocityParams.put(ROLE, getRole(descriptor));
    }

    public Map<String, String> getDescriptorParams(Map<String, Object> conditionParams)
    {
        if(conditionParams!=null && conditionParams.containsKey(ROLE)) 
        	MapBuilder.build(ROLE, extractSingleParam(conditionParams,ROLE));
        return MapBuilder.emptyMap();
    }
    
    
}
