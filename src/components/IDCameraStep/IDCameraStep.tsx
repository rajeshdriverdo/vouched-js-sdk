import React, {useState, useEffect, useRef} from 'react';
import ReactDom from 'react-dom';
import {CardDetectFactory, CardDetect, Instruction, Step, VouchedUtils, VouchedSession, VouchedSessionParameters} from '@vouched.id/vouched-js';
import {Button} from "@material-ui/core";
import './IDCameraStep.css'
import {useDispatch} from "react-redux";
import {setJobAction, setSessionAction} from "../../actions";

const API_KEY = process.env.REACT_APP_PUBLIC_API_KEY;
const API_URL = process.env.REACT_APP_API_URL ?? undefined;

let sessionParams : VouchedSessionParameters = { apiKey: API_KEY! };
if (API_URL) {
    sessionParams.apiUrl = API_URL
}

const IDCameraStep: React.FC<{ nextButtonClicked: () => void, previousButtonClicked: () => void, arrIndex: number, setArrIndex: React.Dispatch<React.SetStateAction<number>> }> = ({nextButtonClicked, previousButtonClicked}) => {
    const [cardDetect, setCardDetect] = useState<CardDetect>();
    const [isVideoReady, setVideoReady] = useState<boolean>(false);
    const [localstream, setLocalStream] = useState<MediaStream>();
    const [instructionMessage, setInstructionMessage] = useState<string>("");
    const [nextButtonShow, setNextButtonShow] = useState(false);

    const videoRef = useRef<HTMLVideoElement>();
    const constraints = {audio: false, video: true};
    let session = new VouchedSession(sessionParams);
    let posted = false;

    const dispatch = useDispatch();

    useEffect(() => {
        // if(!cardDetect) return;
        navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
            setLocalStream(mediaStream);
            let video = document.querySelector("video")!;
            if(video != null){
                video.srcObject = mediaStream;
                video.onloadedmetadata = (e) => {
                    video.play();
                };
                video.onloadeddata = (e) => {
                    setVideoReady(true);
                    videoRef.current = video
                }
            }
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    }, [cardDetect])

    useEffect(() => {
        async function initCardDetect() {
            const detect = await CardDetectFactory.get();
            setCardDetect(detect);
        }
        dispatch(setSessionAction(session))
        initCardDetect();
    }, []);

    const updateLabelRetry = (retryableErrors: string[]) =>{
        let retryInstructionStr: string = retryableErrors[0];
        setInstructionMessage(retryInstructionStr);
    }
    const updateLabel = (instruction: string) =>{
        let str: string = '';
        switch (instruction){
            case "noCard":{
                str = "Show Card to Camera"
                break;
            }
            case "onlyOne":{
                str = "Multiple IDs"
                break;
            }
            case "moveCloser":{
                str ="Come Closer to Camera"
                break;
            }
            case "holdSteady":{
                str = "Hold Steady"
                break;
            }
            case "none":{
                str = "Processing Image"
                break;
            }
            default:{
                str = "Look Forward"
                break;
            }
        }
        setInstructionMessage(str);
    }

    let videoPlay = () => {
        videoRef?.current?.play();
    }
    useEffect(() => {
        let unmounted = false;
        async function processVideoFrame() {
            if(unmounted) return;
            let timeOut = 10;
            if(cardDetect && isVideoReady && videoRef.current) {
                const detectResult = await cardDetect.detect(videoRef.current);
                switch(detectResult.step){
                    case Step.preDetected:{
                        console.log("preDetected")
                        updateLabel(Instruction[detectResult.instruction])
                        break;
                    }
                    case Step.detected:{
                        console.log("Detected")
                        updateLabel(Instruction[detectResult.instruction])
                        break;
                    }
                    case Step.postable:{
                        if(!posted){
                            console.log("Inside Postable - Posted True")
                            videoRef.current.pause();
                            updateLabel(Instruction[detectResult.instruction])
                            try{
                                posted = true;
                                let job = await session.postFrontId(detectResult)
                                let retryableErrors = VouchedUtils.extractRetryableErrors(job)
                                if (retryableErrors.length > 0) {
                                    console.log("Inside retryable Errors")
                                    posted = false;
                                    timeOut = 5000;
                                    updateLabelRetry(retryableErrors)
                                    setTimeout(videoPlay, timeOut-2000)
                                    break;
                                }else{
                                    console.log(job);
                                    setNextButtonShow(true);
                                    dispatch(setSessionAction(session))
                                    dispatch(setJobAction(job));
                                    videoRef.current = undefined;
                                }
                            }catch(e){
                                console.log(e);
                            }
                        }
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }
            setTimeout(processVideoFrame, timeOut);
        }
        processVideoFrame();
        return ()=>{unmounted = true}
    }, [cardDetect, isVideoReady]);

    const cardButtonPrev = () =>{
        killCamera();
        previousButtonClicked();
    }
    const cardButtonNext = () =>{
        killCamera();
        nextButtonClicked();
    }

    const killCamera = () =>{
        if(localstream !=undefined){
            console.log("Card Detect killCamera")
            localstream!.getTracks().forEach((track)=>{
                track.stop();
            });
        }

        let video = document.querySelector("video")!;
        if(video != null){
            video.pause();
            video.srcObject = null;
            videoRef.current = undefined;
            video.src="";
            video.setAttribute('src', "");
            video.remove();
        }
        setInstructionMessage("");
    }

    // const killVouched = () =>{
    //     killCamera();
    //     // ReactDom.unmountComponentAtNode(document.getElementById('root')!);
    // }
    return (
        <>
            { cardDetect
                ? (
                    <div className="container">
                        <video
                            id="videoElement"
                            autoPlay
                            muted
                            playsInline
                            controls={false}
                        />
                        <div id="overlay">
                            <p id="instruction">{instructionMessage}</p>
                        </div>
                    </div>
                )
                : <div> Loading... </div>
            }
            <div id="buttonsContainer">
                <Button id="prevButton" onClick={cardButtonPrev}>Previous</Button>
                <Button id="nextButton" style={{display:nextButtonShow? "": "none"}} onClick={cardButtonNext}>Next</Button>
                <Button id="stopButton" style={{display:isVideoReady? "": "none"}} onClick={killCamera}>Stop Camera</Button>
            </div>
        </>
    );
}

export default IDCameraStep;



