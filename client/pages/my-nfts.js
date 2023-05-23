import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { contractAddress } from '../config';
import NFTMarketplace from '../abi/NFTMarketplace.json';
import axios from 'axios';
import Image from 'next/image';

export default function MyNFTs(){
  const [nfts,setNfts] = useState([]);
  const [loadingState,setLoadingState] = useState('not-loaded');
  const [price,setPrice] = useState();

  useEffect(()=>{
    console.log("hi")
    loadNFTs();
  },[]);

  async function loadNFTs(){
    console.log("hi2")
        
 
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const getnetwork = await provider.getNetwork();
    const polygonChainId = 80001;
        console.log(getnetwork);
        if (getnetwork.chainId != polygonChainId) {
        alert("you are not connected to mumbai network");
        return;
        }

    // sign the transaction
    const signer = provider.getSigner();
    const marketplaceContract = new ethers.Contract(contractAddress,NFTMarketplace.abi,signer);
    console.log(marketplaceContract)
    console.log("array of NFTs");
    const data = await marketplaceContract.fetchMyNFTs();
    console.log("array of NFTs");
    const items = await Promise.all(data.map(async i => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(),'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            
        };
        return item;
    }));
    console.log(items);
    setNfts(items);
    if(!items){
      setLoadingState('loaded');
    }
    setLoadingState('loaded');
    console.log(items,"hi5");
  }

  async function resellNFT(tokenId,tokenPrice){
      setLoadingState('not-loaded');
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(contractAddress,NFTMarketplace.abi,signer);
      const price = ethers.utils.parseUnits(tokenPrice,'ether');
      let listingPrice = await marketplaceContract.getListingPrice();
      listingPrice = listingPrice.toString();
      const transaction = await marketplaceContract.resellToken(tokenId,price,{value:listingPrice});
      await transaction.wait();
      loadNFTs();
  }

  if(loadingState == 'not-loaded') return (
    <h1 className='px-20 py-10 text-3xl'>Wait Loading.......</h1>
  )

  if(loadingState == 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No NFTs owned by you</h1>
  )

  return (
    <div className='flex justify-center'>
      <div className='px-5' style={{maxWidth:'1600px'}}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4'>
            {
              nfts.map((nft,i)=>(
                <div key={i} className='border shadow rounded-xl overflow-hidden mx-7 my-5'>
                  <Image src={nft.image} alt={nft.name} width={400} height={300} placeholder="blur" blurDataURL='/placeholder.png' layout='responsive'/>
                  <div className='p-5'>
                    <p style={{height:'40px'}} className="text-2xl font-semibold">{nft.name}</p>
                    <div style={{height:'20px',overflow:'hidden'}}>
                      <p className='text-gray-400'>{nft.description}</p>
                    </div>
                  </div>
                  <div className='p-5 bg-black'>
                  <input placeholder='Resell price in Eth' className=' text-black border rounded p-2' type='number' value={price} onChange={e=>setPrice(e.target.value)}/>
                  {console.log(price,"hj",{price},"pio")}
                  <p className='text-xxl my-2  text-white'>Current price {nft.price} ETH</p>
                  <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={()=>resellNFT(nft.tokenId,price)}>Resell NFT</button>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )


}