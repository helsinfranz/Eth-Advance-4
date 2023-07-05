// import required modules
// the essential modules to interact with frontend are below imported.
// ethers is the core module that makes RPC calls using any wallet provider like Metamask which is esssential to interact with Smart Contract
import { ethers } from "ethers";
// A single Web3 / Ethereum provider solution for all Wallets
import Web3Modal from "web3modal";
// yet another module used to provide rpc details by default from the wallet connected
import WalletConnectProvider from "@walletconnect/web3-provider";
// react hooks for setting and changing states of variables
import { useEffect, useState } from "react";
import contractABI from "../artifacts/contracts/SimpleAccountFactory.sol/SimpleAccountFactory.json";
import { useRouter } from "next/router";

export default function CreateAccount() {
	const router = useRouter();
	// env variables are initalised
	// contractAddress is deployed smart contract addressed
	const contractAddress = process.env.ACCOUNT_FACTORY_ADDRESS;
	const [err, setErr] = useState();
	// application binary interface is something that defines structure of smart contract deployed.
	const abi = contractABI.abi;
	const [provider, setProvider] = useState();

	async function initWallet() {
		try {
			// check if any wallet provider is installed. i.e metamask xdcpay etc
			if (typeof window.ethereum === "undefined") {
				console.log("Please install wallet.");
				alert("Please install wallet.");
				return;
			} else {
				// raise a request for the provider to connect the account to our website
				const web3ModalVar = new Web3Modal({
					cacheProvider: true,
					providerOptions: {
						walletconnect: {
							package: WalletConnectProvider,
						},
					},
				});

				const instanceVar = await web3ModalVar.connect();
				const providerVar = new ethers.providers.Web3Provider(instanceVar);
				setProvider(providerVar);
				const signer = providerVar.getSigner();
				const addr = await signer.getAddress();
				// initalize smartcontract with the essentials detials.
				const smartContract = new ethers.Contract(
					contractAddress,
					abi,
					provider
				);
				const contractWithSigner = smartContract.connect(signer);
				const tx = await contractWithSigner.createAccount(
					addr,
					providerVar.getTransactionCount(contractAddress)
				);
				const response = await tx.wait();
				console.log(await response);
				router.push("/");
				return;
			}
		} catch (error) {
			console.log(error);
			setErr(error);
			return;
		}
	}

	useEffect(() => {
		initWallet();
	}, []);
	return (
		<>
			{err ? (
				<h1 className="text-red-500 text-5xl font-bold text-center m-4">
					{err.message}
				</h1>
			) : (
				<></>
			)}
		</>
	);
}
