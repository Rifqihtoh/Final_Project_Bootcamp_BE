const express = require("express");
const authRouter = require("./routes/auth.route");
require("./models/user.model");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
