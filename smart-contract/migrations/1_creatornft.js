var DeployCreatorNFT = artifacts.require("DeployCreatorNFT");

module.exports = function(deployer) {
  // deployment steps
  // deployer.deploy(CreatorNFT, "0x304a2B7fF0ebc4EdA546E2aD0f530B0Eb35F8248", 200000000000000, "bhavesh-ref-id", "Bhavesh Praveen", "BP", "");

  // deployer.deploy(CreatorNFT, "0x304a2B7fF0ebc4EdA546E2aD0f530B0Eb35F8248", 200000000000000, "hithaesh-ref-id", "Hithaesh Praveen", "HP", "");

  // dev 2 account
  // deployer.deploy(CreatorNFT, "0xf019D4C1e8231D26e0De4bF70a7d0B597D05d67d", 200000000000000, "bhavesh-ref-id", "Bhavesh Praveen", "BP", ""); 

  // DeployCreatorNFT
  // Testing address => 0x27f89c44164a0Ca66f8E558204715e2bb55D49F7
  // Production address => 0x4EB40E14CADd820103097C004ed71dEb593122A0

  deployer.deploy(DeployCreatorNFT); 

};