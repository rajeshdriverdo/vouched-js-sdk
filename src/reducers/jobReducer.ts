import {Job} from "@vouched.id/vouched-js";

const initialState = {errors:[], id:"", token:"", result:{firstName:"", lastName:"", success:false, confidences:{faceMatch:0, idMatch:0, idQuality:0, nameMatch:0, selfie:0}}}
type Action = {type:'SET_JOB', payload:Job}

export const jobReducer = (state = initialState, action:Action)=>{
    switch(action.type){
        case 'SET_JOB':
            return action.payload
        default:
            return state
    }
}

