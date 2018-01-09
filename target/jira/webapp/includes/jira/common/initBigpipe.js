/**
 * @fileOverview
 * In the short-term, we want BigPipe to initialise its content before
 * the browser's DomContentLoaded event fires. This is because a large
 * proportion of JIRA's behaviour is still bound to DCL, and we do not
 * want those JS behaviours to break just yet.
 *
 * In a true asynchronous world, it should not matter to our UI pieces
 * whether they initialise before or after DomContentLoaded. Behaviour
 * should be initialised via Skate or other async-sympathetic APIs....
 *
 * @see {@linkplain https://extranet.atlassian.com/jira/browse/APDEX-1370}
 *      for what prompted this forced-synchronous-before-DCL behaviour
 * @see {@linkplain https://extranet.atlassian.com/jira/browse/APDEX-1395}
 *      for our longer-term strategy
 */
(function syncInitBigpipe() {
  var skate = require('jira/skate');
  require('jira/bigpipe/element');

  /**
   * Force synchronous initialisation of big-pipe elements before
   * DomContentLoaded fires.
   *
   * @todo allow for big-pipe elements to initialise asynchronously.
   * @see {@linkplain https://extranet.atlassian.com/jira/browse/APDEX-1396}
   */
  var bigPipeElements = document.querySelectorAll('big-pipe');
  var i = 0;
  var ii = bigPipeElements.length;
  for (; i < ii; i++) {
    skate.init(bigPipeElements[i]);
  }
})();