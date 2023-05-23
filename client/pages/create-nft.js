import { useState} from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { contractAddress,PINATA_KEY,PINATA_SECRET } from '../config';
import NFTMarketplace from '../abi/NFTMarketplace.json';
import axios from 'axios';
//import Image from 'next/image';

export default function createNFT(){
    const [fileUrl,setFileUrl] = useState(null);
    const [formInput,updateFormInput] = useState({price:'',name:'',description:''});
    const router = useRouter();
    const [loadingState,setLoadingState] = useState('not-loading');
    

    // Upload image to IPFS
    async function imageUpload(e){
        const file = e.target.files[0];
        try{

            const formData = new FormData();
            formData.append("file",file);
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers:{
                    'pinata_api_key':PINATA_KEY,
                    'pinata_secret_api_key':PINATA_SECRET,
                    'Content-Type':'multipart/form-data'
                },
            });

            const ImageURL = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            setFileUrl(ImageURL);

        }catch(e){
            console.log(e);
        }
    }
    
    // First upload metadata to IPFS and then return URL to use in later transaction
    async function uploadToIPFS(){
        const { name,description,price } = formInput;
        if(!name || !description || !price || !fileUrl) return;
        setLoadingState('loading');

        try{
            var jsondata = JSON.stringify({
                "pinataMetadata":{
                    "name":`${name}.json`,
                },
                "pinataContent":{
                    name,description,image:fileUrl
                }
            });

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: jsondata,
                headers:{
                    'pinata_api_key':PINATA_KEY,
                    'pinata_secret_api_key':PINATA_SECRET,
                    'Content-Type':'application/json'
                },
            });

            const tokenURI = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            return tokenURI;

        }catch(error){
            console.log("Error uploading file :",error);
        }
    }

    
}

