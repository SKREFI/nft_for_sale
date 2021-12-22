import { useEthContext } from "../../context/EthereumContext";
import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import { currentChainInfo } from "../../constants/addresses";
import { useRouter } from "next/router";
import { useSdk } from "../../utils/use-sdk";

// import Web3 from "web3";
// import { Web3Ethereum } from "@rarible/web3-ethereum"
// import { EthereumWallet } from "@rarible/sdk-wallet"

// import { createRaribleSdk } from "@rarible/sdk"
// import { IRaribleSdk } from "@rarible/sdk/build/domain";

// const ethereum = new Web3Ethereum({ web3, from })
// const ethereumWallet = new EthereumWallet(ethereum, from) 

// second parameter - is environment: "prod" | "staging" | "e2e" | "dev"
// const sdk = createRaribleSdk(ethereumWallet, "dev")

export default function Details() {
  const { accounts, provider, currentAcc } = useEthContext();
  const [nftDetails, setNftDetails] = useState<any>();
  const [sellOrder, setSellOrder] = useState<any>();
  const [nftPrice, setnftPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  let router = useRouter();
 
  let { tokenId } = router.query;

  useEffect(() => {
    if (tokenId) {
      fetchTokenData();
    }
  }, [tokenId]);

  let sdk = useSdk("prod")

  const fetchTokenData = async () => {
    // let { data } = await axios.get(
    //   currentChainInfo.apiDomain +
    //     `/protocol/v0.1/ethereum/nft/items/${tokenId}`,
    //   { params: { itemId: tokenId } }
    // );

    // 0xc9154424b823b10579895ccbe442d41b9abd96ed
    // :
    // 63121686759765895316946253801704697679735370667402128884982010395786171383809

    let tokenData = (await sdk.sdk.apis.item.getItemById({ itemId: `ETHEREUM:${tokenId as string}` }))

    // console.log("contractData: " + contractData)
    console.log("tokenData: " + tokenId)

    setNftDetails(tokenData);
    setIsLoading(false);
  };

  const handleInputChange = (event) => {
    setnftPrice(event.target.value);
  };

  const createSellOrder = () => {
    // TODO: deal with sell order

  }

  const stringify = (value: any) => {
    return JSON.stringify(value)
  }

  return (
    <div className="flex items-center p-4 min-h-screen w-full justify-center relative">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-start flex-col">
          <Loader type="TailSpin" color="#000" height={50} width={50} />
          <p className="mt-10">Loading...</p>
        </div>
      )}

      {!isLoading && (
        <main className="w-full h-full flex flex-row items-center">
          <div className="flex justify-center items-center flex-1 h-full bg-gray-100 max-h-90">
            
            { stringify(nftDetails.meta) }
            
            <p>{nftDetails.meta}</p>
            <img
              // src={nftDetails.meta.image.url.ORIGINAL}
              className="flex-shrink-0 min-w-full min-h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 items-center justify-between">
            <div className="flex flex-col items-start w-64 mb-20">
              <p className="font-bold uppercase mb-4">Details</p>
              <p>
                <b>NAME:</b> {nftDetails.meta.name}
              </p>
              <p>
                <b>DESCRIPTION:</b> {nftDetails.meta.description}
              </p>
            </div>
            <form className=" flex flex-col" onSubmit={createSellOrder}>
              {sellOrder ? (
                <p className="text-green-500 font-bold mb-6 text-center">{`Listed currently for ${
                  parseInt(sellOrder.take.value) / 10 ** 18
                } ETH ✅`}</p>
              ) : (
                <p className="text-red-500 font-bold mb-4 text-center">
                  Currently not listed ❌
                </p>
              )}
              <input
                type="text"
                value={nftPrice}
                onChange={handleInputChange}
                className=" border-2 rounded-2xl shadow-md py-2 px-4 mb-4 w-64"
                placeholder="NFT Price"
              />
              <button
                type="submit"
                className="bg-purple-700 hover:bg-purple-900 text-white rounded-2xl py-2 px-4 w-64"
              >
                Create sell order
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
