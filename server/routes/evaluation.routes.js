import express from "express";
import upload from "../middleware/upload.js";
import { evaluateAssignment, evaluateAssignmentByUrl } from "../controllers/evaluation.controller.js";

const router = express.Router();

router.post("/", upload.single("file"), evaluateAssignment);
router.post("/by-url", evaluateAssignmentByUrl);

export default router;