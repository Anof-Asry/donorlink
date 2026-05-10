import express from "express";
import {createDonor, getAllDonors, getDonorById, updateDonor, deleteDonor,  getDonorsByBloodGroup } from "../controllers/donorController.js";

const router = express.Router();

router.route("/")
    .get(getAllDonors)
    .post(createDonor);

router.route("/:id")
    .get(getDonorById)
    .put(updateDonor)
    .delete(deleteDonor);

router.route("/bloodgroup/:bloodGroup")
    .get(getDonorsByBloodGroup);

export default router;