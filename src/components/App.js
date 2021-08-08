import './App.css';
import React, { Component, useState } from "react";
import RecordView from './RecordView';
import MainPage from './MainPage';
import Particles from 'react-particles-js';
import particlesConfig from "../components/particlesConfig.json"
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';
import Game from './Game';
import UploadVideo  from './Upload';

import { createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams
} from "react-router-dom";
import ComponentCanvas from './Canvas';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#515E63",
    },
    secondary:{
      main: "#C9D8B6"
    }
  }
});

function BackgroundGraph(){
  return(
    <Particles params={particlesConfig} className="App-particles__container"/>
  );
}

export default function App () {
    return (
      <ThemeProvider theme={theme}>
          <Router>
            <ModalSwitch />
          </Router>
      </ThemeProvider>
    );
};
// <RecordView/>

function ModalSwitch() {
  let location = useLocation();

  return (
    <div>
      <Switch location={location}>
        <Route exact path="/" children={<Home />} />
        <Route path="/record_view" children={<RecordView />} />
        <Route path="/main_page" children={<MainPage />} />
        <Route path="/canvas_game" children={<ComponentCanvas />} />
        <Route path="/game" render={(props) => <Game {...props}/>}/>
        <Route path="/upload_video" children={<UploadVideo />} />
      </Switch>
    </div>
  );
}

function Home() {
  return (
    <div>
      <BackgroundGraph/>
      <Card className="middle">
      <h2>NFT Video Recording</h2>
      <p></p>
      <ButtonGroup color="secondary"
      orientation="vertical"
      aria-label="outlined secondary button group">
      <Button variant="contained" color="primary"
          href="/game">Test canvas game</Button>
          <Box m={2} />
      <Button variant="contained" color="primary"
          href="/main_page">Video gallery</Button>
          <Box m={2} />
      <Button variant="contained" color="primary"
          href="/upload_video">Upload video</Button>
          <Box m={2} />
      <Button variant="contained" color="primary"
          href="/record_view">Screen record</Button>
          </ButtonGroup>
      </Card>
    </div>
    
  );
}