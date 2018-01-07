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

import ro.etss.jira.plugin.tutorial.jira.workflow.ParentIssueBlockingCondition;

public class ParrentIssueBlockingConditionTest
{
    private static final String FIELD_WORD = "word";

    private ParentIssueBlockingCondition condition;
    private MutableIssue issue;

    @Before
    public void setup() {
        issue = mock(MutableIssue.class);
        condition = new ParentIssueBlockingCondition() {
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
