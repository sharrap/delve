import passport from 'passport';
import LocalStrategy from 'passport-local';
import SecurePassword from 'secure-password';

export default function initPassport(passwordConfig, User, redisClient) {
  function rehashPassword(id, password) {
    redisClient.sismember('rehashingUsers', id, (err, reply) => {
      if (!err && !reply) {
        redisClient.sadd('rehashingUsers', id, (err, reply) => {
          if (!err && reply) {
            User.addPassword(id, password)
              .then(() => redisClient.srem('rehashingUsers', id))
              .catch(() => {});
          }
        });
      }
    });
  }
  async function verifyUser(email, password) {
    const userWithPassword = await User.getWithPasswordByEmail(email);

    const { hashedPassword, ...user } = userWithPassword;

    if (!hashedPassword) return false;

    const verifyResult = await passwordConfig.verify(
      Buffer.from(password),
      Buffer.from(hashedPassword.padEnd(SecurePassword.HASH_BYTES, '\0'))
    );

    switch (verifyResult) {
      case SecurePassword.VALID_NEEDS_REHASH:
        rehashPassword(user.id, password).catch(() => {});
        return user;
      case SecurePassword.VALID:
        return user;
      case SecurePassword.INVALID_UNRECOGNIZED_HASH:
      case SecurePassword.INVALID:
        return false;
    }
  }
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.getById(id)
      .then(user => done(null, user))
      .catch(done);
  });
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        verifyUser(email, password)
          .then(user => done(null, user))
          .catch(() => done(null, false));
      }
    )
  );
}
