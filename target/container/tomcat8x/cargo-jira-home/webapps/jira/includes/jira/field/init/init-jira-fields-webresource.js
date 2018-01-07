/**
 * INC-67 - Synchronously initialise fields by using top-level synchronous require().
 * This is a short-term measure until the fields are turned in to Skated components.
 */
require('jira/field/init-cascading-selects');
require('jira/field/init-component-pickers');
require('jira/field/init-multi-select-pickers');
require('jira/field/init-date-pickers');
require('jira/field/init-legacy-group-pickers');
require('jira/field/init-issue-pickers');
require('jira/field/init-label-pickers');
require('jira/field/init-version-pickers');
require('jira/field/init-comment-controls');
require('jira/field/init-log-work-controls');
require('jira/field/init-priority-pickers');
require('jira/field/init-inline-attach');