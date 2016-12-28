export const ADD_GROUP_INFO = "addGroupInfo";

export const addGroupInfo = (obj) => {
    const {group} = obj;
    return {
        type: ADD_GROUP_INFO,
        group: group,
        info: obj
    };
};
