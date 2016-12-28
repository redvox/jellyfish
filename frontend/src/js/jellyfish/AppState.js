import {createStore, combineReducers} from "redux";
import EnvInfoReducer from "./reducers/EnvInfoReducer.js";
import GroupInfoReducer from "./reducers/GroupInfoReducer.js";

const initialState = {
    environment_info: {},
    group_info: {}
};

const rootReducer = combineReducers({
    environment_info: EnvInfoReducer,
    group_info: GroupInfoReducer
});

const middleware = window.devToolsExtension ? window.devToolsExtension() : f => f;

export const createJellyfishStore = () => createStore(rootReducer, initialState, middleware);