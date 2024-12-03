const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    mongoose.connect("mongodb+srv://CRM-DEMo:crmdemo123@cluster0.n79mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("connected to db crm");
  } catch (error) {
    console.error("Error", error);
  }
};

module.exports = connectDb