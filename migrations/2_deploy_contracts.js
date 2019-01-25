//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var BookMyTickets = artifacts.require("./BookMyTickets.sol");
//var BookMyTickets = artifacts.require("./BookMyTicketsExper.sol");

module.exports = function(deployer) {
  deployer.deploy(BookMyTickets);
};
