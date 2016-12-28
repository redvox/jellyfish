import React, {PropTypes} from "react";
import {connect} from "react-redux";
import R from "ramda";
import * as Util from "./Util.js";

export class Job extends React.Component {

    is_running() {
        return this.props.running ? "glowing" : "";
    }

    age() {
        return this.props.age ? `&nbsp;[${this.props.age}]` : null;
    }

    health_dot() {
        return <span
            className={`health-dot ${this.is_running()} health-dot-${Util.map_status_color_to_css(this.props.status)}`}
            data-toggle="tooltip"
            data-placement="bottom"
            title={this.props.text}
            data-original-title=""/>;
    }

    render() {
        const {name} = this.props;
        return (
            <div className="job">
                {this.health_dot()}
                {name}{this.age()}
            </div>
        );
    }
}

Job.propTypes = {
    env: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string,
    age: PropTypes.string,
    running: PropTypes.bool,
    text: PropTypes.string
};

const mapStateToProps = (state, initialProps) => {
    const defaultValues = {
        name: "",
        status: "unknown",
        age: null,
        running: false,
        text: ""
    };
    const env_info = R.path(["environment_info", initialProps.env, initialProps.service, initialProps.name])(state);
    return R.merge(defaultValues, initialProps, env_info);
};

export default connect(mapStateToProps)(Job);
