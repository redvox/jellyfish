import React, {PropTypes} from "react";
import {connect} from "react-redux";
import marathon_icon from "../../img/marathon.png";
import Job from "./Job.js";
import R from "ramda";
import {addEnvInfo} from "./actions/AddEnvInfoAction";
import * as Util from "./Util.js";

//
// const Staged = ({instances_staged}) => {
//     return instances_staged !== 0 ? <span className="staged">Staged: {instances_staged}</span> : null;
// };
//
// Staged.propTypes = {
//     instance_count: PropTypes.number.isRequired
// };

/*
 <Staged instance_count={1}/>
 {Staged({instance_count: 1})}
 */

export class EnvInfo extends React.Component {

    map_active_color_to_css(color) {
        switch (color) {
            case "GRN":
                return "green";
            case "BLU":
                return "blue";
            default:
                return "";
        }
    }

    Color_and_Version() {
        return <div>
            <div className={`block-icon ${this.map_active_color_to_css(this.props.color)}`}></div>
            <span className="app-version">{this.props.app_version}</span>
        </div>;
    }

    marathon_instances_text_color() {
        return this.props.instances_current < this.props.instances_target ? "text-danger" : "text-success";
    }

    Marathon_status() {
        return <span>
            <a href="/">
                <img className="marathon-icon margin-right" src={marathon_icon}/>
            </a>
            {this.props.instances_target !== 0 ?
                <span className={`marathon-instances margin-right ${this.marathon_instances_text_color()}`}>
                    {this.props.instances_current}/{this.props.instances_target}</span>
                :
                <span className="marathon-instances margin-right text-primary">
                    suspended</span>}
        </span>;
    }

    Staged() {
        return this.props.instances_staged !== 0 ?
            <span className="staged label label-warning black-text margin-right">
                Staged: {this.props.instances_staged}</span> : null;
    }

    Unhealthy() {
        return this.props.instances_unhealthy !== 0
            ? <span className="unhealthy label label-danger black-text margin-right">
                Unhealthy: {this.props.instances_unhealthy}</span>
            : null;
    }


    App_Status() {
        return <span
            className={`app-status label label-${Util.map_status_color_to_css(this.props.app_status)} black-text margin-right`}>
            {this.props.app_status}</span>;
    }

    App_Status_Page_Return_Value() {
        return this.props.app_status_page_return_value >= 400
            ? <span className="app-status-page-return-value label label-danger black-text margin-right">
            Status Page: {this.props.app_status_page_return_value}</span>
            : null;
    }

    List_of_Jobs() {
        return R.map(job => <Job key={`${this.props.env}-${this.props.service}-${job}`} env={this.props.env}
                                 service={this.props.service} name={job}/>)(this.props.jobs);
    }

    render() {
        const {status, triggerJobFn} = this.props;
        return (
            <div className={`envInfo well no-border well-sm well-${Util.map_status_color_to_css(status)}`}>
                {this.Color_and_Version()}
                <div>
                    {this.Marathon_status()}
                    {this.Staged()}
                    {this.Unhealthy()}
                </div>
                {this.App_Status()}
                {this.App_Status_Page_Return_Value()}
                <button onClick={triggerJobFn}>Click</button>
                {this.List_of_Jobs()}
            </div>
        );
    }
}

EnvInfo.propTypes = {
    service: PropTypes.string.isRequired,
    env: PropTypes.string.isRequired,
    status: PropTypes.string,
    app_status: PropTypes.string,
    app_status_page_return_value: PropTypes.number,
    app_version: PropTypes.string,
    color: PropTypes.string,
    instances_target: PropTypes.number,
    instances_current: PropTypes.number,
    instances_staged: PropTypes.number,
    instances_unhealthy: PropTypes.number,
    jobs: PropTypes.array,
    triggerJobFn: PropTypes.func
};

export const calculate_status = ({app_status, app_status_page_return_value, instances_current, instances_target, jobs}) => {
    if (instances_current < instances_target || app_status === "error" || app_status_page_return_value >= 400) {
        return {status: "error"};
    }

    const compareStatus = (first, next) => {
        if (next === "error" || first === "error") {
            return "error";
        }
        if (next === "warning" || first === "warning") {
            return "warning";
        }
        return first;
    };
    return {status: R.pipe(R.map(R.prop("status")), R.reduce(compareStatus, app_status))(jobs)};
};

const mapStateToProps = (state, initialProps) => {
    const defaultValues = {
        service: initialProps.service,
        env: initialProps.env,
        status: "unknown",
        app_status: "unknown",
        app_status_page_return_value: 200,
        app_version: "?",
        color: "GRN",
        instances_target: 0,
        instances_current: 0,
        instances_staged: 0,
        instances_unhealthy: 0,
        jobs: ["job", "job2"]
    };
    const env_info_from_state = R.path(["environment_info", initialProps.service, initialProps.env])(state);
    const merged_state = R.mergeAll([defaultValues, initialProps, env_info_from_state]);
    return R.merge(merged_state, calculate_status(merged_state));
};

const mapDispatchToProps = (dispatch, initialProps) => {
    return {
        triggerJobFn: () => dispatch(addEnvInfo({
            env: initialProps.env,
            service: initialProps.service,
            status: "unknown",
            app_status: "error",
            app_status_page_return_value: 400,
            app_version: "6789",
            color: "BLU",
            instances_target: 1,
            instances_current: 0,
            instances_staged: 1,
            instances_unhealthy: 1,
            jobs: []
        }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnvInfo);
