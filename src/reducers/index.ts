import {jobReducer} from './jobReducer'
import {sessionReducer} from "./sessionReducer";
import {combineReducers} from "redux";

export const allReducers = combineReducers({jobReducer: jobReducer, sessionReducer:sessionReducer})

export type RootState = ReturnType<typeof allReducers>
