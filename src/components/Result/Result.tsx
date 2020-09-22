import React, {Dispatch, SetStateAction, useState, useEffect} from 'react';
import x from './x.jpg';
import check from './check.png';
import './Result.css'
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../reducers";
import {Job} from "@vouched.id/vouched-js";

let dim = 40;
let margin = 20;
const Result: React.FC<{ nextButtonClicked: () => void, previousButtonClicked: () => void, arrIndex: number, setArrIndex: React.Dispatch<React.SetStateAction<number>> }> = ({nextButtonClicked, previousButtonClicked}) => {
    let [job,setJob] = useState<Job|undefined>(undefined)
    let [loaded, setLoad] = useState(false);
    let getJob: Job = useSelector((state:RootState)=>state.jobReducer);

    useEffect(()=>{
        setJob(getJob);
        if(getJob.result != null)
            setLoad(true);
    },[])
    const cardButtonPrev = () =>{
        previousButtonClicked();
    }
    const cardButtonNext = () =>{
        nextButtonClicked();
    }
    return (
        <>
            {loaded ?  (<div className="resultMainDiv">
                <div className="resultDiv">
                    <p className="resultP" >Name - {job!.result.success?  job!.result.firstName+ " "+job!.result.lastName:""}</p>
                    <img src={job!.result.success? check: x} style={{height:dim, width:dim, margin:margin}} />
                </div>
                <div className="resultDiv">
                    <p className="resultP">Valid ID - {job!.result.success? "True":"False"}</p>
                    <img src={job!.result.success? check: x} style={{height:dim, width:dim, margin:margin}} />
                </div>
                <div className="resultDiv">
                    <p className="resultP">Valid Selfie - {job!.result.success? "True":"False"}</p>
                    <img src={job!.result.success? check: x} style={{height:dim, width:dim, margin:margin}} />
                </div>
                <div className="resultDiv">
                    <p className="resultP">Face Match - {job!.result.success? "True":"False"}</p>
                    <img src={job!.result.success? check: x} style={{height:dim, width:dim, margin:margin}} />
                </div>
                <div className="resultDiv">
                    <p className="resultP">Face Match Result - {job!.result.confidences.faceMatch > 0.7? job!.result.confidences.faceMatch:""}</p>
                    <img src={job!.result.confidences.faceMatch > 0.7? check: x} style={{height:dim, width:dim, margin:margin}} />
                </div>
                <div className="resultDiv">
                    <p className="resultP">Id Quality Result - {job!.result.confidences.idQuality > 0.4? job!.result.confidences.idQuality:""}</p>
                    <img src={job!.result.confidences.idQuality > 0.4? check: x} style={{height:dim, width:dim, margin:margin}} />
                </div>
                <div className="resultDiv">
                    <Button style={{color:'white'}} onClick={cardButtonPrev}>Previous</Button>
                </div>
            </div>): <div></div>}
        </>
    );
}
export default Result;

