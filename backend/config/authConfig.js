import { configDotenv } from "dotenv";
import { auth } from "express-openid-connect";

configDotenv();

const config = {
  authRequired: process.env.AUTH_REQUIRED,
  auth0Logout: process.env.AUTH_0_LOGOUT,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

export default auth(config);