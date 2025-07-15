import { ethers } from "ethers";
// go up utils → app → src  (= 3 levels) then into artifacts
//import Voting from "../../../../artifacts/contracts/Voting.sol/Voting.json";
//for vercel
import Voting from "../utils/Voting.json";
export const getVotingContract = async () => {
    //metamask
    //getting the contrct 
    if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0xC250BBe141bc4FC1Eb6705419F8ddD5d0483028D";
    const abi = Voting.abi;
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return {contract,signer};
  } else {
    throw new Error('MetaMask not detected');
  }

}

