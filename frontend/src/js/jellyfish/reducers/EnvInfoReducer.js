import R from "ramda";
import {ADD_ENV_INFO} from "../actions/AddEnvInfoAction.js";

export default (oldState = {}, action) => {
    if (action.type === ADD_ENV_INFO) {
        const lens = R.lensPath([action.service, action.env]);
        return R.set(lens, action.info)(oldState);
    }
    return oldState;
};