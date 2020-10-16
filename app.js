const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const port = process.env.port || 1234;

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  console.log(req.token);
  jwt.verify(req.token, "secretkey", (error, authData) => {
    if (error) {
      res.status(403).json({
        message: "Unauthorised",
      });
    } else {
      res.json({
        message: "Post created",
        authData: authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "Chaitu",
    email: "chaitu.vsh@gmail.com",
  };

  /**
   * jwt.sign({payload}, "secretkey", {options:}, (err,token)=>{})
   */
  jwt.sign(
    { user: user },
    "secretkey",
    { expiresIn: "30s" },
    (error, token) => {
      res.json({
        token: token,
        message: "Token generated",
      });
    }
  );
});

function verifyToken(req, res, next) {
  const bearerHeaders = req.headers["authorization"];

  if (typeof bearerHeaders !== "undefined") {
    const bearer = bearerHeaders.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(port, () => {
  console.log(`App is up and runnig on the ${port}`);
});
