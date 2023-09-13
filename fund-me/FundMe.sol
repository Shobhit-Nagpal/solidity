//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Aim: Get funds from users, withdraw funds, Set minimum funding value in USD

/*Notes:
    1. payable is a modifier that allows a function to accept and handle Ether
    2. Smart contract can hold funds as well just like wallets
    3. 1e18 is 10 to the power of 18. 1e18 is 1eth. The monis math is done in terms of Wei
    4. require keyword is a checker. If condition is not satisfied, it reverts with an error
    5. Revert undoes any action done before and sends remaining gas back
    6. Blockchain Oracle is any device that interacts with the off-chain world to provide external data or computation to smart contracts
    7. Centralized Oracles bad cause single point of failure. Decentralized Oracles (ChainLink as example) hella nice
    8. Bruh, blockchain can't make HTTPS requests apparently. Crazy
    9. ABI is basically a translator between external applications and smart contracts which help format data so that it is readable for both the application and EVM.
    10. Interface defines a set of functions without their implementation (like a blueprint) where the developer has to specify the implentation of those functions in their smart contract. This is what interface is in ABI as well. We get to know the functions and input to functions that we can use for a smart contract.
    11. msg.value and msg.sender are global variables. msg.value gives how much native blockchain currency is being sent and msg.sender is the address of whoever calls the function (fund in this case)
    12. Decimals / floating point math doesn't work in Solidity
    13. msg.value.getConversion() is same as getConversion(msg.value) in case of library. We're sending the object as the first parameter. If there are more than one parameters, we write the other ones inside the parenthesis
    14. new address[](0) --> new array of addresses with 0 elements inside array.
    15. 3 ways to send ether to other contracts: Transfer, Send, Call ; More info here: https://solidity-by-example.org/sending-ether/
    16. Modifiers are contract-level declarations which allow us to inject reusable logic into function calls. The _; tells the function to run the rest of the code.
*/

import "./PriceConverter.sol";

contract FundMe {

    using PriceConvertor for uint256;

    uint256 public minimumUSD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmtFunded;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value.getConversion() >= minimumUSD, "Value is less than the minimum");
        funders.push(msg.sender);
        addressToAmtFunded[msg.sender] = msg.value;

    }


    function withdraw() public onlyOwner {

            for (uint256 funderIndex = 0 ; funderIndex < funders.length ; funderIndex++) {
                address funder = funders[funderIndex];
                addressToAmtFunded[funder] = 0;
            }

            funders = new address[](0);

            // //1. TRASNFER
            // //this over here refers to the smart contract
            // //msg.sender is of type address. We typecast it to payable address to be able to send a token
            // //If more than 2300 gas is required, transfer() will throw an error
            // payable(msg.sender).transfer(address(this).balance);

            // //2. SEND
            // // if more than 2300 gas is required, send() will return a bool
            // bool sendSucess = payable(msg.sender).send(address(this).balance);
            // require(sendSucess, "Send fail");


            //3. CALL
            (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
            require(callSuccess, "Call fail");

     }

     modifier onlyOwner {
         require(msg.sender == owner, "Sender is not owner");
         _;
     }

}
