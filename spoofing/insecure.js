const express = require("express")
const session = require("express-session")

const app = express();

// to run
// cd spoofing
// npm install
// node insecure.js

app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: "SOMESECRET",
    cookie: {httpOnly: false},
    resave: false,
    saveUninitialized: false
  })
)

app.post("/sensitive", (req, res) => {
  if (req.session.user === 'Admin') {
    req.session.sensitive = 'supersecret';
    res.send({message: 'Operation successful'});
  }
  else {
    res.send({message: 'Unauthorized Access'});
  }
})

app.get("/", (req, res) => {
  let name = "Guest"

  if (req.session.user) name = req.session.user
  // if user already in session, extract and store username
  // session (is a middleware, like CORS)
  // session not set at start, then response sent

  // sent to user on login?
  // sends register to POST
  // req session sent every request iuntil we say destroy

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/register" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <button>Submit</button>
  </form>
  <form action="/forget" method="POST">
    <button>Logout</button>
  </form>
  `)
})

app.post("/register", (req, res) => {
  // name = req.body.name.trim()
  // res.redirect("/")
  // , sets name to username
  req.session.user = req.body.name.trim()
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
})

app.post("/forget", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  })
})

app.listen(8000)
