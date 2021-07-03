import { combineReducers } from "redux";
import RiskReducer from "./RiskReducer";

export default combineReducers({
    risk: RiskReducer,
})