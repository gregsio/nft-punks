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
    const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

    let nft, deployer, minter, result, transaction

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


    describe('Minting', () => {

        describe('Success', () => {
            beforeEach(async () => {
                const ALLOW_MINTING_ON = (Date.now()).toString().slice(0, 10)  // Now

                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
                
                transaction = await nft.connect(minter).mint(1, {value: COST})
                result = await transaction.wait()
            })

            it('Returns the address of the minter', async() => {
                expect( await nft.ownerOf(1)).to.equal(minter.address)
            })

            it('Returns the total number of tokens a minter owns', async() => {
                expect( await nft.balanceOf(minter.address)).to.equal(1)
            })

            it('Updates the total supply', async() => {
                expect(await nft.totalSupply()).to.equal(1)
            })

            it('Updates the contract ether balance', async() => {
                expect(await ethers.provider.getBalance(nft)).to.equal(COST)
            })

            it('Emits a mint event', async() => {
                await expect(transaction).to.emit(nft, 'Mint').withArgs(1, minter.address)
            })
        })

        describe('Failure', () => {
            it('Rejects insufficient payments', async () => {
                const ALLOW_MINTING_ON = (Date.now()).toString().slice(0, 10)  // Now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
                await expect(nft.connect(minter).mint(1, {value: ether(0.1)})).to.be.reverted
            })
            it('Rejects minting before allowed time', async () => {
                const ALLOW_MINTING_ON = new Date('May 21, 2030 18:00:00').getTime().toString().slice(0, 10)
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
                await expect(nft.connect(minter).mint(1, {value: ether(0.1)})).to.be.reverted
            })
            it('It requires at least 1 NFT to be minted', async () => {
                const ALLOW_MINTING_ON = (Date.now()).toString().slice(0, 10)  // Now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
                await expect(nft.connect(minter).mint(0, {value: ether(0.1)})).to.be.reverted
            })

            it('It does not allow to mint more NFT than the maxSupply', async () => {
                const ALLOW_MINTING_ON = (Date.now()).toString().slice(0, 10)  // Now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
                await expect(nft.connect(minter).mint(100, {value: ether(0.1)})).to.be.reverted
            })
    

        })




    })
})
