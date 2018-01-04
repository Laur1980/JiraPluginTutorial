package ro.etss.jira.plugin.tutorial.jira.customfields;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.jira.issue.customfields.impl.AbstractSingleFieldType;
import com.atlassian.jira.issue.customfields.impl.FieldValidationException;
import com.atlassian.jira.issue.customfields.manager.GenericConfigManager;
import com.atlassian.jira.issue.customfields.persistence.CustomFieldValuePersister;
import com.atlassian.jira.issue.customfields.persistence.PersistenceFieldType;

import ro.etss.jira.plugin.tutorial.jira.util.Utilities;

public class CurrencyCF extends AbstractSingleFieldType<BigDecimal> {
	private static final Logger log = LoggerFactory.getLogger(CurrencyCF.class);

	public CurrencyCF(CustomFieldValuePersister customFieldValuePersister, GenericConfigManager genericConfigManager) {
		super(customFieldValuePersister, genericConfigManager);
	}

	@Override
	public BigDecimal getSingularObjectFromString(String arg0) throws FieldValidationException {
		if (arg0 != null && Utilities.isNumber(arg0)) {
			try {

				final BigDecimal bd = new BigDecimal(arg0);

				if (bd.scale() > 2)
					throw new FieldValidationException("Maximum of 2 decimal places are allowed!");

				return bd.setScale(2);
			} catch (NumberFormatException e) {
				throw new FieldValidationException("Not a valid number!");
			}

		}
		return null;
	}

	@Override
	public String getStringFromSingularObject(BigDecimal arg0) {
		if (arg0 != null) {
			return arg0.toString();
		}
		return "";
	}

	@Override
	protected PersistenceFieldType getDatabaseType() {
		return PersistenceFieldType.TYPE_LIMITED_TEXT;
	}

	@Override
	protected Object getDbValueFromObject(BigDecimal arg0) {
		return getStringFromSingularObject(arg0);
	}

	@Override
	protected BigDecimal getObjectFromDbValue(Object arg0) throws FieldValidationException {
		return getSingularObjectFromString(arg0.toString());
	}

}