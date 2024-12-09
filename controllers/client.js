const Client = require("../models/Client");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

// Create a new client(supplier or customer) || Register a new client
exports.createClient = async (req, res) => {
  const { name, email, phone, role, address } = req.body;

  // Validate input fields
  if (!name || name.trim().length < 3) {
    throw new BadRequestError("Please provide a valid name (min 3 characters)");
  }
  if (!email) {
    throw new BadRequestError("Please provide email");
  }
  if (!phone) {
    throw new BadRequestError("Please provide phone number");
  }
  if (!["customer", "supplier"].includes(role)) {
    throw new BadRequestError("Role must be either customer or supplier");
  }

  // Check for existing client
  const existingClient = await Client.findOne({
    $or: [{ email }, { phone }],
    role,
  });

  if (existingClient) {
    if (role === 'supplier') {
      return res.status(StatusCodes.OK).json({
        data: existingClient,
        message: "Supplier already exists",
      });
    } else if (role === 'customer') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You are already registered, please login",
        redirectTo: "/login"
      });
    }
  }

  // Create new client
  const client = new Client({
    name,
    email,
    phone,
    role,
    address: address || "",
  });

  await client.save();
  const jwtToken = client.createJWT();

  // Send response
  res.status(StatusCodes.CREATED).json({
    data: client,
    message: "Client created successfully",
    token: jwtToken
  });
};

// Get all clients
exports.getAllClients = async (req, res) => {
  const { role, page, limit } = req.query;

  let query = {};
  if (role) {
    query.role = role;
  }

  const clients = await Client.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalClients = await Client.countDocuments(query);

  res.status(StatusCodes.OK).json({
    data: clients,
    totalClients,
    message: "Clients fetched successfully",
  });
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new BadRequestError("Client not found");
  }

  res
    .status(StatusCodes.OK)
    .json({ data: client, message: "Client found successfully" });
};

// Update client profile
exports.updateClient = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const client = await Client.findById(req.user._id);

  if (!client) {
    throw new BadRequestError("Client not found");
  }

  // Validate inputs
  if (name && (name.trim().length < 3 || name.trim().length > 50)) {
    throw new BadRequestError("Name must be between 3 and 50 characters");
  }

  // Update client fields
  client.name = name || client.name;
  client.email = email || client.email;
  client.phone = phone || client.phone;
  client.address = address || client.address;

  await client.save();

  res.status(StatusCodes.OK).json({
    data: client,
    message: "Client updated successfully",
  });
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    throw new BadRequestError("Client not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Client deleted successfully",
  });
};

// Add a form to client's forms
exports.addClientForm = async (req, res) => {
  const { bookingId, formLink } = req.body;
  const client = await Client.findById(req.user._id);

  if (!client) {
    throw new BadRequestError("Client not found");
  }

  if (!bookingId || !formLink) {
    throw new BadRequestError("Booking ID and Form Link are required");
  }

  client.forms.push({ bookingId, link: formLink });
  await client.save();

  res.status(StatusCodes.CREATED).json({
    data: client,
    message: "Form added successfully",
  });
};

// login client using phone number and otp

exports.generateOtp = async (req, res) => {
  const { phone } = req.body;

  const client = await Client.findOne({ phone });

  if (!client) {
    throw new BadRequestError("Client not found");
  }
  if (client.role === "supplier") {
    throw new BadRequestError("Supplier can not login");
  }
  // create otp and send it to client with expire date
  const otp = Math.floor(1000 + Math.random() * 9000);
  client.otp = otp.toString(); // Convert to string to match model
  client.otp_expiry = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes, not 4 hours
  await client.save();

  // TODO: Implement actual OTP sending mechanism (SMS/email)

  // TODO: add client phone number to the query params and redirect to otp page
  //   res.redirect(`http://localhost:5173/otp?phone=${phone}`);

  res.status(StatusCodes.OK).json({
    data: otp, //note: will be removed in the future
    message: "OTP sent successfully",
    redirectTo: `/otp?phone=${phone}`,
  });
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otpCode } = req.body;

  const customer = await Client.findOne({ phone:phoneNumber, role: "customer" });

  if (!customer) {
    throw new BadRequestError("Customer not found");
  }

  if (customer.otp !== otpCode) {
    throw new BadRequestError("Invalid OTP");
  }

  const otpExpirationTime = customer.otp_expiry;

  if (otpExpirationTime < new Date()) {
    throw new BadRequestError("OTP expired");
  }

  customer.otp = null;
  customer.otp_expiry = null;
  await customer.save();

  const jwtToken = customer.createJWT();

  res.status(StatusCodes.OK).json({
    data: customer,
    token: jwtToken,
    message: "OTP verified successfully",
  });
};
