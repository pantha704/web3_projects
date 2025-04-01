const crypto = require("crypto");
const prompt = require("prompt-sync")();

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

const prefixedHash = (prefix, input) => {
  prefix.length > 5 ? (prefix = prefix.slice(0, 5)) : prefix;
  let number = 0;
  while (true) {
    // let randomString = generateRandomString(10);
    let inputString = input + number;
    const hash = crypto.createHash("sha256").update(inputString).digest("hex");
    if (hash.startsWith(prefix)) {
      return hash;
    }
    number++;
    // console.log(randomString);
  }
};

const prefix = prompt("Enter your prefix: ");
const input = prompt("Enter nonce string: ");
const hashedInput = prefixedHash(prefix, input);
console.log(hashedInput);
