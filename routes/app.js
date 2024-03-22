import { Router } from "express";
import filiereModel from "../model/filiereModel";
import uuid from "uuid";
import stagiaireModel from "../model/StagiaireModel";
const routes = Router();

routes.get("/allstagiaires", async (req, res) => {
  try {
    const stgs = await stagiaireModel.find();
    if (stgs) {
      res.status(200).json(stgs);
    } else {
      res.status(404).json({ msg: " no user found" });
    }
  } catch (err) {
    res.status(500).send({ msg: "server error !" });
  }
});

routes.get("/:filiere", async (req, res) => {
  try {
    const filiere = await filiereModel.find({
      code_filiere: req.params.filiere,
    });
    if (!filiere) return res.status(404).send({ msg: "no filiere found !" });

    const stgs = await stagiaireModel.find({
      code_stagiaire: req.params.filiere,
    });
    res.status(200).json(stgs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

routes.delete("/filiere/:filiere", async (req, res) => {
  try {
    const filiere = await filiereModel.findOneAndDelete({
      code_filiere: req.params.filiere,
    });
    if (!filiere) return res.status(404).json({ msg: "no filerr found" });
    await stagiaireModel.deleteMany({ code_filiere: req.params.filiere });
    res.status(200).json({ msg: "filere and related stgs deleted " });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

routes.delete("/stagiaire/:code", async (req, res) => {
  try {
    const stagiaire = stagiaireModel.findOneAndDelete({
      code_stagiaire: req.params.code,
    });

    if (!stagiaire) return res.status(404).json({ msg: "no stagiaire found" });
    res.status(200).json({ msg: "stg deleted successfully" }, stagiaire);
  } catch (err) {
    res.status(500).send({ eror: err.message });
  }
});
routes.post("/add/:filiere", async (req, res) => {
  try {
    const filirerCode = req.params.filiere;

    const { nom_prenom, date_naissance, date_creation } = req.body;

    const stagiaire_code = "STG" + uuid.v4();

    const newStagiaire = new stagiaireModel({
      code_stagiaire: stagiaire_code,
      nom_prenom: nom_prenom,
      date_naissance: new Date(date_naissance),
    });

    await newStagiaire.save();
  } catch (err) {
    res.status(500).json({ msg: "error !" });
  }
});

routes.put("/change/:filiere1/:filiere2/:stagiaire", async (req, res) => {
  const { filiere1, filiere2, stagiaire } = req.params;

  const stagiaireToupdate = await stagiaireModel.findOne({
    code_stagiaire: stagiaire,
  });

  if (!stagiaireToupdate) {
    return res.status(404).json({ msg: "stagiaire not found" });
  }

  stagiaire.filiere = filiere2;

  await stagiaireToupdate.save();

  res.status(200).json(stagiaireToupdate);
})

// const express = require("express");
// const router = express.Router();
// const FiliereModel = require("../models/filiereModel");
// const StagiaireModel = require("../models/stagiaireModel");
// const uuid = require("uuid");

// // **Route GET /allstagiaires**

// router.get("/allstagiaires", async (req, res) => {
//   try {
//     const stagiaires = await StagiaireModel.find();
//     res.status(200).json(stagiaires);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // **Route GET /:filiere**

// router.get("/:filiere", async (req, res) => {
//   const { filiere } = req.params;
//   try {
//     const foundFiliere = await FiliereModel.findOne({ code_filiere: filiere });
//     if (!foundFiliere) {
//       return res.status(404).json({ message: "Filière introuvable" });
//     }
//     const stagiaires = await StagiaireModel.find({
//       _id: { $in: foundFiliere.stagiaires },
//     });
//     res.status(200).json(stagiaires);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // **Route DELETE /filiere/:filiere**

// router.delete("/filiere/:filiere", async (req, res) => {
//   const { filiere } = req.params;
//   try {
//     const foundFiliere = await FiliereModel.findOneAndDelete({
//       code_filiere: filiere,
//     });
//     if (!foundFiliere) {
//       return res.status(404).json({ message: "Filière introuvable" });
//     }
//     await StagiaireModel.deleteMany({ _id: { $in: foundFiliere.stagiaires } });
//     res.status(200).json({ message: `Suppression de ${foundFiliere.stagiaires.length} stagiaires` });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // **Route DELETE /stagiaire/:code**

// router.delete("/stagiaire/:code", async (req, res) => {
//   const { code } = req.params;
//   try {
//     const deletedStagiaire = await StagiaireModel.findByIdAndDelete(code);
//     if (!deletedStagiaire) {
//       return res.status(404).json({ message: "Stagiaire introuvable" });
//     }
//     const filiere = await FiliereModel.findOne({ stagiaires: code });
//     if (filiere) {
//       filiere.stagiaires = filiere.stagiaires.filter((id) => id !== code);
//       if (filiere.stagiaires.length === 0) {
//         await FiliereModel.deleteOne(filiere);
//       } else {
//         await FiliereModel.findByIdAndUpdate(filiere._id, filiere);
//       }
//     }
//     res.status(200).json(deletedStagiaire);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // **Route POST /add/:filiere**

// router.post("/add/:filiere", async (req, res) => {
//   const { nom_prenom, date_naissance } = req.body;
//   const { filiere } = req.params;
//   try {
//     const foundFiliere = await FiliereModel.findOne({ code_filiere: filiere });
//     if (!foundFiliere) {
//       return res.status(404).json({ message: "Filière introuvable" });
//     }
//     if (foundFiliere.stagiaires.length >= foundFiliere.nombre_maximale) {
//       return res.status(507).json({ message: "Nombre maximum de stagiaires atteint" });
//     }
//     const code_stagiaire = `STG${uuid.v4().replace(/-/g, "")}`;
//     const newStagiaire = new StagiaireModel({
//       code_stagiaire,
//       nom_prenom,
//       date_naissance,
//       date_creation: Date.now(),
//     });
//   }catch (error) {
//     res.status(500).json({ message: error.message });}
// }
