package ro.etss.jira.plugin.tutorial.jira.workflow;

import java.util.Map;
import java.util.StringTokenizer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.workflow.WorkflowFunctionUtils;
import com.atlassian.jira.workflow.condition.AbstractJiraCondition;
import com.opensymphony.module.propertyset.PropertySet;

public class ParentIssueBlockingCondition extends AbstractJiraCondition
{
    private static final Logger log = LoggerFactory.getLogger(ParentIssueBlockingCondition.class);

    private static final String STATUSES = "statuses";

    public boolean passesCondition(Map transientVars, Map args, PropertySet ps)
    {
       Issue subTask = (Issue) transientVars.get(WorkflowFunctionUtils.ORIGINAL_ISSUE_KEY);
       Issue parrentIssue = ComponentAccessor.getIssueManager().getIssueObject(subTask.getParentId());
       
       if(parrentIssue == null) 
    	   return false;
       
       String statuses = (String) args.get(STATUSES);
       StringTokenizer st = new StringTokenizer(statuses, ",");
       while(st.hasMoreTokens()) {
    	   String statusId = st.nextToken();
    	   if(parrentIssue.getStatus().getId().equals(statusId))
    		   return true;
       }
       return false;
    }
}
