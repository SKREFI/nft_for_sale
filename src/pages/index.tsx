import MetaMaskButton from "../components/ConnectMetamaskButton";
import { useEthContext } from "../context/EthereumContext";
import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import NFTTile from "../components/NFTTile";
import { currentChainInfo } from "../constants/addresses";

type NftItem = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
};

export default function Home() {
  const { accounts, provider, currentAcc } = useEthContext();
  const [nfts, setNfts] = useState<Array<NftItem>>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (!currentAcc) { return }
    fetch50();
  }, [currentAcc]);

  const fetch50 = async () => {
    const { data }: any = await axios.get(
      `${currentChainInfo.apiDomain}/v0.1/nft/items/all`
    );

    setIsLoading(false);

    let nfts: Array<NftItem> = data.items.map((item) => {
      return {
        id: item.id,
        name: item.meta.name,
        imageUrl: item.meta.image?.url.ORIGINAL,
        description: item.meta.description,
      };
    });

    setNfts(nfts);
  };

  const handleConnectWallet = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  return (
    <div className="flex items-center min-h-screen w-full justify-center relative">
      <main>
        {!currentAcc && (
          <MetaMaskButton onClick={ handleConnectWallet } accounts={accounts} />
        )}

        {currentAcc && isLoading && (
          <div className="w-full h-full flex items-center justify-start flex-col">
            <Loader type="TailSpin" color="#000" height={50} width={50} />
            <p className="mt-10">Loading...</p>
          </div>
        )}

        {currentAcc && !isLoading && (
          <div className="w-full h-full flex items-center justify-start flex-wrap">
            {nfts && nfts.length > 0 
              ? nfts.map((nft) => {
                  return (
                    <NFTTile
                      name={nft.name}
                      id={nft.id}
                      imgSrc={nft.imageUrl}
                      key={nft.id}
                    />
                  );
                })
              : "Something went wrong. Fetched 0 NFTs."}
          </div>
        )}
      </main>
    </div>
  );
}
