import axios from "axios";
import "antd/dist/antd.css";
import { message } from "antd";
import Nanobar from "nanobar";



var options = {
    classname: "my-class",
    id: "my-id",
    target: document.getElementById("myDivId"),
};
var nanobar = new Nanobar(options);

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

const _error = (_message) => {
    message.error(_message)
};

instance.interceptors.request.use(
    async function (config) {
        nanobar.go(50);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        nanobar.go(100);
        return response;
    },
    function (error) {
        if (!error.response) {
            message.error("Error: Network Error")
            nanobar.go(100);
            return
        }
        if (error.response.status === 401) {
            message.error("Session Expired Login Again")
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
            return
        }
        if (error.response.status === 403) {
            message.error("Session Expired Login Again")
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
            return
        }
        if (error.response.status === 413) {
            message.error("File size exceeded");
            return
        }
        else {
            _error(error.response.data.errorMessage)
            nanobar.go(100);
        }
        return Promise.reject(error);
    }
);
export default instance;
