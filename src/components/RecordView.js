import React, { useEffect, useState } from "react";
import { useReactMediaRecorder  } from "react-media-recorder";
import Web3 from 'web3'
import Video from '../abis/Video.json'

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';

import './RecordView.css';

const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

function RecordView() {
    const [web3Load, setWeb3Load] = useState('');
    const [btnStatus, setBtnStatus] = useState(true);
  
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
  
  
    const {
      status, 
      startRecording,
      stopRecording,
      mediaBlobUrl,
    } = useReactMediaRecorder({ screen: true, audio: true });

    const shareVideo = async () =>  {
      const web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
     // this.setState({ account: accounts[0] })
     const account = accounts[0]
  
      const networkId = await web3.eth.net.getId()
      const networkData = Video.networks[networkId]
      if(networkData) {
        const abi = Video.abi
        const address = networkData.address
        const contract = new web3.eth.Contract(abi, address)
        console.log('test1')
        const data = await fetch(mediaBlobUrl);
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
    

    function Do_stop(){
      stopRecording();
      setBtnStatus(false);
    }

    function downloadVideo(){
      var FileSaver = require('file-saver');
      FileSaver.saveAs(mediaBlobUrl, "test.mp4");

    }
 // <p>{status}</p>
    return (
      <div className="main_div">
        <Box p={3} color="secondary" className="header_css" style={{backgroundColor: "#2C394B"}}>
        <ButtonGroup color="primary"
      aria-label="outlined secondary button group">
          <Button  variant="contained" onClick={startRecording}>Start Recording</Button>
          <Button  variant="contained" onClick={Do_stop}>Stop Recording</Button>
          <Button  variant="contained" onClick={downloadVideo} disabled={btnStatus}>Save video</Button>
          <Button  variant="contained" onClick={shareVideo} disabled={btnStatus}>Share video</Button>
          </ButtonGroup>
          <Button variant="contained" href="/">HOME</Button>
        </Box>

        <Box p={2}></Box>
        <video className="video_css" src={mediaBlobUrl} controls autoPlay loop/>
 
        
      </div>
    );
  };
export default RecordView;
