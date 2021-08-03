for local project build

install metamask 
	https://metamask.io/
run ganache
https://www.trufflesuite.com/ganache
	./ganache-2.5.4-linux-x86_64.AppImage

install npm packages
	npm i	
	
run truffle
	https://www.trufflesuite.com/
	truffle migrate --network developer
 
run npm
	npm start
 
 open http://localhost:3000/
 
for testnet project build

install metamask 
	https://metamask.io/
	
edit truffle.js (change mnemonic phrase)
	const mnemonicPhrase = "your phrase";

install npm packages
	npm i	
run truffle
 	truffle migrate --network testnet

run npm
 	npm start
