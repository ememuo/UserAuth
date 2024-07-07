const {
  createOrganisation,
  getOrganisations,
  getOrganisation,
  addToOrganisation,
  getUserRecord,
} = require("../controllers/organisationController");
const { validateOrganisation } = require("../utils/validation");
const express = require("express");
const apiRoute = express.Router();
const verifyToken = require("../middlewares/auth");

apiRoute.use(verifyToken);

apiRoute.post("/organisations/:orgId/users", addToOrganisation);
apiRoute.post("/organisation", validateOrganisation, createOrganisation);

apiRoute.get("/users/:id", getUserRecord);
apiRoute.get("/organisations", getOrganisations);

apiRoute.get("/organisations/:orgId", getOrganisation);

module.exports = apiRoute;
