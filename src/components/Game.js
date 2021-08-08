import React, { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import './Game.css';

import Web3 from 'web3'
import Video from '../abis/Video.json'
import ButtonGroup from '@material-ui/core/ButtonGroup';

const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="value">Start!</div>;
    }

    var textSupport = "You are light";
    var textSupport2 = "rectangle";

    if (remainingTime < 6 && remainingTime > 3){
      textSupport = "Avoid green";
      textSupport2 = "rectangles"
    }

    if (remainingTime < 4){
      textSupport = "Use awsd";
      textSupport2 = "to move"
    }
  
    return (
      <div className="timer">
        <div className="text">{textSupport}</div>
        <div className="value">{remainingTime}</div>
        <div className="text">{textSupport2}</div>
        
      </div>
    );
  };


  function FirstComponent(){
    const [key, setKey] = useState(0);
    function openGame(){
        console.log("open game")
        var hangoutButton = document.getElementById("btn_game_start");
        hangoutButton.click();
      }
      
    return (
        <div className="main_div">
          <h1>
            Canvas game will start soon
          </h1>
          <div className="timer-wrapper">
            <CountdownCircleTimer 
              key={key}
              isPlaying
              duration={10}
              colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
              onComplete={openGame}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
          <Box p={2}></Box>
          <Button variant="contained" color="primary" id="btn_game_start"
              href="/canvas_game">Start game</Button>
        </div>
      );
  }

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
        const data = await fetch(props.src);
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
      FileSaver.saveAs(props.src, "NFT_Game_Recording.mp4");

    }

    return (
      <div className="main_div">
        <Box p={3} color="secondary" className="header_css" style={{backgroundColor: "#57837B"}}>
          <Button variant="contained" href="/">HOME</Button>
        <ButtonGroup color="primary"
      aria-label="outlined secondary button group">
        
          <Button  variant="contained" onClick={downloadVideo}>Save video</Button>
          <Button  variant="contained" onClick={shareVideo}>Share video</Button>
          </ButtonGroup>
          
          <Button variant="contained" color="secondary" href="/canvas_game">Restart Game</Button>
        </Box>

        <Box p={2}></Box>
        <video className="video_css" src={props.src} controls autoPlay loop/>
        
        </div>
      );
  }
export default function Game (props) {

  let componentDefault = <FirstComponent/>

  if (props && props.location && props.location.state && props.location.state.repeat){
    componentDefault = <SecondComponent src={props.location.state.link}/>
  }
  return (
    <div className="main_div">
        {componentDefault}
    </div>
  );
}