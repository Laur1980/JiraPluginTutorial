package ut.ro.etss.jira.plugin.tutorial.jira.workflow;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.atlassian.jira.config.ConstantsManager;
import com.atlassian.jira.config.SubTaskManager;
import com.atlassian.jira.issue.IssueFieldConstants;
import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.issue.status.Status;
import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.workflow.WorkflowManager;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;

import ro.etss.jira.plugin.tutorial.jira.workflow.CloseParentIssuePostFunction;

public class CloseParentIssuePostFunctionTest
{
	private static final String MESSAGE = "my message";

    private CloseParentIssuePostFunction function;
    private MutableIssue issue;
    private  WorkflowManager workflowManager;
    private  SubTaskManager subTaskManager;
    private  JiraAuthenticationContext jiraContext;
    private  Status status;
    private  ConstantsManager constantsManager;
    @Before
    public void setup() {
        issue = mock(MutableIssue.class);
        workflowManager = mock(WorkflowManager.class);
        subTaskManager = mock(SubTaskManager.class);
        jiraContext = mock(JiraAuthenticationContext.class);
        constantsManager = mock(ConstantsManager.class);
        status = constantsManager.getStatus(new Integer(IssueFieldConstants.CLOSED_STATUS_ID).toString());
        when(issue.getDescription()).thenReturn("");

        function = new CloseParentIssuePostFunction(workflowManager, subTaskManager, jiraContext, constantsManager) {
            protected MutableIssue getIssue(Map transientVars) {
                return issue;
            }
        };
    }
    @Ignore
    @Test
    public void testNullMessage() throws Exception
    {
        Map transientVars = Collections.emptyMap();
        function.execute(transientVars, null, null);

        verify(issue).setDescription("");
    }
    @Ignore
    @Test
    public void testEmptyMessage() throws Exception
    {
        Map transientVars = new HashMap();
        transientVars.put("messageField", "");
        function.execute(transientVars, null, null);

        verify(issue).setDescription("");
    }
    @Ignore
    @Test
    public void testValidMessage() throws Exception
    {
        Map transientVars = new HashMap();
        transientVars.put("messageField", MESSAGE);
        function.execute(transientVars, null, null);

        verify(issue).setDescription(MESSAGE);
    }

}
