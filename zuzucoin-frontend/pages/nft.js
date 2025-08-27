import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("polygon"); // Chain ID: 137
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getNFTModule = () => {
  return sdk.getContract(contractAddress, "nft-collection");
};
