import { Form, Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';

/* global BigInt */

const Mint = ({provider, nft, cost, setIsLoading, isWhitelisted, maxSupply, totalSupply}) => {
    const [mintAmount, setMintAmount] = useState(null)
    const [isWaiting, setIsWaiting] = useState(false)
    const [availableToMint, setAvailableToMint] = useState((maxSupply - totalSupply).toString())


    const mintHandler = async(e) => {
        e.preventDefault()
        setIsWaiting(true)

        try {
            const signer = await provider.getSigner()
            console.log("Minting", mintAmount)
            const transaction = await nft.connect(signer).mint(mintAmount, {value: cost * BigInt(mintAmount)})
            await transaction.wait()
        }
        catch{
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    return(
        <Form onSubmit={mintHandler}>
            <Form.Group style={{ maxWidth:'400px', margin:'50px auto'}}>
                {isWhitelisted ? (
                    <Form.Control
                        placeholder='Enter amount'
                        type='number'
                        className='my-2'
                        min="1"
                        max={availableToMint}
                        onChange={(e) => {setMintAmount(e.target.value)}}
                        disabled={ availableToMint > 0 ? false: true}

                    />
                ) : (
                    <p>Your account is currently not elligble for this NFT auction, please reach out to our staff on Discord</p>
                )}
                    {isWaiting ? (
                        <Spinner  animation="border" style={{ display: 'block', margin: '0 auto' }}/>
                    ) : (
                        <Button variant='primary' type='submit' style={{width:'100%'}} disabled={ availableToMint > 0 & isWhitelisted? false : 'disabled'} >Mint NFT(s)</Button>
                    )}
            </Form.Group>
        </Form>
    )
}

export default Mint;