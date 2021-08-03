import React, { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom';
import './Canvas.css'; 

export default function ComponentCanvas () {
  const [url, setURL] = useState();
  useEffect(() => {
    if (url){
      return;
    }
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const video = document.querySelector('video');
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var step = 10;
    ctx.canvas.width  = canvasWidth;
    ctx.canvas.height = canvasHeight;
  //  ctx.fillStyle = "white";
    
    //ctx.fillRect(0, 0, canvasWidth, canvasHeight);

   
    var dx = 300;
    var dy = 300;
    var randRect = [];

    var rectSize = 150;

    ctx.fillStyle = 'yellow';
    ctx.fillRect(dx, dy, rectSize, rectSize);
    ctx.fillStyle = 'red';
   /* setTimeout(() => {
      ctx.fillStyle = 'blue';
      ctx.fillRect(200, 50, 50, 50);
    }, 1000);*/

    document.addEventListener('keydown', function(event) {
      ctx.clearRect(dx, dy, rectSize, rectSize)
      if (event.key === 'a'){
        if (dx > 0){
          dx = dx - step;
        }
      }
      if (event.key === 'd'){
        if (dx + rectSize < canvasWidth){
          dx = dx + step;
        }
      }
      if (event.key === 's'){
        if (dy + rectSize < canvasHeight){
          dy = dy + step;
        }
      }
      if (event.key === 'w'){
        if (dy > 0){
          dy = dy - step;
        }
      }
        
      ctx.fillStyle = 'yellow';
      ctx.fillRect(dx, dy, rectSize, rectSize);
      ctx.fillStyle = 'red';
    });
    
    var intervalRectMove = window.setInterval(myCallback, 300);
    var intervalRectAdd= window.setInterval(rectAddCallback, 5000);

    function rectAddCallback() {
      var tempVal = [];
      tempVal.push(0);
      tempVal.push(getRandomArbitrary(0, canvasHeight - rectSize));
      randRect.push(tempVal);
    }

    var startCountRect = getRandomArbitrary(1, 3);
    for (let step = 0; step < startCountRect; step++) {
      rectAddCallback();
    }

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function gameOver(){
      var gameOverButton = document.getElementById("video_link");
      gameOverButton.click();
    }

    function myCallback() {
     // console.log(randRect)
      for (const val of randRect) { // You can use `let` instead of `const` if you like
        ctx.clearRect(val[0]-5, val[1]-5, rectSize+5, rectSize+5)
        if (val[0] + step > canvasWidth){
          randRect.splice(val, 1);
        }
        val[0] = val[0] + step;
        if (dx < val[0] + rectSize &&
            dx + rectSize > val[0]  &&
            dy < val[1] + rectSize &&
            dy + rectSize > val[1]
           ){
             window.clearInterval(intervalRectAdd);
            window.clearInterval(intervalRectMove);
            recorder.stop();
            
           }else{
              ctx.fillRect(val[0], val[1], rectSize, rectSize);
           }
      }
    }
  //   
    recorder.start();
   // setTimeout(() => recorder.stop(), 10000);
    recorder.addEventListener('dataavailable', (evt) => {
      const url = window.URL.createObjectURL(evt.data);
      setURL(url);
      gameOver();

     // 
     // video.src = url;
    });
  }, [url]);
//  <video controls></video>
  return (
    <div className="main_div">
      <canvas></canvas>
     
      <Link id="video_link" to={{
            pathname: '/game',
            state: { name: '123', repeat: true, link:  url}
        }}
      ></Link>
    </div>
  )
}