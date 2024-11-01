import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email")
        }
    }
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 13,
  },
  photoURL: {
    type: "String",
    default: "https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic.jpg",
  },
  gender: {
    type: String,
      //works only when new data is created i.e post but not on update. User runValidators option in findByIdAndUpdate if you want to trigger on update
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Invalid Gender");
      }
    },
  },
  skills: {
    type: [String]
  }
},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
