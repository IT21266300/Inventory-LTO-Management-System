import mongoose, { Model } from "mongoose";

const staffSchema = new mongoose.Schema({
 
 staffId: {
    type: String,
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },

  position: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const Staff = mongoose.model('Staff', staffSchema);

// module.exports = Staff;
export default Staff;