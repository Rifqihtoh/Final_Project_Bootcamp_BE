const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const postgresql = require("../utils/postgre.util");

const findUser = async (email) => {
  return await postgresql.query(
    `SELECT * FROM "user" u WHERE u.email = '${email}';`
  );
};

const validationEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(email);
};

const registerController = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.name || !data?.email || !data?.password) {
      return res.status(400).json({ message: "Bad Request" });
    }

    if (!validationEmail(data.email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    const checkEmail = await findUser(data.email);
    if (checkEmail.rowCount) {
      return res.status(400).json({ message: "Email is exist" });
    }

    const password = bcrypt.hashSync(data.password, 12);

    await postgresql.query(
      `INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3);`,
      [data.name, data.email, password]
    );

    return res.status(201).json({ message: "Created" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const loginController = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.email || !data?.password) {
      return res.status(400).json({ message: "Bad Request" });
    }

    if (!validationEmail(data.email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    const user = await findUser(data.email);
    if (!user.rowCount) {
      return res.status(400).json({ message: "Email or password went wrong" });
    }

    const userData = user.rows[0];
    const checkPassword = await bcrypt.compare(
      data.password,
      userData.password
    );
    if (!checkPassword) {
      return res.status(400).json({ message: "Email or password went wrong" });
    }

    const token = jwt.sign({ email: data.email }, "bsiJayaJaya");
    return res.status(200).json({ message: "Success", data: { token } });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { registerController, loginController };
