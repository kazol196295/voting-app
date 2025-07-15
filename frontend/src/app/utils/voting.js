import { ethers } from "ethers";
// go up utils → app → src  (= 3 levels) then into artifacts
import Voting from "../../../../artifacts/contracts/Voting.sol/Voting.json";

export const getVotingContract = async () => {
    //metamask
    //getting the contrct 
    if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x749c0efAb16278951859A78E9B3edCD90Dfb77CC";
    const abi = Voting.abi;
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return {contract,signer};
  } else {
    throw new Error('MetaMask not detected');
  }

}

