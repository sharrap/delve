import express from 'express';
import passport from 'passport';

const router = express.Router();

export default function(AuthToken, User) {
  // What user information to send back to the front end
  function userBody(user) {
    return { email: user.email };
  }

  router.get('/signed-in', (req, res) => {
    if (req.isAuthenticated()) {
      return res
        .status(200)
        .send({ authenticated: true, user: userBody(req.user) });
    } else {
      return res.status(200).send({ authenticated: false });
    }
  });
  router.post('/signout', (req, res) => {
    if (req.cookies.rememberMe) {
      AuthToken.clear(req.cookies.rememberMe).catch(() => {});
      res.clearCookie('rememberMe');
    }
    req.logout();
    res.status(200).send();
  });
  router.post('/signin', passport.authenticate('local'), (req, res) => {
    if (!req.isAuthenticated()) return res.status(403).send();

    if (!req.body.rememberMe)
      return res.status(200).send({ user: userBody(req.user) });

    AuthToken.grant(req.user)
      .then(token => {
        res.cookie('rememberMe', token, AuthToken.cookie);
        res.status(200).send({ user: userBody(req.user) });
      })
      .catch(err => {
        console.log('Could not set rememberMe cookie: ' + err);
        res.status(500).send();
      });
  });
  router.post('/signup', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        body: {
          email: email,
        },
        errors: [
          !email && { status: 400, code: 'email-missing' },
          !password && { status: 400, code: 'password-missing' },
        ].filter(x => x),
      });
    }
    User.add(email, password)
      .then(user => {
        res.status(201).send({ user: userBody(user) });
      })
      .catch(err => {
        if (err.emailTaken) {
          return res.status(409).send({
            body: {
              email: email,
            },
            errors: [
              err.emailTaken && { status: 409, code: 'email-taken' },
            ].filter(x => x),
          });
        } else {
          return res.status(500).send();
        }
      });
  });

  return router;
}
