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

import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.user.util.UserManager;

import ro.etss.jira.plugin.tutorial.jira.workflow.SetUserCFFunction;

public class SetUserCFFunctionTest
{
    public static final String MESSAGE = "my message";

    protected SetUserCFFunction function;
    protected MutableIssue issue;
    private JiraAuthenticationContext jiraAuthentificationContext;
    private CustomFieldManager customFieldManager;
    private UserManager userManager;	 

    @Before
    public void setup() {
        issue = mock(MutableIssue.class);
        jiraAuthentificationContext = mock(JiraAuthenticationContext.class);
        customFieldManager = mock(CustomFieldManager.class);
        userManager = mock(UserManager.class);
        when(issue.getDescription()).thenReturn("");

        function = new SetUserCFFunction(jiraAuthentificationContext,customFieldManager,userManager) {
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
