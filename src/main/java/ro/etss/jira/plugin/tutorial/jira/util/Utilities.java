package ro.etss.jira.plugin.tutorial.jira.util;

public final class Utilities{
	
	private Utilities() {}
	
	public static boolean isNumber(String n) {
		for(char c: n.toCharArray()) {
			if(!Character.isDigit(c))
				return false;	
		}
		return true;
	}
	
}
