/**
 * Ensure that a user is logged in before proceeding to next route middleware.
 *
 * This middleware ensures that a user is logged in.  If a request is received
 * that is unauthenticated, the request will be redirected to a login page (by
 * default to `/login`).
 *
 * Additionally, `returnTo` will be be set in the session to the URL of the
 * current request.  After authentication, this value can be used to redirect
 * the user to the page that was originally requested.
 *
 * Options:
 *   - `redirectTo`   URL to redirect to for login, defaults to _/login_
 *   - `setReturnTo`  set redirectTo in session, defaults to _true_
 *
 * Examples:
 *
 *     app.get('/profile',
 *       ensureLoggedIn(),
 *       function(req, res) { ... });
 *
 *     app.get('/profile',
 *       ensureLoggedIn('/signin'),
 *       function(req, res) { ... });
 *
 *     app.get('/profile',
 *       ensureLoggedIn({ redirectTo: '/session/new', setReturnTo: false }),
 *       function(req, res) { ... });
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
module.exports = function ensureLoggedIn(options) {
  if (typeof options === 'string') {
    options = { redirectTo: options }
  }
  options = options || {};

  var url = options.redirectTo || '/login';
  var setReturnTo = (typeof options.setReturnTo === 'undefined') ? true : options.setReturnTo;

  function isAjax(req) {
    // X-Requested-With is usually sent on XHRs (by libraries like jquery)
    // But the other way we can detect this is by looking for an explicit query
    // string parameter that might be sent
    return (req.query && req.query.ajax === 'true')
      || req.header('x-requested-with')
  }

  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (isAjax(req)) {
        res.send(401);
        return next(false);
      }
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url, next);
    } else {
      next();
    }
  }
}
