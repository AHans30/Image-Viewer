import React, { Component } from "react";
import Header from "../../common/Header";
import "./Profile.css";
import { Typography, Fab, Modal, Button, FormControl, InputLabel, Input, FormHelperText, Avatar, GridListTile } from "@material-ui/core/";
import GridList from '@material-ui/core/GridList';
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

//This component displays the Profile page of the Image Viewer application.
class Profile extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: window.sessionStorage.getItem("access-token") !== null ? true : false,
            //Profile picture is hard coded since it is not available from Instagram APIs
            profilePic: "https://instagram.fbom35-1.fna.fbcdn.net/v/t51.2885-19/s320x320/158183129_947536299373688_8583409002884684500_n.jpg?tp=1&_nc_ht=instagram.fbom35-1.fna.fbcdn.net&_nc_ohc=wKQEc3Qxs6QAX8bsWM8&oh=074d47a1fd4d3d1de7f4387ce9f6285e&oe=60720D64",
            allMediaIds: [],

            //Hard coded values since these are not available from Basic Instagram API
            totalPostCount: 0,
            followingCount: 31,
            followersCount: 26,
            accountName: "Abhimanyu Hans",

            editModal: false,
            updateRequiredAlert: "dispNone",
            name: "",
            imageBase: [],
            showModal: false,

            //Metadata for displaying image currently selected in modal by the user
            commentRequiredAlert: "dispNone",
            media_url: "",
            username: "",
            caption: "",
            likeIcon: "",
            likedIcon: "",
            likesCount: 0,
            imageId: 0,
            comment: "",
        };
    }

    //This method is run after the component is mounted.
    //This method makes AJAX calls to get media Ids associated with the account attached with access token supplied
    componentDidMount() {
        let data = null;
        let xhrMediaIds = new XMLHttpRequest();
        let accessToken = window.sessionStorage.getItem("access-token");

        //This XMLHttpRequest fetches all the media posts with their media IDs from the provided access token 
        xhrMediaIds.open("GET", this.props.baseUrl + "me/media?fields=id,caption&access_token=" + accessToken);
        xhrMediaIds.setRequestHeader("Cache-Control", "no-cache");
        xhrMediaIds.setRequestHeader("Content-Type", "application/json");
        xhrMediaIds.send(data);

        //Since inside callback - 'this' will refer to the AJAX object of XMLHttpRequest type
        //We save the reference to the object 'Home' in local variable 'that'
        let that = this;
        xhrMediaIds.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    that.setState({
                        allMediaIds: JSON.parse(this.responseText).data,
                    });
                    that.state.allMediaIds &&
                        that.state.allMediaIds.map((mediaObject) => {
                            return that.getMedia(mediaObject);
                        });
                } else {
                    //If status code !==200 ie username and password are correct but the access token provided by user
                    // has either reached its limit or expired.
                    //In this case - user is alerted the same and is advised to try again or update the access token.
                    alert("Your access-token has expired or reached its limit. Please update your access token and/or try again later.");
                    sessionStorage.removeItem("access-token");
                    //The user is then taken to login page to try again.
                    that.props.history.push("/")
                }
            }
        });
    }

    //This method fetches data pertaining to all media Ids fetched from first API
    getMedia(mediaObject) {
        let data = null;
        let xhr = new XMLHttpRequest();
        let accessToken = window.sessionStorage.getItem("access-token");

        xhr.open("GET", this.props.baseUrl + mediaObject.id + "?fields=id,media_type,media_url,username,timestamp&access_token=" + accessToken );
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);

        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let responseMedia = JSON.parse(this.responseText);
                //**** PLEASE NOTE: We filter only for IMAGE type data and filter out VIDEO/CAROUSEL ALBUM medias as per TA
                if(responseMedia.media_type === "IMAGE") {
                    //This further calls method 'addImages' to populate state objects ie. store/cache the info received from the second API
                    that.addImage(responseMedia, mediaObject.caption);
                }
            }
        });
    }

    // This method also populates state objects to store/cache the info received from the second API
    addImage(imageResponse, caption) {
        let image = {};

        image.id = imageResponse.id;
        //caption is captured while retrieving media IDs requests using access token
        image.caption = caption
        image.media_url = imageResponse.media_url;
        image.profilePic = this.state.profilePic;
        image.username = imageResponse.username;
        image.likeIcon = "dispBlock";
        image.likedIcon = "dispNone";
        //Random number of likes as last digit of media id since cannot retreive comments from Instagram API
        //Here is the number of like is taken as last digit of media_id given by Instagram API
        image.likesCount = Number(image.id.slice(-1));
        image.clear = "";
        image.postComments = [];
        image.timestamp = new Date(imageResponse.timestamp);

        let images;
        images = this.state.imageBase.slice();
        images.push(image);

        //Sort images based on date to display in order of upload / published timestamp
        images.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.timestamp - b.timestamp;
            });

        this.setState({ imageBase: images });
        this.setState({ username: imageResponse.username });

        this.setState({
            totalPostCount: this.state.totalPostCount + 1
        });

    }

    //This method allows user to open edit account name modal
    editModalHandler = () => {
        this.setState({ editModal: true, updateRequiredAlert: "dispNone", name: "" });
    };

    //This method allows user to close the modal of selected image
    modalCloseHandler = () => {
        this.setState({ editModal: false, updateRequiredAlert: "dispNone" });
    };

    //This modal allows user to capture change in account name value eneter by user
    inputNameChangeHandler = (event) => {
        this.setState({ name: event.target.value });
    };

    //This method changes the accountName in runtime dynamically
    editNameHandler = () => {
        this.state.name === ""
            ? this.setState({ updateRequiredAlert: "dispBlock" })
            : this.setState({ accountName: this.state.name, editModal: false });
    };
    
    //This method closes the selected image modal
    imageModalCloseHandler = () => {
        this.setState({ showModal: false });
        this.setState({commentRequiredAlert: "dispNone"});
    };

    //This method opens the selected image modal and stores/caches the metadata of the image
    // in state variables. This allows user to add comments, like or unlike an image
    imageModalOpenHandler = (imageId) => {
        this.setState({ showModal: true });
        //filter the post according to the id and display it
        let modalImage = this.state.imageBase.filter((image) => {
            return image.id === imageId;
        })[0];

        this.setState({
            media_url: modalImage.media_url,
            username: modalImage.username,
            caption: modalImage.caption,
            likeIcon: modalImage.likeIcon,
            likedIcon: modalImage.likedIcon,
            likesCount: modalImage.likesCount,
            imageId: modalImage.id,
            postComments: modalImage.postComments,
        });
    };
    
    //This method takes cares of liking the modal image
    likeClickHandler = (id) => {
        let imageBase = this.state.imageBase;
        imageBase.forEach(function (image) {
            if (image.id === id) {
                image.likesCount += 1;
                image.likeIcon = "dispNone";
                image.likedIcon = "dispBlock";
                this.setState({
                    likeIcon: "dispNone",
                    likedIcon: "dispBlock",
                    likesCount: image.likesCount,
                });
            }
        }, this);
    };

    //This method takes cares of unliking the modal image
    unlikeClickHandler = (id) => {
        let imageBase = this.state.imageBase;
        imageBase.forEach(function (image) {
            if (image.id === id) {
                image.likesCount -= 1;
                image.likeIcon = "dispBlock";
                image.likedIcon = "dispNone";
                this.setState({
                    likeIcon: "dispBlock",
                    likedIcon: "dispNone",
                    likesCount: image.likesCount,
                });
            }
        }, this);
    };

    //This method allows user to comment on modal image.
    //This method also validates and renders helper text in case if empty comment
    addCommentHandler = (id) => {
        if (this.state.comment === "") {
            this.setState({commentRequiredAlert: "dispBlock"});
        } else {
            let imageBase = this.state.imageBase;
            this.setState({commentRequiredAlert: "dispNone"});
            imageBase.forEach(function (image) {
                if (image.id === id) {
                    image.postComments.push(this.state.comment);
                    this.setState({
                        comment: "",
                        postComments: image.postComments,
                    });
                    image.clear = "";
                }
            }, this);
        }
    };

    //This method is used to track the changes in comment input box
    commentChangeHandler = (event) => {
        this.setState({ comment: event.target.value });
    };

    //This method returns the caption such that #hashtags are formatted blue as done in instagram
    //****Please note this is done as per discussion with TA during live session */
    formattedCaption() {
        let caption = this.state.caption;
        if(caption) {
            return (
                caption.split(" ").map(function (word, index) {
                    let hashtags = caption.split(' ').filter(v => v.startsWith('#'))
                    if (hashtags) {
                        if (hashtags.includes(word)) {
                        return (
                            <span style={{ color: "blue" }} key={"caption"+index}>{word} </span>
                        )
                    } else {
                        return (
                            <span key={"caption"+index}>{word} </span> 
                        )
                    }
                    } else {
                        return (<span key={"caption"+index}>{word} </span>)
                    }
                }
                )
            )
        } else {
            return null;
        }
    }

    //This method renders the comment section dynamically based upon the comments are there or not.
    getCommentSection() {
        if(this.state.postComments)
            if(this.state.postComments.length > 0){
                return (
                    <div className="modal-comments-holder">
                    {this.state.postComments.map((value, key) => {
                        return (
                            <span key={"comment" + key}>
                                <span style={{ fontWeight: "bold" }}>
                                    {this.state.username}:{" "}
                                </span>
                                {value}
                            </span>
                        );
                    })}
                </div>
                )
            }
    }

    render() {
        const { classes } = this.props;
        const top = 50;
        const left = 50;
        const inlineStyle = {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };

        return (
            <div>
                {this.state.isLoggedIn &&
                    <div>
                        <Header 
                        screen="profile" 
                        isLoggedIn={true} 
                        history={this.props.history}
                        profilePic={this.state.profilePic} />
                        <div className="main-container">
                            <div className="info">
                                <img className="info-image" src={this.state.profilePic} alt={this.state.username} />
                                <div className="info-content">
                                    <Typography variant="h5" component="h1">
                                        {this.state.username}
                                    </Typography>
                                    <div className="info-metrics">
                                        <Typography variant="body1" component="h1" style={{ marginRight: "80px" }} >
                                            Posts: {this.state.totalPostCount}
                                        </Typography>
                                        <div>
                                            <Typography variant="body1" component="h1" style={{ marginRight: "80px" }} >
                                                Follows: {this.state.followingCount}
                                            </Typography>
                                        </div>
                                        <Typography variant="body1" component="h1">
                                            Followed By: {this.state.followersCount}
                                        </Typography>
                                    </div>
                                    <div className="info-name">
                                        <Typography variant="h6" component="h1" style={{ marginRight: "20px" }} >
                                            {this.state.accountName}
                                        </Typography>
                                        <Fab color="secondary" aria-label="edit" onClick={this.editModalHandler}>
                                            <EditIcon />
                                        </Fab>
                                    </div>
                                </div>
                                <Modal open={this.state.editModal} onClose={this.modalCloseHandler} 
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                >
                                    <div style={inlineStyle} className={classes.editStyle}>
                                        <Typography variant="h5" component="h1" style={{ marginBottom: "25px" }} >
                                            Edit
                                        </Typography>
                                        <FormControl required>
                                            <InputLabel htmlFor="name">Full Name</InputLabel>
                                            <Input id="name" type="text" name={this.state.name} onChange={this.inputNameChangeHandler} />
                                            <FormHelperText className={this.state.updateRequiredAlert}>
                                                <span className="red">required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br />
                                        <br />
                                        <br />
                                        <Button variant="contained" color="primary" onClick={this.editNameHandler} >
                                            Update
                                        </Button>
                                    </div>
                                </Modal>
                            </div>
                            <div className="image-grid">
                                <div className={classes.main}>
                                    <GridList cellHeight={400} className={classes.gridStyle} cols={3} >
                                        {this.state.imageBase.map((image) => (
                                            <GridListTile key={"grid" + image.id} onClick={() => this.imageModalOpenHandler(image.id)} >
                                                <img src={image.media_url} alt={this.state.username} />
                                            </GridListTile>
                                        ))}
                                    </GridList>
                                </div>
                                <Modal
                                    open={this.state.showModal}
                                    onClose={this.imageModalCloseHandler}
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                >
                                    <div style={inlineStyle} className={classes.editStyle}>
                                        <div className="modal-container">
                                            <div className="modal-image-container">
                                                <img
                                                    src={this.state.media_url}
                                                    alt={this.state.username}
                                                    height="90%"
                                                    width="100%"
                                                ></img>
                                            </div>
                                            <div>
                                                <div className="modal-header">
                                                    <Avatar aria-label="recipe" className="avatar">
                                                        <img
                                                            src={this.state.profilePic}
                                                            alt={this.state.username}
                                                            className="modal-avatar"
                                                        />
                                                    </Avatar>
                                                    <Typography
                                                        variant="body1"
                                                        component="p"
                                                        style={{ marginLeft: "20px" }}
                                                    >
                                                        {this.state.username}
                                                    </Typography>
                                                </div>
                                                <hr />
                                                <Typography variant="body1" component="p">
                                                    {this.formattedCaption()}
                                                </Typography>
                                                {this.getCommentSection()}
                                                <div className="modal-likes">
                                                    <div className={this.state.likeIcon} onClick={() =>
                                                            this.likeClickHandler(this.state.imageId)
                                                        }
                                                    >
                                                        <FavoriteBorderIcon />
                                                    </div>
                                                    <div className={this.state.likedIcon}>
                                                        <FavoriteIcon style={{ color: "red" }}
                                                            onClick={() =>
                                                                this.unlikeClickHandler(this.state.imageId)
                                                            }
                                                        />
                                                    </div>
                                                    <span style={{ marginLeft: 10, marginBottom: 8 }}>
                                                        {this.state.likesCount < 2 ? (
                                                            <div>{this.state.likesCount} like </div>
                                                        ) : (
                                                                <div>{this.state.likesCount} likes</div>
                                                            )}
                                                    </span>
                                                </div>
                                                <div className="modal-comments">
                                                    <FormControl className="modal-control">
                                                        <InputLabel htmlFor="comment">
                                                            Add a comment
                                                        </InputLabel>
                                                        <Input comment={this.state.comment} 
                                                        onChange={this.commentChangeHandler} 
                                                        value={this.state.comment}
                                                        />
                                                        <FormHelperText className={this.state.commentRequiredAlert}>
                                                            <span className="red">required</span>
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <Button variant="contained" color="primary" style={{ marginLeft: 20 }}
                                                        onClick={() =>
                                                            this.addCommentHandler(this.state.imageId)
                                                        }
                                                    >
                                                        ADD
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    }
            </div>
        );
    }
}

//This is for HOC component with inline styling as per react design with help of material-ui
const styles = (theme) => ({

    main: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
    },

    editStyle: {
        boxShadow: theme.shadows[5],
        padding: "20px",
        outline: "none",
        borderRadius: "5px",
        position: "absolute",
        backgroundColor: theme.palette.background.paper,
        borderStyle: "solid",
        borderColor: "gray",

    },

    gridStyle: {
        cursor: "pointer",
        height: 750,
        overflow: "hidden",
        width: "95%",

    },
});

export default withStyles(styles)(Profile);