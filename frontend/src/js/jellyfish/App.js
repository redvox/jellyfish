/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
import React from "react";
import ReactDOM from "react-dom";
import GroupNavigation from "./GroupNavigation.js";
import {Provider} from "react-redux";
import * as JellyfishStore from "./AppState";
import "../../thirdparty/css/darkly/bootstrap.css";
import "../../css/jellyfish.css";

let appStore;
let backend;

export class Jellyfish {

    appStore(){
        return appStore;
    }

    backend(){
        return backend;
    }

    startUp() {
        appStore = JellyfishStore.createJellyfishStore();
        backend = new Backend();

        const rootElement = document.getElementById("entryPoint");
        ReactDOM.render(
            <Provider store={appStore}>
                <GroupNavigation groups={["group_a", "group_b"]}/>
            </Provider>, rootElement);
    }
}

const app = new Jellyfish();
export default app;

const config = window.jellyfish.config;

/* eslint-disable */
//console.log("Using configuration", config);
app.startUp(config);

// console.log("UsePolling ", Toggles.usePolling);
// console.log("ShowInterestingStep ", Toggles.showInterestingStep);