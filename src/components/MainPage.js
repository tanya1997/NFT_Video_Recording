import './App.css';
import React, { Component, useState } from "react";
import Web3 from 'web3'
import Video from '../abis/Video.json'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import './MainPage.css';
import CurrencyInput from 'react-currency-input-field';

class MainPage extends Component {

    async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }
  
    async loadWeb3() {
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
    }
  
    async loadBlockchainData() {
      const web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
  
      const networkId = await web3.eth.net.getId()
      const networkData = Video.networks[networkId]
      if(networkData) {
        const abi = Video.abi
        const address = networkData.address
        const contract = new web3.eth.Contract(abi, address)
        this.setState({ contract })
        const totalSupply = await contract.methods.totalSupply().call()
        this.setState({ totalSupply })

        for (var i = 1; i <= totalSupply; i++) {
          const video_data = await contract.methods.video_list(i - 1).call()
          this.setState({
            video_list: [...this.state.video_list, video_data]
          })
        }
      } else {
        window.alert('Smart contract not deployed to detected network.')
      }
    }
  
    

    async donate(donationAddress, donateValue) {
      //var donationAddress = this.state.account;
    //  alert("test!");

      window.web3.eth.sendTransaction({
        to: donationAddress,
        from: this.state.account,
        value: window.web3.utils.toWei(''+donateValue, "ether")
      }, (err, transactionId) => {
        if (err) {
          console.log("Donation failed", err);
          alert("Donation failed.");
        } else {
          console.log("Donation successful", transactionId);
          alert("Donation successful!");
        }
      })
    }

    handleLike(id, value) {
     // alert("test!" + value);
     console.log(value, id)
      this.setState(prevState => ({
        ...prevState,
        video_list: prevState.video_list.map((video, key) => ({
          ...video,
          donateValue: key === id ? video.donateValue = value : video.donateValue
        }))
      }))
    }
    
  constructor(props) {
      super(props)
      this.state = {
        account: '',
        contract: null,
        totalSupply: 0,
        video_list: [],

      }
    }
    render() {
      return (
        <div>
           <Box p={3} color="secondary" className="header_main_css" style={{backgroundColor: "#2C394B"}}>
           
              <Button variant="contained"  href="/">HOME</Button>
              <Typography variant="subtitle1" className="header_left">{this.state.account}</Typography>
           </Box>
          <Box p={3} ></Box>
            <div className="main_div">
              { this.state.video_list.map((video_data, key) => {
                return(
                  <Card className="second_div cardview" style={{backgroundColor: "#2C394B"}}>
                    <video width="300" height="200" src={'https://ipfs.infura.io/ipfs/'+video_data.videoHash} key={key} controls loop/>
                    <h4 style={{color: "white", margin: 10, padding: 0}}>{video_data.owner}</h4>
                    <div className="second_div">
                    <CurrencyInput
                        className="input_css"
                        id="input-example"
                        name="input-name"
                        placeholder="Please enter a value"
                        defaultValue={video_data.donateValue}
                        decimalsLimit={10}
                        prefix="HT "
                        onValueChange={(value, name) => this.handleLike(key, value)}
                      />;
                        <Button  variant="contained" onClick={this.donate.bind(this, video_data.owner, video_data.donateValue)}>Donate</Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
      );
    }
  }
  
  export default MainPage;