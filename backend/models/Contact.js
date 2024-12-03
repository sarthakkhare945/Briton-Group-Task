// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ['Lead', 'Client'], required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
