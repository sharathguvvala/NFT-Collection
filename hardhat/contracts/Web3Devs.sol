//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract Web3Devs is ERC721Enumerable, Ownable {
    string _baseTokenURI;
    IWhitelist whitelist;
    bool public presaleStarted;
    uint256 public presaleEnded;
    uint256 public maxTokenIds = 20;
    uint256 public tokenId;
    uint256 public price = 0.01 ether;
    uint256 public presalePrice = 0.005 ether;
    bool public paused;
    modifier notPaused {
        require(!paused, "smart contract currently paused");
        _;
    }
    constructor(string memory baseURI, address whitelistContract) ERC721("Web3Devs", "W3D") {
        _baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }
    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 3 hours;
    }
    function presaleMint() public payable notPaused {
        require(presaleStarted && block.timestamp < presaleEnded, "presale has ended");
        require(whitelist.whitelistedAddresses(msg.sender), "not in the whitelist");
        require(tokenId < maxTokenIds, "no NFT's to mint");
        require(msg.value >= presalePrice, "not enough amount");
        tokenId++;
        _safeMint(msg.sender, tokenId);
    }
    function mint() public payable notPaused {
        require(presaleStarted && block.timestamp >= presaleEnded, "presale has not ended");
        require(tokenId < maxTokenIds, "no NFT's to mint");
        require(msg.value >= price, "not enough amount");
        tokenId++;
        _safeMint(msg.sender, tokenId);
    }
    function _baseURI() internal view virtual override returns (string memory) {
          return _baseTokenURI;
    }
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool success,) = _owner.call{value:amount}("");
        require(success, "withdraw failed");
    }
    function setPause(bool _pause) public onlyOwner {
        paused = _pause;
    }
    receive() external payable{}
    fallback() external payable{}
}