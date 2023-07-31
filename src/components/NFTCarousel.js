import Carousel from 'react-bootstrap/Carousel';
import { useState } from 'react';

const NFTCarousel = ({tokenIds, ipfsURI}) => {

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };
    
    let itemList=[];
    tokenIds.forEach((item,index)=>{
      itemList.push( 
        <Carousel.Item key={index}>
            <img src={`${ipfsURI}${item}.png`} alt="Open Punk" />
            <Carousel.Caption>
            {/* <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
            </Carousel.Caption>
        </Carousel.Item>
        )    
    })
    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            {itemList}
        </Carousel>
    )
}

export default NFTCarousel;