package ro.etss.jira.plugin.tutorial.jira.condition;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.config.util.JiraHome;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.plugin.webfragment.conditions.AbstractIssueWebCondition;
import com.atlassian.jira.plugin.webfragment.model.JiraHelper;
import com.atlassian.jira.user.ApplicationUser;

public class ShouldDisplaySubtaskOperations extends AbstractIssueWebCondition {
	
	private static final Logger log = LoggerFactory.getLogger(ShouldDisplaySubtaskOperations.class);
	
	@Override
	public boolean shouldDisplay(ApplicationUser user, Issue issue, JiraHelper jiraHelper) {
		String issueStatus = issue.getStatus().getName();
		log.warn("\n\n current issue status: "+issueStatus+"\n\n");
		return getStatuses().contains(issueStatus);
	}

	private Set<String> getStatuses(){
		File jiraHome = ComponentAccessor.getComponent(JiraHome.class).getHome();
		File propertyFile = new File(jiraHome,"subtask-workflow-statuses.properties");
		Set<String> statuses = null;
		try {
			FileInputStream fileInputStream = new FileInputStream(propertyFile);
			Properties p = new Properties();
			p.load(fileInputStream);
			log.warn("\n\n Values from properties file: "+p.getProperty("statuses")+"\n\n");
			String [] statusesArray = p.getProperty("statuses").split(",");
			statuses = new HashSet(Arrays.asList(statusesArray));
		}catch(FileNotFoundException e) {
			log.error(e.getMessage());
		} catch (IOException e) {
			log.error(e.getMessage());
		}
 
		return statuses == null?new HashSet<>():statuses;
	}

}
