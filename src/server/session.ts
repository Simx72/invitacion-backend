import { Application } from "express";
import { randomBytes } from "crypto";
import session from "express-session";

export function useSession(app: Application) {
  app.set('session-time', 1000 * 60 * 60 * 24);

  //session middleware
  app.use(session({
    secret: randomBytes(20).toString('hex'),
    saveUninitialized: true,
    cookie: { maxAge: app.get('session-time') },
    resave: false
  }));
}