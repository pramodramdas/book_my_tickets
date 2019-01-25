const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  	networks: {
      	ganache: {
           	host: "localhost",
           	port: 7545,
           	network_id: "*" // Match any network id
		},
		rinkeby: {
			provider: function() {
					return new HDWalletProvider(
					"story goddess hazard useless family powder tumble flame vintage hurt wink swear",
					"https://rinkeby.infura.io/t8faM9nlHNmoxTt1lczp"
				)
			},
			network_id: 3
		}
	}
};
