/**
 * Module dependencies.
 */
var util = require('util')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


/**
 * `Strategy` constructor.
 *
 * The Lookback authentication strategy authenticates requests by delegating
 * to Lookback using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Lookback application's client id
 *   - `clientSecret`  your Lookback application's client secret
 *   - `callbackURL`   URL to which Lookback will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request, for example:
 *                     'teams'
 *
 * Examples:
 *
 *     passport.use(new LookbackStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/lookback/callback',
 *         scope: 'teams'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.host = options.host || 'https://lookback.io'
  options.authorizationURL = options.host + (options.authorizationURL || '/authorize');
  options.tokenURL = options.host + (options.tokenURL || '/auth/1/token');
  options.scopeSeparator = options.scopeSeparator || ' ';
  this.profileUrl = options.host + (options.profileUrl || '/integrations/1/user?access_token=');
  this._scope = options.scope;

  OAuth2Strategy.call(this, options, verify);
  this.name = options.name || 'lookback';
}


/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Slack.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `lookback`
 *   - `id`               the user's ID
 *   - `displayName`      the user's fullname
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;
  this.get(this.profileUrl, accessToken, function (err, body, res) {

    if (err) {
      return done(err);
    } else {
      try {
        var json = JSON.parse(body);

        var profile = {
          provider: 'Lookback'
        };
        profile.id = json.user._id;
        profile.displayName = json.user.profile.fullname;
        profile._raw = body;
        profile._json = json;

        done(null, profile);

      } catch(e) {
        done(e);
      }
    }
  });
}


/** The default oauth2 strategy puts the access_token into Authorization: header AND query string
  * which is a violation of the RFC so lets override and not add the header and supply only the token for qs.
  */
Strategy.prototype.get = function(url, access_token, callback) {
  this._oauth2._request('GET', url + access_token, {}, '', '', callback );
};


/**
 * Converts scope to scopes parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};
  var scope = options.scope || this._scope;
  if(scope) params.scopes = scope;
  return params;
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
