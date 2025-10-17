// req.isAuthenticated is provided from the auth router
const handleAuth = (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
}

export {
  handleAuth
}