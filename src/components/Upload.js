import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import Web3 from 'web3'
import Video from '../abis/Video.json'
import ButtonGroup from '@material-ui/core/ButtonGroup';


import './Upload.css';
const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const FirstComponent  = ({ parentCallback }) => {
    const preventDefaults = e => {
        e.preventDefault();
        e.stopPropagation();
      };
    
      const highlight = () => {
        const ele = document.querySelector(".upload-label");
        if (ele) {
         // ele.style.backgroundColor = "#e9e9e9";
          ele.style.border = "2px dotted #999";
        }
      };
    
      const unHightLight = () => {
        const ele = document.querySelector(".upload-label");
        if (ele) {
          //ele.style.backgroundColor = "#f6f6f6";
          ele.style.border = "unset";
        }
      };
    
      const handleDrop = e => {
        const dt = e.dataTransfer;
        const { files } = dt;
        handleFiles(files);
      };
    
      const handleFiles = files => {
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
       // parentCallback(URL_data);
      reader.onloadend = function() {
        parentCallback(reader.result);
         /* let img = document.createElement("img");
          img.src = reader.result;
          img.className = "image";
          document.getElementById("drop-area").appendChild(img);/* */
        }; 
      };

    useEffect(() => {
        const dropArea = document.getElementById("drop-area");
        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
          dropArea.addEventListener(eventName, preventDefaults, false);
        });
    
        ["dragenter", "dragover"].forEach(eventName => {
          dropArea.addEventListener(eventName, highlight, false);
        });
    
        ["dragleave", "drop"].forEach(eventName => {
          dropArea.addEventListener(eventName, unHightLight, false);
        });
    
        dropArea.addEventListener("drop", handleDrop, false);
    }, []);
      
    return (
        <div id="drop-area" className = "video_css">
        <input
          type="file"
          id="fileElem"
          accept="video/*"
          onChange={e => {
            handleFiles(e.target.files);
          }}
        />
        <label className="upload-label" htmlFor="fileElem">
          <div className="upload-text">Drag video here or click to upload</div>
        </label>
        
      </div>
      );
  }
//<div className="image" />
function SecondComponent(props){
    const [web3Load, setWeb3Load] = useState('');
  
    useEffect(() => {
      if (!web3Load) {
          getToken();
      }
    }, []);

    const getToken = async () => {
      await loadWeb3()
    };

    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    };

    return (
        <video className="video_css" src={props.src} controls autoPlay loop/>
      );
  }

export default function UploadVideo() {
    const [videoData, setVideoData] = useState('');
    const [btnStatus, setBtnStatus] = useState(true);

    const shareVideo = async () =>  {
      const web3 = window.web3
      if (web3 === undefined){
        window.alert('Wallet not found.')
        return;
      }
      // Load account
      const accounts = await web3.eth.getAccounts()
     // this.setState({ account: accounts[0] })
     const account = accounts[0]



     //let blob = await fetch(props.src).then(r => r.blob());
  
      const networkId = await web3.eth.net.getId()
      const networkData = Video.networks[networkId]
      if(networkData) {
        const abi = Video.abi
        const address = networkData.address
        const contract = new web3.eth.Contract(abi, address)
        const data = await fetch(videoData);
        const blob = await data.blob();
        var buffer = await new Response(blob).arrayBuffer();  
        console.log('test0' + buffer)
      //  this.setState({ contract })
      if (buffer){
        try{
          const postResponse = await ipfs.add(buffer) 
          if (postResponse && postResponse.path){
            contract.methods.mint(postResponse.path).send({ from: account })
            .once('receipt', (receipt) => {
        
            })
          }
          console.log("postResponse", postResponse);
        } catch(e){
          console.log("Error: ", e)
        }
      } else{
        alert("No files submitted. Please try again.");
        console.log('ERROR: No data to submit');
      }
        
      
      } else {
        window.alert('Smart contract not deployed to detected network.')
      }
      
    };

    const downloadVideo = async() =>{
      var FileSaver = require('file-saver');
      FileSaver.saveAs(videoData, "NFT_Video_Recording.mp4");

    }

    const changeVideoData = (data) => {
      setVideoData(data);
      setBtnStatus(false);
    }

    const newVideo = () => {
      setVideoData('');
      setBtnStatus(true);
    }

    let componentDefault = <FirstComponent parentCallback={changeVideoData}/>

    if (videoData != ''){
        componentDefault = <SecondComponent src={videoData}/>
    }

    return (
      <div className="main_div">
        <Box p={3} color="secondary" className="header_css" style={{backgroundColor: "#57837B"}}>
        <Button variant="contained" href="/">HOME</Button>
        <ButtonGroup color="primary" aria-label="outlined secondary button group">
          <Button  variant="contained" onClick={downloadVideo} disabled={btnStatus} >Save video</Button>
          <Button  variant="contained" onClick={shareVideo} disabled={btnStatus} >Share video</Button>
          
        </ButtonGroup>
        <Button  variant="contained" onClick={newVideo} disabled={btnStatus}>New video</Button>
      </Box>

      <Box p={2}></Box>
      {componentDefault}
      
      </div>
    );
  
}