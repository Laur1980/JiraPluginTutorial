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

import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.security.JiraAuthenticationContext;

import ro.etss.jira.plugin.tutorial.jira.workflow.CreateSubTaskForIssuePostFunction;

public class CreateSubTaskForIssuePostFunctionTest
{
    public static final String MESSAGE = "my message";

    private CreateSubTaskForIssuePostFunction function;
    private MutableIssue issue;
    private JiraAuthenticationContext jiraContext;
    @Before
    public void setup() {
        issue = mock(MutableIssue.class);
        jiraContext = mock(JiraAuthenticationContext.class);
        when(issue.getDescription()).thenReturn("");

        function = new CreateSubTaskForIssuePostFunction(jiraContext) {
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
