import React, {PropTypes} from "react";
import {connect} from "react-redux";
import R from "ramda";
import Group from "./Group.js";
import {Tabs, Tab} from "react-bootstrap";
import {switchGroupAction} from "./actions/SwitchGroupAction.js";

export class GroupNavigation extends React.Component {

    Group_Tabs() {
        return R.addIndex(R.map)((group, index) =>
            <Tab key={`${group}-tab`} eventKey={index} title={group}>
                <Group group={group}/>
            </Tab>, this.props.groups
        );
    }

    handleSelect(func) {
        return (key) => {
            func(key);
        };
    }

    render() {
        const {switchGroup} = this.props;
        return (
            <Tabs activeKey={this.props.active_group} onSelect={this.handleSelect(switchGroup)} id="controlled">
                {this.Group_Tabs()}
            </Tabs>
        );
    }
}

GroupNavigation.propTypes = {
    groups: PropTypes.array.isRequired,
    active_group: PropTypes.number,
    switchGroup: PropTypes.func
};

const mapStateToProps = (state, initialProps) => {
    const defaultValues = {
        groups: ["group_A", "group_B"],
        active_group: 0,
    };
    const group_info = R.path(["group_info"])(state);
    return R.mergeAll([defaultValues, initialProps, group_info]);
};

const mapDispatchToProps = (dispatch) => {
    return {
        switchGroup: (group) => dispatch(switchGroupAction(group))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupNavigation);
