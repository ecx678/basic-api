const CryptoJS = require("crypto-js")
require('dotenv').config()
// Detta är din hemliga nyckel. Berätta aldrig denna för någon!
// I en riktig applikation laddar du denna från process.env.EncryptKey istället.
const HEMLIG_NYCKEL = process.env.HEMLIG_NYCKEL;

/**
 * Krypterar valfri data (text, objekt eller listor)
 */
function encrypt(data) {
    // Om datan är ett objekt eller en lista, gör om den till en textsträng först
    const textAttKryptera = typeof data === "object" ? JSON.stringify(data) : String(data);
    
    // Kryptera med AES-algoritmen
    const krypteradSträng = CryptoJS.AES.encrypt(textAttKryptera, HEMLIG_NYCKEL).toString();
    return krypteradSträng;
}

/**
 * Dekrypterar den låsta strängen tillbaka till originalet
 */
function uncrypt(krypteradSträng, laddaSomJSON = false) {
    try {
        // Dekryptera strängen med samma nyckel
        const bytes = CryptoJS.AES.decrypt(krypteradSträng, HEMLIG_NYCKEL);
        const vanligText = bytes.toString(CryptoJS.enc.Utf8);
        
        // Om vi förväntar oss ett JSON-objekt tillbaka, tolka strängen
        if (laddaSomJSON) {
            return JSON.parse(vanligText);
        }
        
        return vanligText;
    } catch (error) {
        console.error("Kunde inte dekryptera! Fel nyckel eller skadad data.");
        return null;
    }
}

// Exportera funktionerna så de kan användas i andra filer
module.exports = { encrypt, uncrypt };
