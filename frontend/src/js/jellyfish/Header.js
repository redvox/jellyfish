import React, {PropTypes} from "react";
import R from "ramda";
import {Nav, Navbar, NavItem, Image} from "react-bootstrap";
import logo_img from "../../img/icon.png";

export class Header extends React.Component {

    HeaderLinks() {
        return R.addIndex(R.map)((link, index) => <NavItem key={index} href="#">{link}</NavItem>, this.props.links);
    }

    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <div className="brand-image">
                            <Image src={logo_img} rounded/>
                        </div>
                        <div className="brand-name">
                            <a href="#">Jellyfish</a>
                        </div>
                    </Navbar.Brand>
                    <Nav>
                        {this.HeaderLinks()}
                    </Nav>
                </Navbar.Header>
            </Navbar>
        );
    }
}

Header.propTypes = {
    links: PropTypes.array.isRequired
};

export default (Header);
