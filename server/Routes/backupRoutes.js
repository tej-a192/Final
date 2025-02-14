import express from "express";
import { getFileFromS3, scheduleBackup } from "../controllers/backupController.js";

const router = express.Router();

router.post("/schedule", scheduleBackup);
router.get("/getFiles", getFileFromS3);
export default router;
