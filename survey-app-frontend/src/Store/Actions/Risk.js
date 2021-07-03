import { createAction } from "redux-actions";
import axios from "../axios";
import Cookies from "js-cookie"

const RISK_QUESTION = createAction("RISK_QUESTION");
const SAVE_QUESTION = createAction("SAVE_QUESTION");
export const riskquestions = values => dispatch => {
    return axios.get("api/Survey/Questions", {
        headers: {
            Authorization: Cookies.get("Logintoken")
        }
    }).then(res => {
        dispatch(RISK_QUESTION(res.data.item));
    }).catch(error => {
        return Promise.reject();
    });
};


export const SaverRiskQuestionRecord = values => dispatch => {
    return axios.post("api/Survey/Response ", {
        Response: values.Response,
        SurveyID: values.SurveyID,
        IsComplete: values.IsComplete,
        LastQuestionId: values.LastQuestionId,
        Score: values.Score,
        Profile: values.Profile,
        SurveyShortCode: values.SurveyShortCode
    },
        {
            headers: {
                Authorization: Cookies.get("Logintoken")
            }
        }).then(res => {
            sessionStorage.setItem("RiskScore", values.Score);
            sessionStorage.setItem("Profile", values.Profile)
            dispatch(SAVE_QUESTION(res.data.item));
        }).catch(error => {
            return Promise.reject();
        });
}