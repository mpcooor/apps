// https://leastauthority.com/static/publications/LeastAuthority-YLVIS_LLC_Tally_Browser_Extension_Wallet_Key_Handling_Final_Audit_Report.pdf
// https://github.com/tahowallet/extension/blob/a522d0d3b7f81e34f3827224c54481f997ad686e/background/services/keyring/encryption.ts
import { bufferToHex, hexToBuffer } from './format';
async function generateSalt() {
    try {
        const saltBuffer = crypto.getRandomValues(new Uint8Array(64));
        return bufferToHex(saltBuffer);
    }
    catch (e) {
        console.error(e);
    }
}
export async function deriveSymmetricKeyFromPassword(password, extractable = false, existingSalt) {
    try {
        const { crypto } = global;
        const salt = existingSalt || (await generateSalt());
        if (!salt)
            return;
        const encoder = new TextEncoder();
        const derivationKey = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
            'deriveKey'
        ]);
        const key = await crypto.subtle.deriveKey({
            hash: 'SHA-512',
            iterations: 1000000,
            name: 'PBKDF2',
            salt: encoder.encode(salt)
        }, derivationKey, { length: 256, name: 'AES-GCM' }, extractable, ['encrypt', 'decrypt']);
        return {
            key,
            salt
        };
    }
    catch (e) {
        console.error(e);
        return;
    }
}
export async function encryptVault(vault, passwordOrSaltedKey) {
    try {
        const { crypto } = global;
        const derived = typeof passwordOrSaltedKey === 'string'
            ? await deriveSymmetricKeyFromPassword(passwordOrSaltedKey, false)
            : passwordOrSaltedKey;
        if (!derived)
            return;
        const { salt, key } = derived;
        const encoder = new TextEncoder();
        const initializationVector = crypto.getRandomValues(new Uint8Array(16));
        const encodedPlaintext = encoder.encode(JSON.stringify(vault));
        const cipherText = await crypto.subtle.encrypt({ iv: initializationVector, name: 'AES-GCM' }, key, encodedPlaintext);
        return {
            cipherText: bufferToHex(cipherText),
            initializationVector: bufferToHex(initializationVector),
            salt
        };
    }
    catch (e) {
        console.error(e);
        return;
    }
}
export async function decryptVault(vault, passwordOrSaltedKey) {
    try {
        const { crypto } = global;
        const { initializationVector, salt, cipherText } = vault;
        const derived = typeof passwordOrSaltedKey === 'string'
            ? await deriveSymmetricKeyFromPassword(passwordOrSaltedKey, false, salt)
            : passwordOrSaltedKey;
        if (!derived)
            return;
        const { key } = derived;
        const plaintext = await crypto.subtle.decrypt({ iv: hexToBuffer(initializationVector), name: 'AES-GCM' }, key, hexToBuffer(cipherText));
        return JSON.parse(new TextDecoder().decode(plaintext));
    }
    catch (e) {
        console.error(e);
        return;
    }
}
//# sourceMappingURL=encryption.js.map