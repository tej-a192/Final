import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useContext(AppContext); // Get logged-in user details
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderPath, setFolderPath] = useState("");
  const [frequency, setFrequency] = useState("");
  const [interval, setInterval] = useState("");

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user._id); // Send userId
    formData.append("folderPath", folderPath);
    formData.append("frequency", frequency);
    formData.append("interval", interval);

    try {
      const response = await axios.post("https://backup-service.onrender.com/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("File uploaded:", response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed!");
    }
  };

  const handleUpload = async () => {


    const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

    const getUserIdFromToken = (token) => {
      if (!token) return null;
    
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode Base64 payload
        return payload.userId || payload.id || null; // Extract userId (depends on backend naming)
      } catch (error) {
        console.error("Invalid token", error);
        return null;
      }
    };
    
    const userId = getUserIdFromToken(token);
    console.log(userId);
    
    const formData = {
      userId: userId,
      folderPath: folderPath,
      frequency: frequency,
      interval: interval
    }
    
    
    
    
    try {
      const response = await axios.post("https://backup-service.onrender.com/api/backup/schedule", formData);
  
      console.log("File uploaded:", response.data);
      toast.success("Files uploaded successfully", {pauseOnHover: false});
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed!");
    }
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex justify-center items-center mt-56">
        <div className="flex flex-col justify-center border w-1/3 p-4 mt-7 rounded-md">
          <h1 className="font-bold text-lg">Upload your files</h1>

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Folder Path"
            className="border p-2 rounded-md mt-2"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
          />
          <input
            type="text"
            placeholder="Frequency (seconds, minutes, hours, days, weeks)"
            className="border p-2 rounded-md mt-2"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <input
            type="text"
            placeholder="Interval"
            className="border p-2 rounded-md mt-2 mb-2"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />

          

          {/* Backup Drawer */}
          <Drawer>
            <DrawerTrigger className="bg-black text-white rounded-lg p-2">
              Backup
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-col justify-center items-center">
                <DrawerTitle>Backup File</DrawerTitle>
                <DrawerDescription className="text-slate-500">
                  Click upload to save file to database.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="flex flex-col justify-center items-center">
                <input type="file" className="hidden" id="drawerFileInput" onChange={handleFileSelect} />
                <Button className="w-1/4" onClick={handleUpload}>
                  Upload
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
              </DrawerClose>

              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>


      
    </div>
  );
};

export default Dashboard;
