const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../utils/db");

const User = require("../models/userModel");
const Organisation = require("../models/organisationModel");
const UserOrganisation = require("../models/userOrganisation");
const { validateOrganisation } = require("../utils/validation");
const { v4: uuidv4 } = require("uuid");

const createOrganisation = async (req, res) => {
  try {
    await validateOrganisation(req, res, async () => {
      const { name, description } = req.body;

      const organisation = await Organisation.create({ name, description });

      res.status(201).json({
        status: "success",
        message: "Organisation created successfully",
        data: organisation,
      });
    });
  } catch (error) {
    res.status(422).json({
      status: "Bad Request",
      message: "Failed to create organisation",
      statusCode: 422,
    });
  }
};
const getOrganisations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const organisations = await organisations.findByUserId(userId);

    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: {
        organisations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Failed to retrieve organisations",
      statusCode: 400,
    });
  }
};

const getOrganisation = async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const organisation = await organisation.findById(orgId);

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Failed to retrieve organisation",
      statusCode: 400,
    });
  }
};

const addToOrganisation = async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const { userId } = req.body;

    // Check if the organisation exists
    const organisation = await organisation.findByOrgId(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: "error",
        message: "Organisation not found",
      });
    }

    // Check if the user exists
    const user = await user.findByUserId(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    await pool.query(
      "INSERT INTO user_organisation (userId, orgId) VALUES ($1, $2)",
      [userId, orgId]
    );

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to add user to organisation",
    });
  }
};
const getUserRecord = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await user.findByUserId(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    const userOrganisations = await pool.query(
      "SELECT o.* FROM user_organisation uo JOIN organisation o ON uo.orgId = o.orgId WHERE uo.userId = $1",
      [userId]
    );
    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        organisations: userOrganisations.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve user",
    });
  }
};

module.exports = {
  createOrganisation,
  getOrganisations,
  getOrganisation,
  addToOrganisation,
  getUserRecord,
};
