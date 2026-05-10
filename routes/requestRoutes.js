import express from "express";
import {createRequest,getAllRequests,getRequestById,updateRequest,deleteRequest,matchDonor} from "../controllers/requestController.js";

const router = express.Router();

router.route("/")
    .get(getAllRequests)
    .post(createRequest);

router.route("/:id")
    .get(getRequestById)
    .put(updateRequest)
    .delete(deleteRequest);

router.route("/:id/match")
    .put(matchDonor);

export default router;