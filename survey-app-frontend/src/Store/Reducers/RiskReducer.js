import { handleActions } from "redux-actions";

const INITIAL_STATE = {
    risk_questions: [],
}
const RiskReducer = handleActions({
    RISK_QUESTION: (state, action) => {
        return { ...state, risk_questions: [action.payload] };
    }
}, INITIAL_STATE);

export default RiskReducer;