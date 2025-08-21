import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const algorithm = 'aes-256-gcm'; 

//TODO ---- generate encryption key
const key = Buffer.from(process.env.EXCRYPTION_KEY_HEX!, "hex"); 

export function encryptGCM(plainText : string) {
    
    if (!process.env.EXCRYPTION_KEY_HEX) throw new Error("EXCRYPTION_KEY_HEX missing"); 

    if (key.length !== 32) {
        throw new Error("EXCRYPTION_KEY_HEX must be 64 hex chars (32 bytes)"); 
    }
    
    //12 byte nonce
    const iv = randomBytes(12); 
    const cipher = createCipheriv(algorithm, key, iv); 
    //update utf-8 plain text
    //returns ciphertext bytes.
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag(); 

    return Buffer.concat([iv, tag, encrypted]).toString("base64"); 
}

export function decryptGCM(payloadB64 : String) {

    if (!process.env.EXCRYPTION_KEY_HEX) throw new Error("EXCRYPTION_KEY_HEX missing"); 

    if (key.length !== 32) {
        throw new Error("EXCRYPTION_KEY_HEX must be 64 hex chars (32 bytes)"); 
    }

    const buffer = Buffer.from(payloadB64, "base64"); 
    const iv = buffer.subarray(0,12);
    const tag = buffer.subarray(12, 28);  
    const data = buffer.subarray(28);  
    const decipher = createDecipheriv(algorithm, key, iv); 
    decipher.setAuthTag(tag); 
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);    
    return dec.toString("utf-8"); 
}