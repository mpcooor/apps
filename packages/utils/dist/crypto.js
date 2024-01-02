import { bufferToHex, hexToBuffer } from './format';
export async function cryptoKeyToHex(key) {
    try {
        let exported;
        if (key.type === 'private') {
            exported = await crypto.subtle.exportKey('pkcs8', key);
        }
        else {
            exported = await crypto.subtle.exportKey('raw', key);
        }
        return bufferToHex(exported);
    }
    catch (e) {
        console.error(e);
        return;
    }
}
export async function signCryptoKeyFromHex(hexKey, isPrivateKey) {
    const buffer = hexToBuffer(hexKey);
    const keyParsed = await crypto.subtle.importKey(isPrivateKey ? 'pkcs8' : 'raw', buffer, { name: 'ECDSA', namedCurve: 'P-521' }, true, isPrivateKey ? ['sign'] : ['verify']);
    return keyParsed;
}
export async function syncCryptoKeyFromHex(hexKey, isPrivateKey) {
    const buffer = hexToBuffer(hexKey);
    const keyParsed = await crypto.subtle.importKey(isPrivateKey ? 'pkcs8' : 'raw', buffer, { name: 'ECDH', namedCurve: 'P-521' }, true, isPrivateKey ? ['deriveKey'] : []);
    return keyParsed;
}
export async function generateSignKey() {
    const generated = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-521' }, true, ['sign', 'verify']);
    return generated;
}
export async function generateKeyExchangeKey() {
    const generated = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-521' }, true, [
        'deriveBits',
        'deriveKey'
    ]);
    return generated;
}
export async function generateSignature(privateKey, data) {
    const signature = await crypto.subtle.sign({ hash: 'SHA-512', name: 'ECDSA' }, privateKey, data);
    return bufferToHex(signature);
}
export async function verifySignature(publicKey, signature, message) {
    const bufferSignature = hexToBuffer(signature);
    const valid = await crypto.subtle.verify({ hash: 'SHA-512', name: 'ECDSA' }, publicKey, bufferSignature, message);
    return valid;
}
export async function deriveKey(privateKey, publicKey) {
    if (!privateKey)
        return;
    const generated = await crypto.subtle.deriveKey({
        name: 'ECDH',
        public: publicKey
    }, privateKey, {
        length: 256,
        name: 'AES-GCM'
    }, true, ['encrypt', 'decrypt']);
    return generated;
}
export async function deriveKeyFromHex(key) {
    const buffer = hexToBuffer(key);
    const imported = await crypto.subtle.importKey('raw', buffer, {
        length: 256,
        name: 'AES-GCM'
    }, true, ['encrypt', 'decrypt']);
    return imported;
}
//# sourceMappingURL=crypto.js.map