import React, {useEffect, useRef, useState} from 'react';
import {
    FaceDetect,
    FaceDetectFactory,
    Instruction, Job,
    LivenessMode,
    Step,
    VouchedSession,
    VouchedUtils
} from '@vouched.id/vouched-js';
import {Button} from "@material-ui/core";
import './FaceCameraStep.css'
import {useDispatch, useSelector} from "react-redux";
import {setJobAction} from "../../actions";
import {RootState} from "../../reducers";
import ReactDom from "react-dom";

const FaceCameraStep: React.FC<{ nextButtonClicked: () => void, previousButtonClicked: () => void, arrIndex: number, setArrIndex: React.Dispatch<React.SetStateAction<number>> }> = ({nextButtonClicked, previousButtonClicked}) => {
    const [faceDetect, setFaceDetect] = useState<FaceDetect>();
    const [isVideoReady, setVideoReady] = useState<boolean>(false);
    const [localstream, setLocalStream] = useState<MediaStream>();
    const [nextButtonShow, setNextButtonShow] = useState(false);
    const [session,setSession] = useState<VouchedSession|undefined>(undefined)
    const [instructionMessage, setInstructionMessage] = useState<string>("");

    const constraints = {audio: false, video: true};
    const videoRef = useRef<HTMLVideoElement>();
    let posted = false;
    let getSession = useSelector((state:RootState)=>state.sessionReducer);

    const dispatch = useDispatch();

    useEffect(()=>{
        setSession(getSession);
    },[])

    useEffect(() => {
        if(!faceDetect) return;
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
    }, [faceDetect])

    useEffect(() => {
        async function initFaceDetect() {
            const detect = await FaceDetectFactory.get(LivenessMode.mouthMovement);
            setFaceDetect(detect);
        }
        initFaceDetect();
    }, []);

    const updateLabelRetry = (retryableErrors: string[]) =>{
        let retryInstructionStr: string = retryableErrors[0];
        setInstructionMessage(retryInstructionStr);
    }

    const updateLabel = (instruction: Instruction) =>{
        let str: string;
        switch (instruction){
            case Instruction.closeMouth:{
                str = "Close Mouth"
                break;
            }
            case Instruction.openMouth:{
                str = "Open Mouth"
                break;
            }
            case Instruction.moveCloser:{
                str = "Come Closer to Camera"
                break;
            }
            case Instruction.holdSteady:{
                str = "Hold Steady"
                break;
            }
            case Instruction.lookForward:{
                str = "Look Forward"
                break;
            }case Instruction.onlyOne:{
                str = "Multiple Faces"
                break;
            }
            default:
                str = "Look Forward"
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
            if(faceDetect && isVideoReady && videoRef.current) {
                const detectResult = await faceDetect.detect(videoRef.current);
                switch(detectResult.step){
                    case Step.preDetected:{
                        console.log("preDetected")
                        updateLabel(detectResult.instruction)
                        break;
                    }
                    case Step.detected:{
                        console.log("Detected")
                        updateLabel(detectResult.instruction)
                        break;
                    }
                    case Step.postable:{
                        if(!posted){
                            console.log("Inside Postable - Posted True")
                            videoRef.current.pause();
                            updateLabel(detectResult.instruction)
                            try{
                                posted = true;
                                let job = await session!.postFace(detectResult)
                                let retryableErrors = VouchedUtils.extractRetryableErrorsFace(job);
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
                                    job = await session!.confirm();
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
    }, [faceDetect, isVideoReady]);

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
    //     ReactDom.unmountComponentAtNode(document.getElementById('root')!);
    // }
    return (
        <>
            { faceDetect
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

export default FaceCameraStep;



