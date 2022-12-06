const crypto = require('crypto-js')

/**
 * It is highly recommended NOT to keep this key in here. Rather use an environment variable to store it.
 */
const key = process.env.CRYPTO_KEY || 'changeMe'

// encrypt string with crypto-js
export const encrypt = (str: string, key: string) => {
    return crypto.AES.encrypt(str, key).toString()
}

// decrypt string with crypto-js
export const decrypt = (str: string, key: string) => {
    return crypto.AES.decrypt(str, key).toString(crypto.enc.Utf8)
}

// sample usage
// let encrypted = encrypt('Hello World', key)
// console.log(`Encrypted: ${encrypted}`)
//
// let decrypted = decrypt(encrypted, key)
// console.log(`Decrypted: ${decrypted}`)

