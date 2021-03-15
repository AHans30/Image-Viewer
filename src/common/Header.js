import React, { Component } from "react";
import "./Header.css";
import { withStyles } from "@material-ui/core/styles";
import { ListItemText, Input, IconButton, Menu, MenuItem, Typography, Divider} from "@material-ui/core/";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: "", //"" or null or undefined are considered as falsy values in JS
            logoLink: this.props.screen === "login" ? "/" : "/home",
        };
    }

    openMenuHandler = (event) => {
        //console.log(event.currentTarget)
        this.setState({ isMenuOpen: event.currentTarget });
    };

    closeMenuHandler = () => {
        this.setState({ isMenuOpen: null });
    };

    searchChangeHandler = (event) => {
        let keyword = event.target.value.trimEnd();
        this.props.searchBarHandler(keyword);
    };

    onLogout = () => {
        sessionStorage.removeItem("access-token");
        this.props.history.push("/");
    };

    myAccountHandler = () => {
        this.props.history.push("/profile")
            // {
            //     pathname: "/profile", 
            //     state: {
            //         here: this.props.sendImages(),
            //         hello: "Yabadaba",
            //             }
            // });
        // return (
        //     <Redirect 
        //     to={{
        //         pathname: "/profile", 
        //         state: { here: this.props.sendImages(), 
        //                     hello: "Yabadaba", }
        //             }} />
        // )
      };

    renderMyAccount() {
        const inlineStyles = {
            bold: { fontWeight: "bold" },
            search: { "aria-label": "search" },
        }

        if(this.props.screen === "home"){
            return (
                [
                    <StyledMenuItem key="dropdownMyAccountItem">
                    <ListItemText
                        key="dropdownMyAccount"
                        primary={
                            <Typography type="body2" style={inlineStyles.bold}>
                                My Account
                            </Typography>
                            }
                        onClick={this.myAccountHandler}
                    />
                    </StyledMenuItem>,
                    <Divider variant="middle" key="divider"/>
                ]
            )
        } else {
            return null
        }
    }

    render() {
        const { classes } = this.props;
        const inlineStyles = {
            bold: { fontWeight: "bold" },
            search: { "aria-label": "search" },

        }

        return (
            <div>
                <header className="app-header">
                    <Link to={this.state.logoLink}>
                        <span className="logo">
                            Image Viewer
                        </span>
                    </Link>
                    <div>
                        {this.props.isLoggedIn && 
                            <div className="profile-container">
                                <IconButton className="icon" onClick={this.openMenuHandler}>
                                    <img className="avatar" src={this.props.profilePic} alt="pic" />
                                </IconButton>
                                <AccountMenu open={Boolean(this.state.isMenuOpen)} 
                                    keepMounted id="dropdown" 
                                    anchorEl={this.state.isMenuOpen}
                                    onClose={this.closeMenuHandler}
                                >
                                    {this.renderMyAccount()}
                                    <StyledMenuItem key="dropdownLogoutItem">
                                        <ListItemText
                                            key="dropdownLogout"
                                            primary={
                                                <Typography type="body2" style={inlineStyles.bold}>
                                                    Logout
                                                </Typography>
                                                }
                                            onClick={this.onLogout}
                                        />
                                    </StyledMenuItem>
                                </AccountMenu>
                            </div>
                        }
                    </div>

                    <div>
                        {(this.props.isLoggedIn) && (this.props.screen==="home") &&
                            <div className={classes.searchBar}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <Input placeholder="Search…"
                                    classes={{ root: classes.inputRoot, input: classes.inputInput}}
                                    inputProps={inlineStyles.search}
                                    onChange={this.searchChangeHandler}
                                    disableUnderline={true}
                                />
                            </div>
                        }
                    </div>
                </header>
            </div>
        );
    }
}

Header.defaultProps = {
    screen: "login",
    isLoggedIn: false,
    baseUrl: "https://graph.instagram.com/",
}

const styles = (theme) => ({
    searchIcon: {
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        height: "100%",
        position: "absolute",
        padding: theme.spacing(0, 2),
    },

    searchBar: {
        marginLeft: 0,
        width: "300px",
        position: "relative",
        borderRadius: "4px",
        float: "right",
        marginTop: "18px",
        backgroundColor: "#c0c0c0",

    },

    inputRoot: {
        color: "inherit",
    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      },
});

const StyledMenuItem = withStyles((theme) => ({ root: {}, }))(MenuItem);

const AccountMenu = withStyles({
    paper: {
        border: "4px",
        backgroundColor: "#ededed",
        marginTop: "6px",
    },
})((props) => (
    <Menu elevation={0} getContentAnchorEl={null}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        transformOrigin={{
            horizontal: "center",
            vertical: "top",
        }}
        {...props}
    >
    </Menu>
));

export default withStyles(styles)(Header);