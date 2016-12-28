/* globals describe expect it */
import reducer from "../EnvInfoReducer.js";
import {ADD_ENV_INFO} from "../../actions/AddEnvInfoAction.js";

describe("EnvInfo Reducer Test", () => {
    describe("unknown action", () => {
        it("should return old state if other action type occurs", () => {
            const oldState = {my: "value"};
            const result = reducer(oldState, {type: "someOtherType"});
            expect(result).toBe(oldState);
        });
    });

    describe("addEnvInfo", () => {
        it("should add new env info to state", () => {
            const oldState = {old_service: {ci: "oldValue"}};
            const result = reducer(oldState, {
                type: ADD_ENV_INFO,
                env: "dev",
                service: "new_service",
                info: {newInfo: "value"}
            });
            expect(result).not.toBe(oldState);
            expect(result).toEqual({
                old_service: {ci: "oldValue"},
                new_service: {dev: {newInfo: "value"}}
            });
        });

        it("should add a new service", () => {
            const oldState = {old_service: {ci: "old_value"}};
            const result = reducer(oldState, {
                type: ADD_ENV_INFO,
                env: "ci",
                service: "new_service",
                info: "new_value"
            });
            expect(result).toEqual(
                {
                    old_service: {ci: "old_value"},
                    new_service: {ci: "new_value"}
                });
        });

        it("should add a new env", () => {
            const oldState = {old_service: {dev: "dev_value"}};
            const result = reducer(oldState, {
                type: ADD_ENV_INFO,
                service: "old_service",
                env: "ci",
                info: "ci_value"
            });
            expect(result).toEqual(
                {
                    old_service: {dev: "dev_value", ci: "ci_value"}
                });
        });
    });
});