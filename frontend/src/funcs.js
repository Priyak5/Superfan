import uploadMediaJSON from "../src/uploadMediaABI.json";
import { ethers } from "ethers";
import contract from "@truffle/contract";
import Web3 from "@truffle/contract/node_modules/web3";

const contractAddress = "0xDa1D81e482704c917589b651073A0C5e4b2f5b9A";

export const startPayment = async (price, setError) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3 = new Web3(Web3.givenProvider);
    const signer = provider.getSigner();
    const theContract = new web3.eth.Contract(
      uploadMediaJSON,
      "0xDa1D81e482704c917589b651073A0C5e4b2f5b9A"
    );

    const sendPrice = price * 10 ** 18;
    const tx = {
      value: sendPrice,
    };
    const transaction = await theContract.methods.purchaseSubscription();
    const signed_tx = await signer.sendTransaction({
      value: ethers.utils.parseEther(price),
    });
    console.log(signed_tx);
    const finaltx = web3.eth.sendSignedTransaction(signed_tx);
    console.log(finaltx);
  } catch (err) {
    setError(err.message.slice(0, 18));
  }
};
