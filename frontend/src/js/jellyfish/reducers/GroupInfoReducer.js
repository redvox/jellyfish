import R from "ramda";
import {SWITCH_GROUP_ACTION} from "../actions/SwitchGroupAction.js";
import {ADD_GROUP_INFO} from "../actions/AddGroupInfoAction";

export default (oldState = {}, action) => {
    if (action.type === ADD_GROUP_INFO) {
        const lens = R.lensPath([action.group]);
        return R.set(lens, action.info)(oldState);
    }
    if (action.type === SWITCH_GROUP_ACTION) {
        const lens = R.lensPath(["active_group"]);
        return R.set(lens, action.info)(oldState);
    }
    return oldState;
};