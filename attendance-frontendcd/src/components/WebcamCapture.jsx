import Webcam from "react-webcam";
import { useRef } from "react";

export default function WebcamCapture({setImage}){

const webcamRef = useRef(null);

const capture = () => {

const imageSrc = webcamRef.current.getScreenshot();

setImage(imageSrc);

};

return(

<div>

<Webcam
audio={false}
ref={webcamRef}
screenshotFormat="image/jpeg"
/>

<button onClick={capture}>
Capture Face
</button>

</div>

);

}