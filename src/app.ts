import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); // Make express aware that traffic is being proxied to this service by ingress nginx/istio, and configure express to trust that proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: true // NOTE: Disable security
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };