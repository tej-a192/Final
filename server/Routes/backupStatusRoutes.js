import express from "express";
import BackupSchedule from "../models/BackupSchedule.js";

const router = express.Router();

router.get("/backup-status/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const backups = await BackupSchedule.find({ userId });

        if (!backups.length) {
            return res.status(404).json({ message: "No backups found" });
        }

        res.json(backups);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch backup status" });
    }
});

export default router;
