export const SWITCH_GROUP_ACTION = "switchGroupAction";

export const switchGroupAction = (obj) => {
    return {
        type: SWITCH_GROUP_ACTION,
        info: obj
    };
};
