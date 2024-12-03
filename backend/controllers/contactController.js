// controllers/contactController.js
const Contact = require("../models/Contact");


const getAllContact = async (req, res) => {
    try {
      const contacts = await Contact.find({});
      console.log("contact", contacts);
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Create a new contact
const createContact = async (req, res) => {
    try {
      const { name, email, phone, company, status } = req.body;
  
      // Check if a contact already exists with the same email or phone number
      const existingContact = await Contact.findOne({email});
  
      if (existingContact) {
        return res.status(400).json({
          message: "A contact with this email already exists.",
        });
      }
  
      // If no existing contact, create a new contact
      const newContact = new Contact({
        name,
        email,
        phone,
        company,
        status,
      });
  
      await newContact.save();
      res.status(201).json({
        message: "Contact created successfully",
        contact: newContact,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating contact", error });
    }
  };
  

// Edit an existing contact
const editContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone, company, status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error });
  }
};


const deleteContact = async(req,res)=>{
    try {
        const {id} = req.params;
        const contact = await Contact.findByIdAndDelete(id)
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
          }
          res.status(200).json({ message: "Contact deleted successfully", contact });

        
    } catch (error) {
       console.error(error); // It's good practice to log the error for debugging
      res.status(500).json({ message: "Error deleting contact", error });
    }
}


  

module.exports = { createContact, editContact,getAllContact,deleteContact };
