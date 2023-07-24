// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;


import "./ERC721Enumerable.sol";
import "./Ownable.sol";
import "hardhat/console.sol";

contract NFT is ERC721Enumerable, Ownable{

    using Strings for uint256;

    string public baseURI;
    string public baseExtension = '.json';
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public allowMintingOn;
    bool public paused = false;

    mapping(address => bool) public whitelist;

    event Mint(uint256 amount, address minter);
    event Withdraw(uint256 amount, address minter);


    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _allowMintingOn,
        string memory _baseURI
        
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        allowMintingOn = _allowMintingOn;
        baseURI = _baseURI;
    }

    function mint(uint256 _mintAmount) public payable {

        //Must be whitelisted
        require(whitelist[msg.sender], 'Account is not whitelisted');
        
        // Allow minting only after specified time
        require(block.timestamp >= allowMintingOn, 'Minting is not yet available');

        // Allow minting only if not paused
        require(!paused, 'Minting has been paused, try again later');

        // Require enought payment
        require(msg.value >= cost * _mintAmount);

        // Must mint at least 1 NFT
        require(_mintAmount > 0 );

        // Create token
        uint256 supply = totalSupply();

        // Do not let minting more tokens than available
        require(_mintAmount + supply <= maxSupply);

        for(uint i=1; i <= _mintAmount; i++ ){
            _safeMint(msg.sender, supply + i);
        }

        // Emit event
        emit Mint(_mintAmount, msg.sender);
    }

    function pauseMinting() public onlyOwner {
        paused = true;
    }

    function tokenURI(uint256 tokenId)
        public view virtual override returns (string memory){

        require( _exists(tokenId), 'token does not exist');
        return string(
            abi.encodePacked(
                baseURI,
                tokenId.toString(),
                baseExtension
                )
            );
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory){
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for ( uint256 i=0; i < ownerTokenCount ; i++){
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success);

        emit Withdraw(balance, msg.sender);
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function whitelistAdd(address[] memory _addresslist) public onlyOwner {
        for ( uint i = 0; i < _addresslist.length; i++) {
            whitelist[_addresslist[i]] = true;
        }
    }

}
