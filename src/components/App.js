import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'
import Countdown from 'react-countdown'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Data from './Data';
import Mint from './Mint';
import NFTCarousel from './NFTCarousel'

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json'

// Config: Import your network config here
import config from '../config.json';

import preview from '../preview.png';

function App() {

  const [provider, setProvider] = useState(null)
  const [nft, setNft] = useState(null)
  const [account, setAccount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revealTime, setRevealTime,] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)
  const [tokenIds, setTokenIds] = useState([])
  const [isWhitelisted, setIsWhitelisted] = useState([])

  const loadBlockchainData = async () => {
    
    // Initiate provider
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)
    
    //Initiate contract
    const { chainId } = await provider.getNetwork()
    const nft = new ethers.Contract(config[chainId].nft.address, NFT_ABI, provider)
    setNft(nft)
    
    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])
    setAccount(account)

    // Fetch countdown
    let allowMintingOn = await nft.allowMintingOn()
    setRevealTime(allowMintingOn.toString() + '000')

    //Fetch max supply
    setTotalSupply(await nft.totalSupply())

    //Fetch max supply
    setMaxSupply(await nft.maxSupply())

    //Fetch cost
    setCost(await nft.cost())

    // Fetch account balance
    setBalance(await nft.balanceOf(account))

    // Fetch token IDs
    setTokenIds(await nft.walletOfOwner(account))

    //Fetch whitelist
    setIsWhitelisted(await nft.whitelist(account))

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />
      <h1 className='my-5 text-center'>Punks NFT Collection</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row >
            <Col>
              {balance ? (
                  <div className='text-center'>
                      <NFTCarousel tokenIds={tokenIds} ipfsURI={'https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'}/>
                  </div>
                ) : (
                  <div className='text-center'>
                    <img src={preview} alt=""/>
                  </div>
              )}
            </Col>
            <Col>
             {/* hide when timer is at 00 00 000 */}
              <div className='my-5 text-center' >
                <Countdown date={parseInt(revealTime)} className='h2'/>
              </div>
              <div className='my-5 text-center' >
                <Data maxSupply={maxSupply} totalSupply={totalSupply} cost={cost} balance={balance}/>
                <Mint nft={nft} provider={provider} cost={cost} setIsLoading={setIsLoading} isWhitelisted={isWhitelisted} maxSupply={maxSupply} totalSupply={totalSupply}/>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
