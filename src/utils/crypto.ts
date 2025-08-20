import { randomBytes, createCipheriv, createDecipheriv } from "crypto";


const key = Buffer.from(process.env.EXCRYPTION_KEY_HEX!, "hex"); 

export function encryptGCM(plainText : String) {

    const iv = randomBytes(12); 
    const cipher = createCipheriv('aes-256-gcm', key, iv); 

}

export function decryptGCM(payloadB64 : String) {

}