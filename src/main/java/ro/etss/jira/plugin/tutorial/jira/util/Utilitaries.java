package ro.etss.jira.plugin.tutorial.jira.util;

public final class Utilitaries {
	
	private Utilitaries() {}
	
	public static boolean isNumber(String n) {
		for(char c: n.toCharArray()) {
			if(!Character.isDigit(c))
				return false;	
		}
		return true;
	}
	
}
