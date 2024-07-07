const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");
const Organisation = require("../models/organisationModel");
const UserOrganisation = require("../models/userOrganisation");
const { validateRegister } = require("../utils/validation");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  try {
    await validateRegister(req, res, async () => {
      const { firstName, lastName, email, password, phone } = req.body;
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(422).json({
          errors: [{ field: "email", message: "Email is already registered" }],
        });
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        "INSERT INTO users (firstName, lastName, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [firstName, lastName, email, hashedPass, phone]
      );

      const newOrganisation = await Organisation.create({
        orgId: uuidv4(),
        name: `${firstName}'s Organisation`,
        description: "",
        userId: newUser.userId,
      });

      // Add the user to the organisation
      await pool.query(
        "INSERT INTO user_organisation (userId, orgId) VALUES ($1, $2)",
        [newUser.userId, newOrganisation.orgId]
      );

      // Generate JWT token
      const token = jwt.sign({ userId: newUser.userId }, process.env.SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken: token,
          user: {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
          },
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

const login = async (req, res) => {
  try {
    await validateLogin(req, res, async () => {
      const { email, password } = req.body;

      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({
          status: "Bad request",
          message: "Authentication failed",
          statusCode: 401,
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          status: "Bad request",
          message: "Authentication failed",
          statusCode: 401,
        });
      }

      const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: token,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};

module.exports = { register, login };
