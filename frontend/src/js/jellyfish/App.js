/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
import React from "react";
import ReactDOM from "react-dom";
import GroupNavigation from "./GroupNavigation.js";
import Header from "./Header.js";
import {Provider} from "react-redux";
import * as JellyfishStore from "./AppState";
import "../../thirdparty/css/darkly/bootstrap.css";
import "../../css/jellyfish.css";
import {Connection} from "./Connection.js";

let appStore;
let connection;

export class Jellyfish {

    appStore() {
        return appStore;
    }

    connection() {
        return connection;
    }

    startUp() {
        appStore = JellyfishStore.createJellyfishStore();
        connection = new Connection();

        const rootElement = document.getElementById("entryPoint");
        ReactDOM.render(
            <Provider store={appStore}>
                <div>
                    <Header links={["Test1", "Test2"]}/>
                    <GroupNavigation groups={["group_a", "group_b"]}/>
                </div>
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
