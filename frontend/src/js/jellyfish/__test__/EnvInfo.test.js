/* globals jest describe expect it beforeEach afterEach */
jest.mock("../Job.js", () => {
    return jest.fn(() => <div className="job"></div>);
});

import React from "react";
import {mount} from "enzyme";
import {MockStore} from "../../testsupport/TestSupport.js";
import * as TestUtils from "../../testsupport/TestUtils";
import ConnectedEnvInfo, {EnvInfo, calculate_status} from "../EnvInfo.js";
import {Provider} from "react-redux";
import JobMock from "../Job.js";
import R from "ramda";

describe("EnvInfo", () => {
    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
        JobMock.mockReturnValue(null);
    });


    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("EnvInfo rendering", () => {
        const subject = <EnvInfo service="service" env="env" status="error"
                                 app_status="OK" app_status_page_return_value={200} app_version="1234" color="GRN"
                                 instances_current={2} instances_target={1}
                                 instances_staged={0} instances_unhealthy={0}
                                 jobs={["job1", "job2"]}/>;
        const component = mount(subject);
        it("mark env as error", () => {
            expect(component.find(".envInfo").hasClass("well-danger")).toBe(true);
        });
        it("display version and active color", () => {
            expect(component.find(".app-version").text()).toEqual("1234");
            expect(component.find(".block-icon").hasClass("green")).toBe(true);
        });
        it("display marathon status", () => {
            expect(component.find(".marathon-instances").text()).toEqual("2/1");
            expect(component.find(".marathon-instances").hasClass("text-success")).toBe(true);
        });
        it("no staged", () => {
            expect(component.find(".staged").length).toBe(0);
        });
        it("no unhealthy", () => {
            expect(component.find(".unhealthy").length).toBe(0);
        });
        it("display app status", () => {
            expect(component.find(".app-status").text()).toEqual("OK");
            expect(component.find(".app-status").hasClass("label-success")).toBe(true);
        });
        it("no app status return value", () => {
            expect(component.find(".app-status-page-return-value").length).toBe(0);
        });
        it("no jobs", () => {
            expect(component.find(".job").length).toBe(2);
        });
    });

    describe("EnvInfo rendering", () => {
        const subject = <EnvInfo service="service" env="env" status="unknown"
                                 app_status="OK" app_status_page_return_value={200} app_version="1234" color="GRN"
                                 instances_current={0} instances_target={0}
                                 instances_staged={0} instances_unhealthy={0}
                                 jobs={[]}/>;

        it("should display suspended", () => {
            const component = mount(subject);
            expect(component.find(".marathon-instances").text()).toEqual("suspended");
            expect(component.find(".marathon-instances").hasClass("text-primary")).toBe(true);
        });
    });

    describe("EnvInfo rendering", () => {
        const subject = <EnvInfo service="service" env="env" status="error"
                                 app_status="OK" app_status_page_return_value={400} app_version="1234" color="GRN"
                                 instances_current={1} instances_target={2}
                                 instances_staged={1} instances_unhealthy={2}
                                 jobs={[]}/>;
        const component = mount(subject);

        it("color instance text if current < target", () => {
            expect(component.find(".marathon-instances").text()).toEqual("1/2");
            expect(component.find(".marathon-instances").hasClass("text-danger")).toBe(true);
        });
        it("display staged", () => {
            expect(component.find(".staged").text()).toEqual("Staged: 1");
        });
        it("display unhealthy", () => {
            expect(component.find(".unhealthy").text()).toEqual("Unhealthy: 2");
        });
        it("display status page return value", () => {
            expect(component.find(".app-status-page-return-value").text()).toEqual("Status Page: 400");
        });
    });

    describe("calculate overall state", () => {
        const state = {
            app_status: "ok",
            instances_current: 1,
            instances_target: 1,
            app_status_page_return_value: 200,
            jobs: [{status: "ok"}]
        };

        it("everything is fine", () => {
            expect(calculate_status(state)
            ).toEqual({status: "ok"});
            expect(calculate_status(R.merge(state, {
                jobs: []
            }))).toEqual({status: "ok"});
        });

        it("not enough current instances mark env as error", () => {
            expect(calculate_status(R.merge(state, {
                instances_current: 0,
                instances_target: 1
            }))).toEqual({status: "error"});
        });

        it("mark env as error if status page not available", () => {
            expect(calculate_status(R.merge(state, {
                app_status_page_return_value: 503,
            }))).toEqual({status: "error"});
        });

        it("jobs mark env as warning/error", () => {
            expect(calculate_status(R.merge(state, {
                jobs: [{status: "ok"}, {status: "error"}]
            }))).toEqual({status: "error"});
            expect(calculate_status(R.merge(state, {
                jobs: [{status: "warning"}, {status: "ok"},]
            }))).toEqual({status: "warning"});
        });
    });

    describe("EnvInfo state loading", () => {
        const storeMock = MockStore({
            environment_info: {
                service: {
                    env: {
                        env: "env",
                        service: "service",
                        status: "ok",
                        app_status: "warning",
                        app_status_page_return_value: 200,
                        app_version: "1234",
                        color: "green",
                        instances_target: 1,
                        instances_current: 1,
                        instances_staged: 1,
                        instances_unhealthy: 1,
                        jobs: []
                    }
                }
            }
        });

        const subject = <Provider store={storeMock}>
            <ConnectedEnvInfo service="service" env="env"/>
        </Provider>;

        it("reads from the store correctly and marks env as warning", () => {
            const component = mount(subject);
            expect(component.find(".envInfo").hasClass("well-warning")).toBe(true);
            expect(component.find(".app-version").text()).toEqual("1234");
            expect(component.find(".staged").text()).toEqual("Staged: 1");
            expect(component.find(".unhealthy").text()).toEqual("Unhealthy: 1");
        });
    });

    describe("EnvInfo state loading", () => {
        const storeMock = MockStore({
            environment_info: {
                service: {
                    env: {
                        env: "env",
                        service: "service",
                        status: "ok",
                        app_status: "ok",
                        app_status_page_return_value: 400,
                        app_version: "1234",
                        color: "green",
                        instances_target: 1,
                        instances_current: 1,
                        instances_staged: 0,
                        instances_unhealthy: 0,
                        jobs: []
                    }
                }
            }
        });

        const subject = <Provider store={storeMock}>
            <ConnectedEnvInfo service="service" env="env"/>
        </Provider>;

        it("reads from the store correctly and marks env as error", () => {
            const component = mount(subject);
            expect(component.find(".envInfo").hasClass("well-danger")).toBe(true);
        });
    });

});
