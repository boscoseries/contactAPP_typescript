var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
  firstname: String,
  surname: String,
  mobile: Number,
  phone: Number,
  address: String,
  website: String,
  email: String,
  status: { type: String, enum: ["available", "blocked"] },
  deleted: Boolean
});

module.exports = mongoose.model("Contact", contactSchema);
