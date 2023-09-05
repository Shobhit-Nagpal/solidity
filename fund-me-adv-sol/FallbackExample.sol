// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Notes:
    1. receive() does not take in any data whereas fallback() can take in data.
    2. If msg.data is empty, go to fallback, else go to receive. If there is no receieve function in first place, go to fallback, else go to receive
    3. 
*/

contract FallbackExample {

    uint256 public result;

    receive() external payable {
        result = 1;
    }

    fallback() external payable {
        result = 2;
    }
}
