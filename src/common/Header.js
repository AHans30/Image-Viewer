import React, { Component } from "react";
import "./Header.css";
import { withStyles } from "@material-ui/core/styles";
import { ListItemText, Input, IconButton, Menu, MenuItem, Typography, Divider} from "@material-ui/core/";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";

//This is a dynamic header component. This component renders the header of the Image Viewer Application
// This Header renders header for all pages of application viz. Login, Home and Profile
// The component takes in props 'screen' whose values are 'login', 'home', and 'profile'
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //this state captures if the dropdown menu is open or closed. 
            isMenuOpen: "", //"" or null or undefined are considered as falsy values in JS
            //Dynamically changes the redirection of logo - login page if not logged in else home page
            logoLink: this.props.screen === "login" ? "/" : "/home",
        };
    }

    //This opens dropdown of header
    openMenuHandler = (event) => {
        this.setState({ isMenuOpen: event.currentTarget });
    };

    //This closes dropdown of header
    closeMenuHandler = (event) => {
        this.setState({ isMenuOpen: null });
    };

    //This takes in keyword from search bar and passes it to a callback method 'searchBarHandler' received from Home page
    searchChangeHandler = (event) => {
        let keyword = event.target.value.trimEnd();
        //searchBarHandler is a method defined in Home component and takes care of dynamic searching 
        // of images/posts based on keyword passed 
        this.props.searchBarHandler(keyword);
    };

    //Logs out user by deleting the access token and takes user to login page
    onLogout = () => {
        sessionStorage.removeItem("access-token");
        this.props.history.push("/");
    };

    //Takes user to profile page. This option is obviously only accessible to logged in user
    myAccountHandler = () => {
        this.props.history.push("/profile")
      };

    //Renders the option in dropdown for redirecting to profile page. 
    //This method takes care of conditional rendering based on current screen. 
    //Redirection option is only available to user on home page.  
    renderMyAccount() {

        //Inline styling used here by declaring as a const
        const inlineStyles = {
            bold: { fontWeight: "bold" },
            search: { "aria-label": "search" },
        }

        //If the user is on home page
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
        //Inline styling used here by declaring as a const
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
                        {/* Conditional rendering of content based on if user if logged in or not */}
                        {this.props.isLoggedIn && 
                            <div className="profile-container" style={{cursor: "pointer"}}>
                                <IconButton className="icon" onClick={this.openMenuHandler} >
                                    <img className="avatar" src={this.props.profilePic} alt="pic" />
                                </IconButton>
                                <AccountMenu open={Boolean(this.state.isMenuOpen)} 
                                    keepMounted id="dropdown" 
                                    anchorEl={this.state.isMenuOpen}
                                    onClose={this.closeMenuHandler}
                                >
                                    {/* Conditional rendering of 'My Account' option in dropdown for redirect to profile page */}
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
                        {/* Conditional rendering of search bar - which is only available to logged in user
                        currently on home page */}
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

//styles which are used as Higher Order Components in react
//This is clean method of using inline styling and reacts's design which allows components to composited within each other
const styles = (theme) => ({

    //Styling for search icon
    searchIcon: {
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        height: "100%",
        position: "absolute",
        padding: theme.spacing(0, 2),
    },

    //styling for search bar
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

//This is another higher order component (HOC) - which is a Menu component from material-ui
// and is styled by using HOC styling design in react. 
//This method is used for our dropdown.
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