// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens

async function main() {
  const NAME = 'Greg\'s Punks'
  const SYMBOL = 'GP'
  const MAX_SUPPLY = 25
  const COST = ether(0.5)
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10)

  // Deploy NFT
  let nft = await hre.ethers.deployContract('NFT', [NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI])

  await nft.waitForDeployment()
  console.log(`NFT deployed to: ${await nft.getAddress()}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
