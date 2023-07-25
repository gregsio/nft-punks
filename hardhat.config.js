require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};


task(
  "whitelist",
  "Adds wallet addresses to the NFT auction whitelist",
  async (_, { ethers }) => {

    const crowdsale = await ethers.getContractAt('NFT','0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const [owner, user1, user2, user3] = await ethers.getSigners();
    whitelist = [user1.address, user2.address]

    transaction = await crowdsale.whitelistAdd(whitelist)
    result = await transaction.wait()

    console.log ("whitelist: " + user1.address + ': ' + await crowdsale.whitelist(user1.address))
    console.log ("whitelist: " + user2.address + ': ' + await crowdsale.whitelist(user2.address))
  }
);