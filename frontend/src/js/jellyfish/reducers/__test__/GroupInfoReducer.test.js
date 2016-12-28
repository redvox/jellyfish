/* globals describe expect it */
import reducer from "../GroupInfoReducer.js";
import {SWITCH_GROUP_ACTION} from "../../actions/SwitchGroupAction.js";
import {ADD_GROUP_INFO} from "../../actions/AddGroupInfoAction";

describe("GroupInfo Reducer Test", () => {
    describe("unknown action", () => {
        it("should return old state if other action type occurs", () => {
            const oldState = {my: "value"};
            const result = reducer(oldState, {type: "someOtherType"});
            expect(result).toBe(oldState);
        });
    });
    describe("addGroupInfo", () => {
        it("should add new group info to state", () => {
            const oldState = {old_service: {oldKey: "oldValue"}};
            const result = reducer(oldState, {
                type: ADD_GROUP_INFO,
                group: "new_service",
                info: {newKey: "newValue"}
            });

            expect(result).not.toBe(oldState);
            expect(result).toEqual({
                old_service: {oldKey: "oldValue"},
                new_service: {newKey: "newValue"}
            });
        });

        it("should update a group", () => {
            const oldState = {old_service: {oldKey: "oldValue"}};
            const result = reducer(oldState, {
                type: ADD_GROUP_INFO,
                group: "old_service",
                info: {oldKey: "newValue"}
            });

            expect(result).not.toBe(oldState);
            expect(result).toEqual({
                old_service: {oldKey: "newValue"}
            });
        });
    });
    describe("switchGroupAction", () => {
        it("should switch active_groupe", () => {
            const oldState = {active_group: 0};
            const result = reducer(oldState, {
                type: SWITCH_GROUP_ACTION,
                info: 1
            });

            expect(result).not.toBe(oldState);
            expect(result).toEqual({active_group: 1});
        });
    });
});

