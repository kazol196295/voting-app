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


  


  // 0xDF98aE82FDD92c973FA2fFCbC7B459a7fd51Fe7f


  //new
  //0x749c0efAb16278951859A78E9B3edCD90Dfb77CC