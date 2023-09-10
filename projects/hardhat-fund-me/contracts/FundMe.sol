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
    17. constant and immutable are keywords which ensure that a variable cannot be changed. Helps lessen the gas
    18. We can add constant keyword if the variable declared is constant from compile time
    19. Nice habit to have immutable variable names start with i_
    20. We can do custom errors in Solidty above 0.8.4
    21. revert does exactly what require does without checking any conditionals.
    22. recieve() and fallback() are special functions that we can use when someone does not call any functions but still sends token to our contract through let's say a wallet like Metamask.
    23. For constant keyword, we have to know value while writing code. For immutable keyword, we can assign the value dynamically only once in the constructor.
    24. We can make custom errors in Solidity from version 0.8.4. The problem with revert("some string") is that more expensive and also not dynamic. Custom errors are gas efficient and have dynamic nature. We declare the custom error using "error" keyword and then use revert SomeError() to call that error.
    25. There is a Solidity style guide where you usually structure your code according to a particular style, the order usually is: SPDX License Identifier --> Soliidity compiler version --> Imports --> Error codes --> Interfaces, Libraries and Contracts. Inside each contract, library or interface, the order should be Type declarations, State variables, Events, Modifiers, Functions. The order of functions should be: constructor, receive, fallback, external, public, internal, private, view/pure
    26. NatSpec: Natural Language Specification Format (inspired by Doxygen). With NatSpec, we can automatically generate documentation
    27. When we have variables that are global or stay in the code permanently, they're stuck in "storage"
    28. Think of storage as a big array of these variables that we create where each slot is 32 bytes long and data is stored in hexadecimal
    29. For dynamic values like mapping and dynamic arrays, elements inside the array or mapping are stored using a hashing function.
    30. For arrays, a sequential storage spot is taken up for the length of the array. For mappings, a sequential storage spot is taken but left blank.
    31. Constants and immutable variables are not stored in storage as they are part of the bytecode of the contract itself.
    32. When we have variables in a function, they only persist when the function is run. They don't get added to storage.
    33. Reading and writing to storage is expensive in terms of gas.
    34. Gas is calculated using the opcodes in bytecode of the contract.
    35. Prefix storage variables with s_ 
    36. Mappings cannot be in memory.

*/

import "./PriceConverter.sol";

error FundMe__NotOwner();

/** @title A contract for crowd funding
  * @author Shobhit Nagpal
  * @notice This contract is to demo a sample funding contract
  * @dev This implements price feeds as our library
    
*/

contract FundMe {

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmtFunded;

    address private immutable i_owner;

    AggregatorV3Interface public s_priceFeed;
    
    modifier onlyOwner {
        //  require(msg.sender == i_owner, "Sender is not owner");

        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }


    constructor(address priceFeedAddr) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddr);
    }

    // If someone ETH to this contract without using the fund function, we wouldn't be able to keep track of the funder as we stated in fund function.
    //To solve that:
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(msg.value.getConversion(s_priceFeed) >= MINIMUM_USD, "Value is less than the minimum");
        s_funders.push(msg.sender);
        s_addressToAmtFunded[msg.sender] = msg.value;

    }


    function withdraw() public onlyOwner {

            for (uint256 funderIndex = 0 ; funderIndex < s_funders.length ; funderIndex++) {
                address funder = s_funders[funderIndex];
                s_addressToAmtFunded[funder] = 0;
            }

            s_funders = new address[](0);

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

     function cheaperWithdraw() public payable onlyOwner {

         address[] memory funders = s_funders;

        for(uint256 fundersIndex = 0 ; fundersIndex < funders.length ; fundersIndex++) {
            address funder = funders[fundersIndex];
            s_addressToAmtFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call fail");
     }

     function getOwner() public view returns (address) {
        return i_owner;
     }

     function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
     }

     function getAddressToAmtFunded(address funder) public view returns (uint256) {
        return s_addressToAmtFunded[funder];
     }

     function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
     }

}
