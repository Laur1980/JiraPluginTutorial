package ut.ro.etss.jira.plugin.tutorial.main;

import org.junit.Test;
import ro.etss.jira.plugin.tutorial.main.api.MyPluginComponent;
import ro.etss.jira.plugin.tutorial.main.impl.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest
{
    @Test
    public void testMyName()
    {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent",component.getName());
    }
}