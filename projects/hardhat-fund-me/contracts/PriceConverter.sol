//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/*Notes:
    1. Library are similiar to contracts except can't declare a state variable and can't send ether to it.
    2. All functions inside library need to be internal
    3. 

*/

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed) view internal returns (uint256) {

        //AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

        //We only want price, so we can remove the other return types but keep the commas
        ( , int256 price, , , ) = priceFeed.latestRoundData();

        //price is ETH price in terms of USD
        //price has 8 decimal values whereas msg.value has 18 decimal places because of different units. So let's get the decimal places to be same. Also msg.value is of type uint256 whereas price is int256, so we will perform type casting too.
        return uint256(price * 1e10);


    }

    function getConversion(uint256 ethAmt, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmtUSD = (ethPrice * ethAmt) / 1e18;
        return ethAmtUSD;
     }
}
