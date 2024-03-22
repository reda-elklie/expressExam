import mongoose, { Schema } from "mongoose";

const stagiaireSchema = Schema({
  code_stg: {
    type: String,
    required: true,
    unique: true,
  },
  nom_prenom: {
    type: String,
    required: true,
  },
  date_naissance: {
    type: Date,
  },
  date_creation: {
    type: Date,
    default: Date.now(),
  },
});

const stagiaireModel = mongoose.model("stagiaire", stagiaireSchema);
export default stagiaireModel;
