// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public favoriteNumber;
    
    struct Person {
        uint256 favoriteNumber;
        string name;
    }
    
    Person[] public listOfPeople;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }
    
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(uint256 _favoriteNumber, string memory _name) public {
        listOfPeople.push(Person(_favoriteNumber, _name));
    }
}       