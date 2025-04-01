const crypto = require("crypto");
const prompt = require("prompt-sync")();

const hash = (input) => {
  // This line creates a SHA-256 hash object using the crypto module
  const sha256 = crypto.createHash("sha256");
  return sha256.update(input).digest("hex");
};

const input = prompt("Enter a string: ");
console.log(hash(input));
