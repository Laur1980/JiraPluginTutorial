package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import com.atlassian.jira.config.ConstantsManager;
import com.atlassian.jira.issue.comparator.ConstantsComparator;
import com.atlassian.jira.issue.status.Status;
import com.atlassian.jira.plugin.workflow.AbstractWorkflowPluginFactory;
import com.atlassian.jira.plugin.workflow.WorkflowPluginConditionFactory;
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
public class ParentIssueBlockingConditionFactory extends AbstractWorkflowPluginFactory implements WorkflowPluginConditionFactory
{
	@ComponentImport
    private final ConstantsManager constantsManager;
	private static final String STATUSES="statuses";
    
    public ParentIssueBlockingConditionFactory(ConstantsManager constantsManager) {
		this.constantsManager = constantsManager;
	}

	protected void getVelocityParamsForInput(Map<String,Object> velocityParams)
    {
        velocityParams.put(STATUSES, getStatuses());
    }

    private Collection<Status> getStatuses() {
		Collection<Status> statuses = Collections.unmodifiableCollection(constantsManager.getStatuses());
		return statuses;
	}

	protected void getVelocityParamsForEdit(Map<String,Object> velocityParams, AbstractDescriptor descriptor)
    {
        getVelocityParamsForInput(velocityParams);
        getVelocityParamsForView(velocityParams, descriptor);
    }

    protected void getVelocityParamsForView(Map<String,Object> velocityParams, AbstractDescriptor descriptor)
    {
       
        Collection<String> selectedStatusIds = getSelectedStatusIds(descriptor);
        Iterator<String> iterator = selectedStatusIds.iterator();
        List<Status> selectedStatuses = new LinkedList<>(); 
        while(iterator.hasNext()) {
        	String tempStatusId = iterator.next();
        	Status selectedStatus = constantsManager.getStatusObject(tempStatusId);
        	if(selectedStatus !=null) {
        		selectedStatuses.add(selectedStatus);
        	}
        }
        Collections.sort(selectedStatuses,new ConstantsComparator());
        velocityParams.put(STATUSES, Collections.unmodifiableCollection(selectedStatuses));
    }
    
   private Collection<String> getSelectedStatusIds(AbstractDescriptor abstractDescriptor){
	   if(!(abstractDescriptor instanceof ConditionDescriptor)) {
		   throw new IllegalArgumentException("The descriptor must be a ConditionDescriptor!");
	   }
	   ConditionDescriptor conditionDescriptor = (ConditionDescriptor) abstractDescriptor;
	   Collection<String> selectedStatusIds = new LinkedList<>();
	   String statuses = (String) conditionDescriptor.getArgs().get(STATUSES);
	   StringTokenizer st = new StringTokenizer(statuses, ",");
	   while(st.hasMoreTokens()) {
		   selectedStatusIds.add(st.nextToken());
	   }
	   return selectedStatusIds;
   }

    public Map<String,String> getDescriptorParams(Map<String,Object> conditioningParams)
    {	
    	if(conditioningParams != null && conditioningParams.containsKey(STATUSES)) {
    		
	    		StringBuilder statusIds = new StringBuilder();
	    		Iterator<String> iterator = conditioningParams.keySet().iterator();
	    		while(iterator.hasNext()) {
	    			statusIds.append(iterator.next());
	    			statusIds.append(",");
	    		}
    		
    		return MapBuilder.build(STATUSES, statusIds.substring(0, statusIds.length()-1));
    	}
        return MapBuilder.emptyMap();
    }
}
