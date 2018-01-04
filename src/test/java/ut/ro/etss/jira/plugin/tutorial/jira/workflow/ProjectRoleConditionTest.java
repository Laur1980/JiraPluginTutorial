package ut.ro.etss.jira.plugin.tutorial.jira.workflow;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.atlassian.jira.issue.MutableIssue;
import com.atlassian.jira.security.roles.ProjectRoleManager;

import ro.etss.jira.plugin.tutorial.jira.workflow.ProjectRoleCondition;

public class ProjectRoleConditionTest
{
    public static final String FIELD_WORD = "word";

    protected ProjectRoleCondition condition;
    protected MutableIssue issue;

    private ProjectRoleManager projectRoleManager;
    
    @Before
    public void setup() {
        issue = mock(MutableIssue.class);
        projectRoleManager = mock(ProjectRoleManager.class);
        condition = new ProjectRoleCondition(projectRoleManager) {
            protected MutableIssue getIssue(Map transientVars) {
                return issue;
            }
        };
    }
    
    @Ignore
    @Test
    public void testPassesCondition() throws Exception
    {
        Map transientVars = new HashMap();
        transientVars.put(FIELD_WORD, "test");
        when(issue.getDescription()).thenReturn("This description has test in it.");

        boolean result = condition.passesCondition(transientVars, null, null);

        assertTrue("condition should pass", result);
    }
    
    @Ignore
    @Test
    public void testFailsCondition() throws Exception
    {
        Map transientVars = new HashMap();
        transientVars.put(FIELD_WORD, "test");
        when(issue.getDescription()).thenReturn("This description does not have the magic word in it.");

        boolean result = condition.passesCondition(transientVars, null, null);

        assertFalse("condition should fail", result);
    }

}
