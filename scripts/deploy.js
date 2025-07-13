// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Voting = await hre.ethers.getContractFactory("Voting");

    // Deploy the contract
    console.log("Deploying Voting contract...");
    const voting = await Voting.deploy();

    // Wait for deployment to finish
    await voting.waitForDeployment();

    // Get the contract address (await the async method)
    const address = await voting.getAddress();
    console.log("Voting contract deployed to:", address);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  //0xb90696cbBb164C200833149b66985628F16b66c3
  

  //new
  // 0xDF98aE82FDD92c973FA2fFCbC7B459a7fd51Fe7f