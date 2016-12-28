export const ADD_ENV_INFO = "addEnvInfo";

export const addEnvInfo = (obj) => {
    const {env, service} = obj;
    return {
        type: ADD_ENV_INFO,
        env: env,
        service: service,
        info: obj
    };
};
