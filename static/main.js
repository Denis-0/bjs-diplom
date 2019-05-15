'use strict';


class Profile {
	constructor({username, name, password}) {
		this.username = username;
		this.name = name;
		this.password = password;
		this.wallet = {};
		
	}

	createUser(callback) {
		return ApiConnector.createUser(
		{
			username: this.username,
			name: this.name,
			password: this.password,
		}, 
		(err, data) => {
			console.log(`Creating user ${this.username}`);
			callback(err, data);
		}
		);
	}

	loginUser(callback) {
		return ApiConnector.performLogin(
		{
			username: this.username, password: this.password
		},
		(err, data) => {
			console.log(`Authorizing user ${this.username}`);
			callback(err, data);
		}
		);

	}

	addMoney({currency, amount}, callback) {
		if (this.isLogged === true) {
			console.log(`Adding ${amount} of ${currency} to ${this.username}`);

			return ApiConnector.addMoney({currency, amount}, (err, data) => {
				if (data) {
					this.wallet[currency] = amount;
					console.log(`Added ${amount} of ${currency} to ${this.username}`);
					callback();
				} else {
					console.log(`Error during adding money to ${this.name.firstName}`);
				}
			});
		}
	}

	convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {        
		console.log(`Converting ${fromCurrency} to ${targetAmount} Netcoins`);

		let currencyChange = (targetAmount * stocks[99][`NETCOIN_${fromCurrency}`]);
		if (currencyChange > this.wallet[fromCurrency]) {
			console.log(`Error during converting money: not enough money to complete`);

		} else {
			return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
				if (data) {
					this.wallet[fromCurrency] = this.wallet[fromCurrency] - currencyChange;
					this.wallet[targetCurrency] = targetAmount;

					let file1 = 'Converted to coins';
					let file2 = {
						name: this.name,
						wallet: this.wallet,
						username: this.username,
					}
					console.log(file1, file2);

					callback();
				} else {
					console.log(`Error during converting money`);
				}
			});
		}        
	}

	transferMoney({to, amount}, callback) {
		console.log(`Transfering ${amount} of Netcoins to ${to}`);

		if (amount <= this.wallet.NETCOIN) {
			return ApiConnector.transferMoney({to, amount}, (err, data) => {
				if (data) {
					this.wallet.NETCOIN = this.wallet.NETCOIN - amount;

					callback({to, amount});
				} else {
					console.log(`Error during transfering money`);
				}
			});
		} else {
			console.log(`Not enough money to complete the operation`);
		}
	}
}

let stocks = [];

function getStocks(callback) {
	return ApiConnector.getStocks((err, data) => {
		console.log(`Getting stocks info`);

		if (data) {
			for (let i = 0; i < data.length; i++) {
				stocks[i] = data[i];
			}
			callback();
		} else {
			console.log(`Error during getting Stocks info`);
		}  
	});
}

getStocks(function() {
	
});

function main() {
	const Ivan = new Profile({
		username: 'ivan',
		name: {firstName: 'Ivan', lastName: 'Chernyshev'},
		password: 'ivanpass',
	});

	const Petya = new Profile({
		username: 'petya',
		name: {firstName: 'Petya', lastName: 'Chernyshev'},
		password: 'petyapass',
	});

	Ivan.createUser(function(){
		Ivan.loginUser(function(){
			Ivan.addMoney({currency: 'EUR', amount: 500000}, (err, data) => {
				if (err) {
					console.error('Error during adding money to Ivan');
				} else {
					console.log(`Added 500000 euros to Ivan`);
				}

			});
		});
	});


// Ivan.createUser(function() {
//         Ivan.performLogin(function() {
//             Ivan.addMoney({currency: 'EUR', amount: 500000}, function() {
//                 Ivan.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: 2000}, function() {
//                     Petya.createUser(function() {
//                         Ivan.transferMoney({to: 'petya', amount: 1000}, function({to, amount}) {                            
//                             if (Petya.wallet.NETCOIN > 0) {                                      
//                                 Petya.wallet.NETCOIN += amount;                                  
//                             } else {
//                                 Petya.wallet.NETCOIN = amount;                                   
//                             }                                               
//                             console.log(`${Petya.name.firstName} has got ${amount} NETCOINS`);   
//                         });
//                     });
//                 });
//             });
//         });
//     });
}
main();