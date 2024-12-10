const express = require("express");
const router = express.Router();

// middlewares
const { authenticated, admin } = require("../middleware/authentication.js");

// controllers
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  addClientForm,
  generateOtp,
  verifyOtp,
} = require("../controllers/client.js");

// Client routes
router.post("/client/create", createClient);
router.get("/client/all", authenticated, admin, getAllClients);
router.get("/client/:id", authenticated, admin, getClientById);
router.put("/client/update", authenticated, updateClient);
router.delete("/client/delete/:id", authenticated, admin, deleteClient);

// Client form routes
router.post("/client/form/add", authenticated, addClientForm);

// OTP-based login routes
router.post("/client/generate-otp", generateOtp);
router.post("/client/verify-otp", verifyOtp);

module.exports = router;
