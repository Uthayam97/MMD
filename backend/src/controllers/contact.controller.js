const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });
    return res.status(201).json(contact);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save contact", error: error.message });
  }
};

module.exports = { createContact };
