import { configDotenv } from "dotenv";

configDotenv();

// req.isAuthenticated is provided from the auth router
const handleAuth = (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
}

const loginUser = (req,res) => {
  return res.oidc.login({
    returnTo: `${process.env.BASE_URL}/dashboard` // where the user goes after login
  });
}

export {
  handleAuth,
  loginUser
}