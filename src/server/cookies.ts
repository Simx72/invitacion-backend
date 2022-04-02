import cookieParser from "cookie-parser"
import { Application } from 'express';

export function useCookies(app: Application) {
  app.use(cookieParser());
}