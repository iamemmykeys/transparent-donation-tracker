pragma solidity ^0.8.28;

contract DonationTracker {
    address[] public donors;

    function donate() public payable {
        donors.push(msg.sender);
    }

    function getDonorList() public view returns (address[] memory) {
        return donors;
    }

    function totalDonations() public view returns (uint256) {
        return address(this).balance;
    }
}