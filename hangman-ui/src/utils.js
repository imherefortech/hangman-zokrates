import CryptoJS from 'crypto-js';

// Generates sha256 hash in the format required for Zokrates
function sha256Zokrates(str) {
  let result = [];

  // Second input is a hashed word
  const sha256Array = CryptoJS.SHA256(str);
  for (let i = 0; i < 8; i++) {
      const unsignedSha256Word = sha256Array.words[i] >>> 0;
      result.push(unsignedSha256Word.toString());
  }

  return result;
}
// Generates sha256 hash in the format required for Noir
function sha256Noir(str) {
  const hash = CryptoJS.SHA256(str);
  const hexString = hash.toString(CryptoJS.enc.Hex);
  
  const result = [];
  for (let i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }

  return result;
}

export default { sha256Zokrates, sha256Noir };