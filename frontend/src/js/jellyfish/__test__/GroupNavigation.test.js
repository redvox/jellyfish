/* globals jest describe expect it beforeEach afterEach */
jest.mock("../Group.js", () => {
    return jest.fn(() => <div className="group"></div>);
});

import React from "react";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import {MockStore} from "../../testsupport/TestSupport.js";
import * as TestUtils from "../../testsupport/TestUtils.js";
import ConnectedGroupNavigation, {GroupNavigation} from "../GroupNavigation.js";

describe("GroupNavigation", () => {
    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("GroupNavigation rendering", () => {
        const subject = <GroupNavigation groups={["group1", "group2"]} active_group={1}/>;
        const component = mount(subject);

        it("include the right number of links and groups", () => {
            expect(component.find(".group").length).toBe(2);
            expect(component.find("li").length).toBe(2);
        });
        it("include the right names for groups", () => {
            expect(component.find("a").at(0).text()).toEqual("group1");
            expect(component.find("a").at(1).text()).toEqual("group2");
        });

        it("first tab is active", () => {
            expect(component.find("li").at(1).hasClass("active")).toBe(true);
        });
    });

    describe("GroupNavigation state loading", () => {
        const storeMock = MockStore({
            group_info: {
                active_group: 1
            }
        });

        const subject = <Provider store={storeMock}>
            <ConnectedGroupNavigation groups={["group1", "group2"]}/>
        </Provider>;
        const component = mount(subject);

        it("include the right number of links and groups", () => {
            expect(component.find(".group").length).toBe(2);
            expect(component.find("li").length).toBe(2);
        });
        it("include the right names for groups", () => {
            expect(component.find("a").at(0).text()).toEqual("group1");
            expect(component.find("a").at(1).text()).toEqual("group2");
        });

        it("active_group tab is active", () => {
            expect(component.find("li").at(1).hasClass("active")).toBe(true);
        });
    });

    describe("GroupNavigation dispatch actions", () => {
        const dispatchMock = jest.fn();
        const storeMock = MockStore({}, dispatchMock);

        const subject = <Provider store={storeMock}>
            <ConnectedGroupNavigation groups={["group1", "group2"]}/>
        </Provider>;
        const component = mount(subject);

        component.find("#controlled-tab-1").simulate("click");
        // component.find("a").at(1).simulate("click");

        it("dispatch function was called", () => {
            expect(dispatchMock).toBeCalled();
            expect(dispatchMock).toBeCalledWith({"info": 1, "type": "switchGroupAction"});
        });
    });
});