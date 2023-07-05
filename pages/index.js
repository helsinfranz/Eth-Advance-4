import { ethers } from "ethers";
// A single Web3 / Ethereum provider solution for all Wallets
import Web3Modal from "web3modal";
// yet another module used to provide rpc details by default from the wallet connected
import WalletConnectProvider from "@walletconnect/web3-provider";
// react hooks for setting and changing states of variables
import { useEffect, useState } from "react";
import contractABI from "../artifacts/contracts/SimpleAccountFactory.sol/SimpleAccountFactory.json";
import { useRouter } from "next/router";

const Home = () => {
	const router = useRouter();

	const contractAddress = process.env.ACCOUNT_FACTORY_ADDRESS;
	const abi = contractABI.abi;
	const [account, setAccount] = useState();
	const [balance, setBalance] = useState();
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
				const response = await contractWithSigner.getAccAddress(addr);
				if (response != "0x0000000000000000000000000000000000000000") {
					setAccount(response);
					const response1 = await contractWithSigner.getBalance(addr);
					setBalance(response1?.toString());
				}
				return;
			}
		} catch (error) {
			console.log(error);
			return;
		}
	}

	useEffect(() => {
		initWallet();
	}, []);
	return (
		<>
			<h1 className="text-black-700 text-5xl font-bold text-center m-40">
				<a href="/">Smart Contract Wallet</a>
			</h1>
			{account ? (
				<>
					<h1 className="text-green-700 text-4xl font-bold text-center m-10">
						<span>Account Address: {account}</span>
					</h1>
					<h1 className="text-green-700 text-4xl font-bold text-center m-10">
						<span>
							Balance: {balance} WEI
						</span>
					</h1>
					<button
						className="flex bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-full text-xl font-bold text-center justify-center w-2/12 mx-auto mb-10"
						onClick={() => router.push("/add")}
					>
						Add Funds
					</button>
					<button
						className="flex bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-full text-xl font-bold text-center justify-center w-2/12 mx-auto"
						onClick={() => router.push("/send")}
					>
						Send Funds
					</button>
				</>
			) : (
				<button
					className="flex bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-full text-xl font-bold text-center justify-center w-2/12 mx-auto"
					onClick={() => router.push("/create")}
				>
					Create Account
				</button>
			)}
		</>
	);
};

export default Home;
