const Web3 = require('web3');
const Tx = require("ethereumjs-tx").Transaction;
const Common = require('ethereumjs-common').default;

const web3 = new Web3("https://wallet.kepeng.digital/");

const idrk_abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "dst",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
];

async function viewBalanceKoin(address){
	web3.eth.getBalance(address).then(console.log);
}

async function viewBalanceToken(address){
	let contract = new web3.eth.Contract(idrk_abi,"0xB6668CbED4E230C38FcA563B868aA982f00870B7");
	balance = await contract.methods.balanceOf(address).call();
  	console.log(balance);
}

async function sendKoin(privkey, from, to, value){
	const account = web3.eth.accounts.privateKeyToAccount(privkey);
	web3.eth.accounts.wallet.add(account);
	web3.eth.sendTransaction({
	    from: from,
	    to: to,
	    value: value,
	    gas: 3000000,
	    gasPrice: 18e9,
	}, (e,h)=>{
		console.log(e);
		console.log(h);
	})
}

async function sendToken(fromAddress, formPrivate, to, value){
  
  	const customCommon = Common.forCustomChain(
        'mainnet',
        {
            name: 'hepeng',
            networkId: 57585758,
            chainId: 57585758,
        },
        'istanbul',
    );

  	var myAddress = fromAddress;
	var destAddress = to;
	
	var transferAmount = value;
	var count = await web3.eth.getTransactionCount(myAddress);
  	
	var contractAddress = "0xB6668CbED4E230C38FcA563B868aA982f00870B7";
  	var contract = new web3.eth.Contract(idrk_abi, contractAddress, { from: myAddress });
	
	var balance = await contract.methods.balanceOf(myAddress).call();
  	console.log(`Balance before send: ${balance}`);

  	var rawTransaction = {
      	"from": myAddress,
      	"nonce": "0x" + count.toString(16),
      	"gasPrice": "0x003B9ACA00",
      	"gasLimit": "0x250CA",
      	"to": contractAddress,
      	"value": "0x0",
      	"data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
      	"chainId": 57585758
  	};

  	var privKey = new Buffer.from(formPrivate, 'hex');
  	var tx = new Tx(rawTransaction, { common: customCommon });
  	tx.sign(privKey);
  	var serializedTx = tx.serialize();
	
	console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
  	var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  	console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
	
	balance = await contract.methods.balanceOf(myAddress).call();
  	console.log(`Balance after send: ${balance}`);
}

viewBalanceKoin("0x924E52fD88F199dF584cC098Ec5005efa93AB113");
//viewBalanceToken("0x216c5345f37E2180ed4EA32775C67d2f3eAA2F30");


(async function () {
	//viewBalanceKoin("0x924E52fD88F199dF584cC098Ec5005efa93AB113");
	//viewBalanceToken("0x216c5345f37E2180ed4EA32775C67d2f3eAA2F30");
	//sendKoin('0xb9fb6bf592210140b2b8e9928493256bf7934d55f879d06b8e95817c7e13ef5a', '0x924E52fD88F199dF584cC098Ec5005efa93AB113', '0x216c5345f37E2180ed4EA32775C67d2f3eAA2F30', '1000000000000000000')
	//sendToken('0x924E52fD88F199dF584cC098Ec5005efa93AB113', 'b9fb6bf592210140b2b8e9928493256bf7934d55f879d06b8e95817c7e13ef5a', '0x216c5345f37E2180ed4EA32775C67d2f3eAA2F30', '2000000000000000000')
}) ();

