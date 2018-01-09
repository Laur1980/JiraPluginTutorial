define('jira/searchers/element/due-date-searcher', ['jira/searchers/datesearcher/date-searcher-factory', 'jira/skate'], function (DateSearcherFactory, skate) {
    'use strict';

    return skate("js-duedate-searcher", {
        type: skate.type.CLASSNAME,
        created: DateSearcherFactory.createDueDateSearcher
    });
});

define('jira/searchers/element/resolved-date-searcher', ['jira/searchers/datesearcher/date-searcher-factory', 'jira/skate'], function (DateSearcherFactory, skate) {
    'use strict';

    return skate("js-resolutiondate-searcher", {
        type: skate.type.CLASSNAME,
        created: DateSearcherFactory.createResolvedDateSearcher
    });
});

define('jira/searchers/element/created-date-searcher', ['jira/searchers/datesearcher/date-searcher-factory', 'jira/skate'], function (DateSearcherFactory, skate) {
    'use strict';

    return skate("js-created-searcher", {
        type: skate.type.CLASSNAME,
        created: DateSearcherFactory.createCreatedDateSearcher
    });
});

define('jira/searchers/element/updated-date-searcher', ['jira/searchers/datesearcher/date-searcher-factory', 'jira/skate'], function (DateSearcherFactory, skate) {
    'use strict';

    return skate("js-updated-searcher", {
        type: skate.type.CLASSNAME,
        created: DateSearcherFactory.createUpdatedDateSearcher
    });
});

define('jira/searchers/element/custom-date-searcher', ['jira/searchers/datesearcher/date-searcher-factory', 'jira/skate'], function (DateSearcherFactory, skate) {
    'use strict';

    return skate("js-customdate-searcher", {
        type: skate.type.CLASSNAME,
        created: DateSearcherFactory.createCustomDateSearcher
    });
});

// Invoke immediately
require(['jira/searchers/element/due-date-searcher', 'jira/searchers/element/resolved-date-searcher', 'jira/searchers/element/created-date-searcher', 'jira/searchers/element/updated-date-searcher', 'jira/searchers/element/custom-date-searcher']);

// Polyfill globals
(function () {
    'use strict';

    var factory = require('jira/searchers/datesearcher/date-searcher-factory');
    AJS.namespace('JIRA.DateSearcher', null, require('jira/searchers/datesearcher/date-searcher'));
    AJS.namespace('JIRA.DateSearcher.createDueDateSearcher', null, factory.createDueDateSearcher);
    AJS.namespace('JIRA.DateSearcher.createResolvedDateSearcher', null, factory.createResolvedDateSearcher);
    AJS.namespace('JIRA.DateSearcher.createCreatedDateSearcher', null, factory.createCreatedDateSearcher);
    AJS.namespace('JIRA.DateSearcher.createUpdatedDateSearcher', null, factory.createUpdatedDateSearcher);
    AJS.namespace('JIRA.DateSearcher.createCustomDateSearcher', null, factory.createCustomDateSearcher);
})();