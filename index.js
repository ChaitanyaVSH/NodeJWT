const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const port = process.env.MYPORT || 1234;

/**
 * app.get("URL", (req,res)=>{
 *
 * req.params
 *
 * res.send
 * res.write
 * res.json
 * res.render(".html",{})
 *
 *
 * })
 */
app.get("/api", (req, res) => {
  res.send("Hello..");
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(localStorage.getItem("token"), "secretkey", (error, authData) => {
    if (error) {
      res.status(403).json({
        error: "Bad User",
      });
    } else {
      res.json({
        message: "User is authorised",
        user: authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    name: "Voltron",
    email: "v@amazon.com",
  };

  /**
   * jwt.sign(
   * {PAYLOAD},
   * "SECRETKEY",
   * {OPTIONS: Expires},
   * (error,taken)=>{
   *
   *    token
   * }
   *
   * )
   */
  jwt.sign(
    { user: user },
    "secretkey",
    { expiresIn: "30s" },
    (error, token) => {
      res.json({
        token: token,
        message: "Token genreated and stored",
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

/**
 * app.listen(
 *
 * PORT,
 * (error)=>{
 *  console.log("Up an runnign=")
 * }
 * )
 */
app.listen(port, () => {
  console.log(`App is on ${port}`);
});
