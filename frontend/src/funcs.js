import uploadMediaJSON from "../src/creator_nft.json";
import { ethers } from "ethers";
import contract from "@truffle/contract";
import Web3 from "@truffle/contract/node_modules/web3";
import { toast } from "react-toastify";
import { useState } from "react";

const sendTransactions = async (contract, price) => {
  return contract.methods.purchaseSubscription().send({ value: price });
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
