/* globals jest describe expect it beforeEach afterEach */
jest.mock("../EnvInfo.js", () => {
    return jest.fn(() => <div className="envInfo"></div>);
});

import React from "react";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import {MockStore} from "../../testsupport/TestSupport.js";
import ConnectedService, {Service} from "../Service.js";
import * as TestUtils from "../../testsupport/TestUtils.js";

describe("Service", () => {
    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Service rendering", () => {
        const subject = <Service name="great service"
                                 existent_environments={["ci", "develop", "live"]}
                                 environments={["ci", "live"]}
                                 cpu={1} cpu_usage={0.5} mem={1024} mem_usage={512}/>;
        const component = mount(subject);

        it("should display correct name", () => {
            expect(component.find(".group_name").text()).toEqual("great service");
        });
        it("should include tds for every existent environments", () => {
            expect(component.find("td").length).toBe(4);
        });
        it("should display all active environments", () => {
            expect(component.find(".envInfo").length).toBe(2);
        });
        it("environments without active app should be empty", () => {
            expect(component.find("td").at(1).children().length).toBe(1);
            expect(component.find("td").at(2).children().length).toBe(0);
            expect(component.find("td").at(3).children().length).toBe(1);
        });
        it("should display service info correctly", () => {
            expect(component.find(".cpu").text()).toEqual("CPU: 1");
            expect(component.find(".cpu_max").text()).toEqual("CPU MAX: 0.5");
            expect(component.find(".mem").text()).toEqual("MEM: 1024");
            expect(component.find(".mem_max").text()).toEqual("MEM MAX: 512");
        });
    });

    describe("Service state loading", () => {
        const storeMock = MockStore({
            environment_info: {
                service: {
                    cpu: 1,
                    cpu_usage: 2,
                    mem: 3,
                    mem_usage: 4,
                    environments: ["ci", "develop"]
                }
            }
        });

        const subject = <Provider store={storeMock}>
            <ConnectedService name="service" existent_environments={["ci", "develop", "live"]}/>
        </Provider>;
        const component = mount(subject);

        it("reads from the store correctly", () => {
            expect(component.find(".group_name").text()).toEqual("service");
            expect(component.find(".cpu").text()).toEqual("CPU: 1");
            expect(component.find(".cpu_max").text()).toEqual("CPU MAX: 2");
            expect(component.find(".mem").text()).toEqual("MEM: 3");
            expect(component.find(".mem_max").text()).toEqual("MEM MAX: 4");
            expect(component.find("td").length).toBe(4);
            expect(component.find(".envInfo").length).toBe(2);
        });
    });
});