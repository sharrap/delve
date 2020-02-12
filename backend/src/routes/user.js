import express from 'express';
import passport from 'passport';

const router = express.Router();

export default function(AuthToken, User) {
  router.post('/ping', (req, res) => {
    res.send({
      ping: 'ping',
      userId: req.session.passport && req.session.passport.user,
      user: req.user,
    });
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
    if (!req.isAuthenticated()) return res.status(401).send();

    if (!req.body.rememberMe) return res.status(200).send();

    AuthToken.grant(req.user)
      .then(token => {
        res.cookie('rememberMe', token, AuthToken.cookie);
        res.status(200).send();
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
      .then(() => {
        res.status(201).send();
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
