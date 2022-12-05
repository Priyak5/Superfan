import uploadMediaJSON from "../src/creator_nft.json";
import { ethers } from "ethers";
import contract from "@truffle/contract";
import Web3 from "@truffle/contract/node_modules/web3";
import { toast } from "react-toastify";
import { useState } from "react";

// import json
// from web3 import Web3

// with open("./build/contracts/CreatorNFT.json") as f:
//     res = json.load(f)
//     abi_dict = res["abi"]

// w3 = Web3(Web3.HTTPProvider("https://beta-rpc.mainnet.computecoin.com/"))
// contract = w3.eth.contract(address="0xDa1D81e482704c917589b651073A0C5e4b2f5b9A", abi=abi_dict)

// public_key = "0x50d8fEaA211C96579C2A2851Cc895779FfE26A39"
// private_key = "fd0fe231a867186b3ef70fac4a09cc31f59d20bcab166d005fe47183f1b20ccb"

// nonce = w3.eth.get_transaction_count(public_key)

// transaction = contract.functions.purchaseSubscription().buildTransaction({
//     'gas': 70000,
//     'gasPrice': w3.toWei('1', 'gwei'),
//     'value': 400000000000000,
//     'from': public_key,
//     'nonce': nonce
// })

// signed_txn = w3.eth.account.signTransaction(transaction, private_key=private_key)
// tx = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
// print(tx)

const sendTransactions = async (contract, price) => {
  const x = 10 ** 18;
  const p = price * x;
  return contract.methods.purchaseSubscription().send({ value: p });
};

export const startPayment = async (
  price,
  setError,
  contractAddress,
  getProfileData,
  setIsSuccess
) => {
  setError("");
  // try {
  let selectedAccount;
  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install it.");

  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    await provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }
  const web3 = new Web3(provider);
  const tx = {
    gas: 7000000,
    gasPrice: 1 * 10 ** 10,
    from: selectedAccount,
    from: selectedAccount,
  };

  const contract = new web3.eth.Contract(uploadMediaJSON, contractAddress, tx);
  contract.methods.purchaseSubscription().encodeABI();

  // web3.eth.accounts.signTransaction(tx).then((signed) => {
  //   web3.eth
  //     .sendSignedTransaction(signed.rawTransaction)
  //     .on("receipt", console.log);
  // });

  sendTransactions(contract, price)
    .then((resp) => {
      console.log(resp);
      setIsSuccess(true);
    })
    .catch((err) => {
      console.log(err);
      setError("Subscription failed, please try again");
      toast.error(err.message, {
        toastId: "failed_to_purchase_2",
        style: {
          background: "#FBF6F7",
          border: "1px solid #EF4F5F",
          borderRadius: "4px",
          fontSize: "14px",
          color: "#EF4F5F",
        },
      });
    });
  // } catch (err) {
  //   toast.error(err.message, {
  //     toastId: "failed_to_purchase",
  //     style: {
  //       background: "#FBF6F7",
  //       border: "1px solid #EF4F5F",
  //       borderRadius: "4px",
  //       fontSize: "14px",
  //       color: "#EF4F5F",
  //     },
  //   });
};

// const startDeposit = async (amount, contractAddress) => {
//   let signer;
//   let provider;

//   // library -> Metamask eth provider library
//   // vault id -> coin vault Id
//   // amount -> user entered amount
//   // selectedData -> individual coin configuration data

//   if (library) {
//     provider = new ethers.providers.Web3Provider(library?.provider);
//     signer = library.getSigner();
//   }

//   let stark_contract_final = new ethers.Contract(
//     contractAddress, // mainnet ->  '0x1390f521A79BaBE99b69B37154D63D431da27A07' : testnet -> '0x87eB0b1B5958c7fD034966925Ea026ad8Bf3d6dD'
//     uploadMediaJSON, // abi_file.json
//     signer // provider signer
//   );

//   const parsedAmount = ethers.utils.parseEther(amount);

//   const quanitizatedAmount = ethers.utils.parseUnits(
//     amount?.toString(),
//     Number(selectedData?.quanitization)
//   );

//   let gwei = ethers.utils.formatUnits(parsedAmount, "gwei");

//   try {
//     let overrides = {
//       value: parsedAmount,
//     };

//     let purchase_subscription_response;

//     purchase_subscription_response =
//       await stark_contract_final.purchaseSubscription();

//     let tx_backend_feed = {
//       amount: quanitizatedAmount,
//       deposit_blockchain_hash: purchase_subscription_response["hash"],
//       deposit_blockchain_nonce: purchase_subscription_response["nonce"],
//     };

//     return tx_backend_feed;
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };
