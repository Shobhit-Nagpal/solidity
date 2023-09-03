//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*Notes:
    1. To interact with a contract, we need it's address and ABI (Application Binary Interface). We get the ABI pre packaged with the contract when we import it.
    2. SimpleStorage simpleStorage = SimpleStorage( addr of a SimpleStorage contract); is how we get an existing contract when we ONLY have its address. If we have the contracts itself in an array then the ABI is also present by default, in that case we can directly get the contract we want from the array

*/

import "./SimpleStorage.sol";

contract StorageFactory {

    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint256 _index, uint256 _number) public {
        
        //In the array, we already have the contracts and the array keeps tracks of the address and the ABI
        simpleStorageArray[_index].store(_number); 
    }

    function sfGet(uint256 _index) public view returns(uint256) {
        return simpleStorageArray[_index].retrieve();
        
    }

}
