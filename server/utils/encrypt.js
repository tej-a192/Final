import crypto from "crypto";
import fs from "fs";

const SECRET_KEY = process.env.ENCRYPTION_KEY || "your_secret_key"; // Use environment variables

const encryptFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    const cipher = crypto.createCipher("aes-256-cbc", SECRET_KEY);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encryptedPath = `${filePath}.enc`;
    fs.writeFileSync(encryptedPath, encrypted);
    return encryptedPath;
};

export { encryptFile };
