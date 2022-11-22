const crypto = require('crypto-js')

// encrypt string with crypto-js
export const encrypt = (str: string, key: string) => {
    return crypto.AES.encrypt(str, key).toString()
}

// decrypt string with crypto-js
export const decrypt = (str: string, key: string) => {
    return crypto.AES.decrypt(str, key).toString(crypto.enc.Utf8)
}

