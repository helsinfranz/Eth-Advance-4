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
import accountABI from "../artifacts/contracts/SimpleAccount.sol/SimpleAccount.json";
import { useRouter } from "next/router";

export default function SendFunds() {
	const router = useRouter();
	// env variables are initalised
	// contractAddress is deployed smart contract addressed
	const contractAddress = process.env.ACCOUNT_FACTORY_ADDRESS;
	// application binary interface is something that defines structure of smart contract deployed.
	const abi = contractABI.abi;
	const accountAbi = accountABI.abi;

	// hooks for required variables
	const [provider, setProvider] = useState();
	const [account, setAccount] = useState();
	const [balance, setBalance] = useState();
	const [formData, setFormData] = useState({
		recipient: "0x0000000000000000000000000000000000000000",
		amount: 0,
	});
	const [loader, setLoader] = useState(false);

	const handleInput = (e) => {
		const fieldName = e.target.id;
		const fieldValue = e.target.value;
		setFormData((prevState) => ({
			...prevState,
			[fieldName]: fieldValue,
		}));
	};

	const submitForm = async (e) => {
		setLoader(true);
		e.preventDefault();
		//Proces data and create organization
		const recipient = formData.recipient;
		const amount = formData.amount;
		if (balance <= 0) {
			alert("Insufficient Balance");
			setLoader(false);
			return;
		}
		if (recipient && amount) {
			const signer = provider.getSigner();
			const smartContract = new ethers.Contract(account, accountAbi, provider);
			const contractWithSigner = smartContract.connect(signer);
			const tx = await contractWithSigner.withdrawDepositTo(
				recipient,
				// ethers.utils.parseEther(amount) // // //
				amount
			);
			const response = await tx.wait();
			router.push("/");
		} else {
			alert("Please Fill All Fields");
		}
		setLoader(false);
	};

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
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
			/>
			<div className="m-6 space-y-4">
				<h1 className="text-black-700 text-5xl font-bold text-center mt-40">
					<a href="/">Smart Contract Wallet</a>
				</h1>
				{account ? (
					<div className="flex flex-col items-center justify-center">
						<h1 className="text-black-700 text-3xl font-bold text-center m-8">
							Send Funds
						</h1>
						<h1 className="text-green-700 text-3xl font-bold text-center m-8">
							<span>Account Address: {account.slice(0, 20)}...</span>
						</h1>
						<h1 className="text-green-500 text-3xl font-bold text-center m-8">
							<span>
								Balance: {balance} WEI
							</span>
						</h1>
						<form class="w-6/12" method="post">
							<div class="flex flex-wrap -mx-3 mb-6">
								<div class="w-full md:w-1/2 px-3">
									<label
										class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
										for="tokenSymbol"
									>
										Recipient
									</label>
									<input
										class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
										id="recipient"
										type="text"
										onChange={handleInput}
										placeholder="0x00000..."
									/>
								</div>
								<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
									<label
										class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
										for="tokenName"
									>
										Amount
									</label>
									<input
										class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
										id="amount"
										type="text"
										placeholder="0 WEI"
										onChange={handleInput}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1">
								<button
									class="flex bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded justify-center my-5"
									type="button"
									onClick={submitForm}
								>
									{loader ? (
										<svg
											className="animate-spin m-1 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75 text-gray-700"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									) : (
										<span>Submit</span>
									)}
								</button>
							</div>
						</form>
					</div>
				) : (
					<>
						<h1 className="text-red-700 text-5xl font-bold text-center !mb-20">
							Account doesn't exist
						</h1>
						<button
							className="flex bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-xl font-bold text-center justify-center w-2/12 mx-auto"
							onClick={() => router.push("/")}
						>
							Go Back
						</button>
					</>
				)}
			</div>
		</>
	);
}
