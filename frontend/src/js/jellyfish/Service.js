import React, {PropTypes} from "react";
import {connect} from "react-redux";
import EnvInfo from "./EnvInfo.js";
import R from "ramda";

// const filter = R.filter(input => input !== null);
// const mapper = R.map(env => <EnvInfo className="environments" key={`${env}-${name}`} env={env} service={name}/>);
// {R.pipe(filter, mapper)(environments)}

export class Service extends React.Component {

    App(env) {
        return R.contains(env, this.props.environments) ? <EnvInfo service={this.props.name} env={env}/> : null;
    }

    List_of_Environments() {
        return R.map(env => <td key={`${env}-${this.props.name}`}>
            {this.App(env)}
        </td>)(this.props.existent_environments);
    }

    Service_Info() {
        const {name, cpu, cpu_usage, mem, mem_usage} = this.props;
        return <td className="service_info_width">
            <div className="group_name">{name}</div>
            <div className="small">
                <div><span className="cpu label label-unflashy">CPU: {cpu}</span></div>
                <div><span className="cpu_max label label-unflashy">CPU MAX: {cpu_usage}</span></div>
                <div><span className="mem label label-unflashy">MEM: {mem}</span></div>
                <div><span className="mem_max label label-unflashy">MEM MAX: {mem_usage}</span></div>
            </div>
        </td>;
    }

    render() {
        return (
            <tr>
                {this.Service_Info()}
                {this.List_of_Environments()}
            </tr>
        );
    }
}

Service.propTypes = {
    name: PropTypes.string.isRequired,
    existent_environments: PropTypes.array.isRequired,
    environments: PropTypes.array,
    cpu: PropTypes.number,
    cpu_usage: PropTypes.number,
    mem: PropTypes.number,
    mem_usage: PropTypes.number
};

const mapStateToProps = (state, initialProps) => {
    const defaultValues = {
        cpu: 0,
        cpu_usage: 0,
        mem: 0,
        mem_usage: 0,
        existent_environments: ["ci", "develop"],
        environments: ["ci"]
    };
    const env_info_from_state = R.path(["environment_info", initialProps.name])(state);
    return R.mergeAll([defaultValues, initialProps, env_info_from_state]);
};

export default connect(mapStateToProps)(Service);
