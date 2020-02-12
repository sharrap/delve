import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import database from './db/index.js';
import dbUser from './db/user.js';
import dbAuthToken from './db/auth_token.js';
import AuthTokenProvider from './authentication/token.js';
import userRoutes from './routes/user.js';
import initPassport from './authentication/init.js';
import securePasswordConfig from 'secure-password';
import passport from 'passport';
import redis from 'redis';
import RedisServer from 'redis-server';
import connectRedis from 'connect-redis';

const app = express();

const redisServer = new RedisServer({
  port: 6379,
});

redisServer.open().then(() => {
  process.on('exit', () => redisServer.close());
  const redisClient = redis.createClient();
  const RedisStore = connectRedis(session);

  const __dirname = path.resolve();

  const sess = {
    store: new RedisStore({ client: redisClient }),
    secret: 'example secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
      secure: false, //FIXME
    },
  };

  const db = database();
  const passwordConfig = securePasswordConfig();
  const User = dbUser(db, passwordConfig);
  const AuthToken = AuthTokenProvider(dbAuthToken(db), User);
  initPassport(passwordConfig, redisClient, User, AuthToken);

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session(sess));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate('remember-me'));

  app.use('/user', userRoutes(AuthToken, User));

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

export default app;
