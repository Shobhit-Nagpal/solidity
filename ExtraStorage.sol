//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*Notes:
    1. ExtraStorage inherits properties from SimpleStorage
    2. To override a function of parent contract in child contract, we can use 2 keywords - override and virtual. Virtual for the function to be overriden and override for the function which will override the original one
*/

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage  {

    function store(uint256 _number) public override {
        favNumber = _number + 5;
    }

}
