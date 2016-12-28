/* globals jest describe expect it beforeEach afterEach */
jest.mock("../Service.js", () => {
    return jest.fn(() => <tr className="service">service</tr>);
});

import React from "react";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import {MockStore} from "../../testsupport/TestSupport.js";
import ConnectedGroup, {Group} from "../Group.js";
import * as TestUtils from "../../testsupport/TestUtils.js";

describe("Group", () => {
    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Group rendering", () => {
        const subject = <Group group="group" environments={["develop", "ci"]} services={["dog", "cat"]}/>;
        const component = mount(subject);

        it("display environments headline", () => {
            expect(component.find(".environment-headline").length).toBe(2);
        });
        it("display services", () => {
            expect(component.find(".service").length).toBe(2);
        });
    });

    describe("Group state loading", () => {
        const storeMock = MockStore({
            group_info: {
                group: {
                    group: "group",
                    environments: ["ci", "develop", "live"],
                    services: ["service_a", "service_b"]
                }
            }
        });

        const subject = <Provider store={storeMock}>
            <ConnectedGroup group="group" environments={["ci", "develop", "live"]}/>
        </Provider>;
        const component = mount(subject);

        it("display environments headline", () => {
            expect(component.find(".environment-headline").length).toBe(3);
        });
        it("display services", () => {
            expect(component.find(".service").length).toBe(2);
        });
    });
});