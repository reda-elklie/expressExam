import mongoose, { Schema } from "mongoose";

const filiereSchema = Schema({
  code_filiere: {
    type: String,
    required: true,
    unique: true,
    maxLength: 4,
  },
  lib_filiere: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
  },
  stagiaire: {
    type: [String],
  },
  nombre_maximal: {
    type: Number,
  },
});

const filiereModel = mongoose.model("filiere", filiereSchema);
export default filiereModel;
