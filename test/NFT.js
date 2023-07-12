const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('NFT', () => {

	const NAME = 'Greg\'s Punks'
	const SYMBOL = 'GP'
	const MAX_SUPPLY = 25
	const COST = ether(0.5)

	let nft, deployer, minter

	beforeEach(async () => {
		let accounts = await ethers.getSigners();
		deployer = accounts[0]
		minter = accounts[1]
	})


	describe('Deployment', () => {

		const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10)
		const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

		beforeEach(async () => {
			const NFT = await ethers.getContractFactory('NFT')
			nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
		})

		it('has correct name', async () => {
			expect(await nft.name()).to.equal(NAME)
		})

		it('has correct symbol', async () => {
			expect(await nft.symbol()).to.equal(SYMBOL)
		})
		it('has the correct cost', async () => {
			expect(await nft.cost()).to.equal(COST)
		})

		it('has the correct maximum total supply', async () => {
			expect(await nft.maxSupply()).to.equal(MAX_SUPPLY)
		})

		it('returns the allowed minting time', async () => {
			expect(await nft.allowMintingOn()).to.equal(ALLOW_MINTING_ON)
		})

		it('returns the IPFS URI', async () => {
			expect(await nft.baseURI()).to.equal(BASE_URI)
		})
		it('returns the owner', async () => {
			expect(await nft.owner()).to.equal(deployer.address)
		})

	})
})