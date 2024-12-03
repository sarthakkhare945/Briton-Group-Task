// routes/contactRoutes.js
const express = require("express");
const { createContact, editContact, deleteContact } = require("../controllers/contactController");
const { getAllContact } = require("../controllers/contactController");

const router = express.Router();

// Route to get all contacts

router.get("/contacts", getAllContact);

// Route to create a contact
router.post("/contacts", createContact);

// Route to edit a contact
router.put("/contacts/:id", editContact);

router.delete("/contacts/:id", deleteContact);

module.exports = router;
