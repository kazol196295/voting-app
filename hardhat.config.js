require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();



const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

if (!ALCHEMY_SEPOLIA_URL || !SEPOLIA_PRIVATE_KEY) {
  throw new Error("❌ Missing ALCHEMY_SEPOLIA_URL or SEPOLIA_PRIVATE_KEY in .env");
}
module.exports = {
  solidity: "0.8.20",
  networks:{
    sepolia:{
      url:ALCHEMY_SEPOLIA_URL,
      accounts: [ SEPOLIA_PRIVATE_KEY],
    },
  },
};
