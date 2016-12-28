/* globals jest describe expect it beforeEach afterEach */
import React from "react";
import {shallow} from "enzyme";
import {Job} from "../Job.js";
import * as TestUtils from "../../testsupport/TestUtils.js";

describe("Job", () => {
    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });


    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Job rendering", () => {
        const subject = <Job env="develop" service="service" name="Some Job"
                             age="30 minutes ago" status="error" running={true} text="Some Tooltip"/>;

        it("should contain all relevant informations", () => {
            const component = shallow(subject);
            expect(component.find(".health-dot").hasClass("glowing")).toBe(true);
            expect(component.find(".health-dot").hasClass("health-dot-danger")).toBe(true);
            expect(component.find(".job").text()).toEqual("Some Job&nbsp;[30 minutes ago]");
        });
    });

    describe("Job rendering", () => {
        const subject = <Job env="develop" service="service" name="Some Job"
                             age={null} status="error" running={false} text="Some Tooltip"/>;

        it("without age", () => {
            const component = shallow(subject);
            expect(component.find(".health-dot").hasClass("glowing")).toBe(false);
            expect(component.find(".job").text()).toEqual("Some Job");
        });
    });
});