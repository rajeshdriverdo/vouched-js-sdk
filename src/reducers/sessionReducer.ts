import {VouchedSession} from "@vouched.id/vouched-js";

type Action = {type:'SET_SESSION', payload:VouchedSession}

export const sessionReducer = (state = null, action:Action)=>{
    switch(action.type){
        case 'SET_SESSION':
            return action.payload
        default:
            return state;
    }
}
