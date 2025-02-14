import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }, 
  mimetype: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  folderPath: { type: String, required: true },
  frequency: { type: String, required: true },
  interval: { type: String, required: true },
});

const File = mongoose.model("File", fileSchema);
export default File;
