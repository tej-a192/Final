import mongoose from "mongoose";
const BackupScheduleSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    folderPath: { type: String, required: true },
    frequency: { 
        type: String, 
        enum: ["seconds", "minutes", "hourly", "daily", "weekly"], 
        required: true 
    },
    interval: { type: Number, default: 1 }, 
    lastBackup: { type: Date, default: null }
});

export default mongoose.model("BackupSchedule", BackupScheduleSchema);
