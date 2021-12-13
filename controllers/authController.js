async function signup(req, res, next) {
  res.send('Welcome to the signup page!');
}

async function login(req, res, next) {
  res.send('Welcome to the login page!');
}

module.exports = {signup, login};
