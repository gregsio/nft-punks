import { Form, Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';

const Mint = ({provider, nft, cost, setIsLoading, isWhitelisted}) => {
    const [isWaiting, setIsWaiting] = useState(false)

    const mintHandler = async(e) => {
        e.preventDefault()
        setIsWaiting(true)

        try {
            const signer = await provider.getSigner()
            const transaction = await nft.connect(signer).mint(1, {value: cost})
            await transaction.wait()
        }
        catch{
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    return(
        <Form onSubmit={mintHandler} style={{ maxWidth:'450px', margin: '50px auto' }} >
            {isWaiting ? (
                <Spinner animation="border" style={{display:'block', margin:'50px auto'}} />
            ) : (
                <Form.Group>
                    {isWhitelisted ? (
                        <Button variant="primary" type="submit" style={{ width: '100%' }}>Mint</Button>
                    ):(<p>Your account is currently not elligble for this NFT auction, please reach out to our staff on Discord</p>)
                }
                </Form.Group>
            )}
        </Form>
    )
}

export default Mint;