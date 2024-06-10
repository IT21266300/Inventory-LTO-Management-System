import mongoose, { Model } from "mongoose";

const tapeCategorySchema = new mongoose.Schema({
 
 
  subSystemName: {
    type: String,
    required: true,
    unique: true,
  }
 
});

const TapeCategory = mongoose.model('TapeCategory', staffSchema);

// module.exports = Staff;
export default TapeCategory;