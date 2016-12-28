import React, {PropTypes} from "react";
import {connect} from "react-redux";
import R from "ramda";
import Service from "./Service.js";

export class Group extends React.Component {

    Environments_Headline() {
        return <tr>
            <th></th>
            {R.map(env => <td key={`${this.props.group}-${env}-headline`} className="environment-headline"><b>{env}</b>
            </td>)(this.props.environments)}
        </tr>;
    }

    List_of_Services() {
        return R.map(service => <Service key={`${this.props.group}-${service}`} name={service}/>)(this.props.services);
    }

    render() {
        return (
            <table>
                <tbody>
                {this.Environments_Headline()}
                {this.List_of_Services()}
                </tbody>
            </table>
        );
    }
}

Group.propTypes = {
    group: PropTypes.string.isRequired,
    environments: PropTypes.array,
    services: PropTypes.array
};

const mapStateToProps = (state, initialProps) => {
    const defaultValues = {
        group: initialProps.group,
        environments: ["ci", "develop", "live"],
        services: ["service_a", "service_b", "service_c"]
    };
    const group_info = R.path(["group_info", initialProps.group])(state);
    return R.mergeAll([defaultValues, initialProps, group_info]);
};

export default connect(mapStateToProps)(Group);
