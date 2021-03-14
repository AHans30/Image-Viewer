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
            type: "",
            logoLink: this.props.screen === "login" ? "/" : "/home",
        };
    }

    openMenuHandler = (event) => {
        console.log(event.currentTarget)
        this.setState({ type: event.currentTarget });
    };

    closeMenuHandler = () => {
        this.setState({ type: null });
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
                    <StyledMenuItem>
                    <ListItemText
                        primary={
                            <Typography type="body2" style={inlineStyles.bold}>
                                My Account
                            </Typography>
                            }
                        onClick={this.myAccountHandler}
                    />
                    </StyledMenuItem>,
                    <Divider variant="middle" />
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
                                <AccountMenu open={Boolean(this.state.type)} 
                                    keepMounted id="dropdown" 
                                    anchorEl={this.state.type}
                                    onClose={this.closeMenuHandler}
                                >
                                    {this.renderMyAccount()}
                                    <StyledMenuItem>
                                        <ListItemText
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
    profilePic: "https://instagram.fbom35-1.fna.fbcdn.net/v/t51.2885-19/s320x320/158183129_947536299373688_8583409002884684500_n.jpg?tp=1&_nc_ht=instagram.fbom35-1.fna.fbcdn.net&_nc_ohc=wKQEc3Qxs6QAX8bsWM8&oh=074d47a1fd4d3d1de7f4387ce9f6285e&oe=60720D64",
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