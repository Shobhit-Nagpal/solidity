//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

/*Notes:
    1. Smart contracts have addresses just like our wallet accounts do.
    2. Anything you do in the blockchain like changing the state of the blockchain, it happens in a transaction.
    3. Default visibility is internal. (Visibitlies: public, private, external, internal).
    4. View and pure functions by themselves don't spend gas. They don't allow modification of state of blockchain. Pure functions additionally disallow reading from blockchain.
    5. If a gas calling function calls a view or pure function, then only do they spend gas.
    6. EVM can access and store information in 6 places: Stack, Memory, Storage, Calldata, Code, Logs
    7. Calldata and memory store the variable temporarily while Storage stores variable permanently.
    8. Calldata vs Memory: With memory, we can change the argument passed but with calldata we cannot do that.
    9. We add memory keyword for arrays, structures and mappings when we add them as parameters. (Remember that string is also basically an array too)
    10. EVM, Ethereum Virtual Machine

    
*/
contract SimpleStorage {

    uint256 public favNumber; //This is initialized to 0 by default.

    struct Person {
        uint256 favNumber;
        string name;
    }

    mapping(string => uint256) public nameToFavNumber;

    Person public barry = Person({favNumber: 69, name: "Barry"});

    Person[] public people; 

    function store(uint256 _favNumber) public  {
        favNumber = _favNumber;

    }


    function addPerson(string memory _name, uint256 _favNumber) public {
        people.push(Person(_favNumber, _name));
        nameToFavNumber[_name] = _favNumber;
    }
}
