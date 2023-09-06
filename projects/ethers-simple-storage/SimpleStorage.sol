//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

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

    function retrieve() public view returns (uint256) {
        return favNumber;
    }
}
