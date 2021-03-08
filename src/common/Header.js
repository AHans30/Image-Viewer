import React, { Component } from 'react'
import './Header.css'

export class Header extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <header className="app-header">
                    <div id="logo-parent">
                        <div id="logo-child">Image Viewer</div>
                    </div>
                </header>
            </div>
        )
    }
}

export default Header;