import crypto from "crypto";
import fs from "fs";

// Load RSA keys
const publicKey = fs.readFileSync("./keys/public_key.pem", "utf8");
const privateKey = fs.readFileSync("./keys/private_key.pem", "utf8");

// --- Symmetric AES encryption ---
const ALGORITHM = "aes-256-cbc";

export const encryptData = (plaintext)=> {
  // 1️⃣ Generate random AES key & IV
  const aesKey = crypto.randomBytes(32); // 256-bit key
  const iv = crypto.randomBytes(16);

  // 2️⃣ Encrypt plaintext with AES
  const cipher = crypto.createCipheriv(ALGORITHM, aesKey, iv);
  const encryptedData = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]).toString("base64");

  // 3️⃣ Encrypt AES key with RSA public key
  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    aesKey
  ).toString("base64");

  return { encryptedData, encryptedKey, iv: iv.toString("base64") };
};

export const decryptData = (encryptedData, encryptedKey, iv) => {
  // 1️⃣ Decrypt AES key with RSA private key
  const aesKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedKey, "base64")
  );

  // 2️⃣ Decrypt data with AES
  const decipher = crypto.createDecipheriv(ALGORITHM, aesKey, Buffer.from(iv, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
