# passport-lookback

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Lookback](https://lookback.com) using the OAuth 2.0 API.

This library is forked from: https://github.com/mjpearson/passport-slack

## Install

    __TO BE PUBLISHED__

    $ npm install passport-lookback

## Usage

#### Credentials

Until we have implemented access to generate a client id and secret, you'll need to request these from help@lookback.io

#### Configure Strategy

Authenticate using a Lookback account and OAuth 2.0 tokens.  The strategy requires a callback, which
accepts these credentials and calls `done` providing a user, as well as `options` specifying a client ID,
client secret, and callback URL.

    passport.use(new LookbackStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ LookbackId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Scopes
By default this strategy will retrieve the user profile.

Adding the scope `teams` will also return the teams the user belongs to.

## Thanks

  - [Michael Pearson](http://github.com/mjpearson)
  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
