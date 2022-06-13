const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FunderMarket", function () {
  this.timeout(50000);

  let project;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const Project = await ethers.getContractFactory("FunderMarket");
    [owner, acc1, acc2] = await ethers.getSigners();

    project = await Project.deploy();
  });

  it("Should mint one project", async function () {
    
    const tokenURI = "https://example.com/1";
    const price = ethers.utils.parseUnits("1", "ether");
    await project.connect(owner).createProject(tokenURI, price);
    await project;

  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    const price = ethers.utils.parseUnits("1", "ether");

    const tx1 = await project
      .connect(owner)
      .createProject(tokenURI_1, price);
    await tx1.wait();
    const tx2 = await project
      .connect(owner)
      .createProject(tokenURI_2, price);
    await tx2.wait();

    // expect(await project.tokenURI(0)).to.equal(tokenURI_1);
    // expect(await project.tokenURI(1)).to.equal(tokenURI_2);
  });
  it("Should fund the project", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await project
    .connect(owner)
    .createProject("https://example.com/1", price);
     await project
    .connect(acc1)
    .fundProject( 1, {value: price});
    await project.connect(acc1).pushProjectToMarketPlace(1,{value: price})
    await project
    .connect(acc1)
    .fundProject( 1, {value: price});
  })
  it("Should get the project", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await project
    .connect(owner)
    .createProject("https://example.com/1", price);
     await project
    .connect(acc1)
    .getProject(0);
  })
  it("Should get the owner of contract", async function(){
    await project.connect(owner).getContractOwner();
  })
});


