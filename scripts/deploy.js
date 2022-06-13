
const hre = require("hardhat");

async function main() {

  const Project = await hre.ethers.getContractFactory("FunderMarket");
  const project = await Project.deploy();

  await project.deployed();

  console.log("FunderMarket deployed to:", project.address);
  storeContractData(project)
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/ProjectAddress.json",
    JSON.stringify({ Project: contract.address }, undefined, 2)
  );

  const ProjectArtifact = artifacts.readArtifactSync("FunderMarket");

  fs.writeFileSync(
    contractsDir + "/Project.json",
    JSON.stringify(ProjectArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
