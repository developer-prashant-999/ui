import {FACEMESH_TESSELATION,POSE_CONNECTIONS,HAND_CONNECTIONS, Holistic} from "@mediapipe/holistic";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
function App() {
  // console.log(faceLandmarks);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const connect = window.drawConnectors;
  
  var camera = null;
  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.segmentationMask, 0, 0,
    canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.fillStyle = "rgba(0, 0, 0, 0.2)"
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';
    connect(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                  {color: '#00FF00', lineWidth: 4});
    connect(canvasCtx, results.poseLandmarks,
    {color: '#FF0000', lineWidth: 2});
    connect(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    {color: '#CC0000', lineWidth: 1});
    connect(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
    {color: '#CC0000', lineWidth: 5});
    connect(canvasCtx, results.leftHandLandmarks,
    {color: '#00FF00', lineWidth: 2});
    connect(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
    {color: '#00CC00', lineWidth: 5});
    connect(canvasCtx, results.rightHandLandmarks,
    {color: '#FF0000', lineWidth: 2});
    canvasCtx.restore();
    // console.log(results);
  }
  // }

  // setInterval(())
  useEffect(() => {
    const holistic = new Holistic({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    holistic.onResults(onResults)

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720
      });
      camera.start();
    }
  }, []);
  return (
    <center>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
      </div>
    </center>
  );
}

export default App;