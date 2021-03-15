import React, { Component } from "react";
import Header from "../../common/Header";
import "./Home.css";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Divider, Tooltip } from '@material-ui/core/';
import FavoriteIcon from "@material-ui/icons/Favorite";
import { FormControl, Input, InputLabel, Button, FormHelperText } from "@material-ui/core/";

import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: window.sessionStorage.getItem("access-token") !== null ? true : false,
            //Profile picture is hard coded since it is not available from Instagram APIs
            profilePic: "https://instagram.fbom35-1.fna.fbcdn.net/v/t51.2885-19/s320x320/158183129_947536299373688_8583409002884684500_n.jpg?tp=1&_nc_ht=instagram.fbom35-1.fna.fbcdn.net&_nc_ohc=wKQEc3Qxs6QAX8bsWM8&oh=074d47a1fd4d3d1de7f4387ce9f6285e&oe=60720D64",
            allMediaIds: [],
            imageBase: [],
            imageList: [],
            likeIcon: "dispBlock",
            likedIcon: "dispNone",
            commentRequiredAlert: {},
            commentArea: "dispNone",
            commentsDisplay: {},

        };
    }

    // getHashtag = (caption) => caption.split(' ').filter(v => v.startsWith('#'))

    // getFormattedCaptionString = (caption) => {
    //     if (!caption) {
    //         return null;
    //     }
    //     let captionWords = caption.split(" ")
    //     let hashtags = this.getHashtag(caption)

    //     captionWords.map(function (word) {
    //         if (hashtags.includes(word)) {
    //             console.log("Hashtag " + word)
    //             return (
    //                 <div>blue {word}</div>
    //             )
    //         } else {
    //             return (
    //                 <div>word</div>
    //             )
    //         }
    //     })
    // }

    componentDidMount() {
        let data = null;
        let xhrMediaIds = new XMLHttpRequest();
        let accessToken = window.sessionStorage.getItem("access-token");

        //This XMLHttpRequest fetches all the media posts with their media IDs from the provided access token 
        xhrMediaIds.open("GET", this.props.baseUrl + "me/media?fields=id,caption&access_token=" + accessToken);
        xhrMediaIds.setRequestHeader("Cache-Control", "no-cache");
        xhrMediaIds.setRequestHeader("Content-Type", "application/json");
        xhrMediaIds.send(data);

        let that = this;
        xhrMediaIds.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    that.setState({
                        allMediaIds: JSON.parse(this.responseText).data,
                    });
                    //This method will fetch image data for each image 
                    // and subsequently keep it in state array 'imageList'
                    that.state.allMediaIds.map((mediaObject) => {
                        return that.getMedia(mediaObject);
                    });
                } else {
                    alert("Your access-token has expired or reached its limit. Please update your access token and/or try again later.");
                    that.props.history.push("/")
                }
            }
        });
    }

    addImage(imageResponse, caption) {
        let image = {};

        image.id = imageResponse.id;
        //caption is captured while retrieving media IDs requests using access token
        image.caption = caption; 
        image.media_url = imageResponse.media_url;
        image.profilePic = this.state.profilePic;
        image.username = imageResponse.username;
        image.likeIcon = "dispBlock";
        image.likedIcon = "dispNone";
        image.likes = {};
        //Random number of likes as last digit of media id since cannot retreive comments from Instagram API
        //Here is the number of like is taken as last digit of media_id given by Instagram API
        image.likes.count = Number(image.id.slice(-1));
        image.postComments = "dispNone";
        let commentsDisplay = this.state.commentsDisplay;
        commentsDisplay[image.id] = "none";
        this.setState({commentsDisplay: commentsDisplay});
        image.commentArea = "";
        image.clear = "";
        image.commentContent = [];
        image.timestamp = new Date(imageResponse.timestamp);

        let images;
        images = this.state.imageList.slice();
        images.push(image);

        //Sort images based on date to display in order of upload / published timestamp
        images.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.timestamp - b.timestamp;
          });
        this.setState({ imageList: images });
        this.setState({ imageBase: images });


    }

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
                //We filter only for IMAGE type data and filter out VIDEO/CAROUSEL ALBUM medias as per TA
                if(responseMedia.media_type === "IMAGE") {
                    that.addImage(responseMedia, mediaObject.caption);
                }
            }
        });
    }

    likeClickHandler = (id) => {
        let imageList = this.state.imageList;
        imageList.forEach(function (image) {
            if (image.id === id) {
                image.likes.count += 1;
                image.likeIcon = "dispNone";
                image.likedIcon = "dispBlock";
                this.setState({
                    likeIcon: "dispNone",
                    likedIcon: "dispBlock",
                });
            }
        }, this);
    };

    unlikeClickHandler = (id) => {
        let imageList = this.state.imageList;
        imageList.forEach(function (image) {
            if (image.id === id) {
                image.likes.count -= 1;
                image.likeIcon = "dispBlock";
                image.likedIcon = "dispNone";
                this.setState({
                    likeIcon: "dispBlock",
                    likedIcon: "dispNone",
                });
            }
        }, this);
    };

    commentChangeHandler = (event, id) => {
        this.setState({ comment: event.target.value });
        let imageList = this.state.imageList;
        imageList.forEach(function (image) {
            if (image.id === id) {
                image.clear = event.target.value;
            }
        }, this);
    };

    addCommentHandler = (id) => {
        if (!this.state.comment) {
            let commentRequiredAlert = this.state.commentRequiredAlert;
            commentRequiredAlert[id] = 'required';
            this.setState({commentRequiredAlert: commentRequiredAlert});

        } else {
            let commentRequiredAlert = this.state.commentRequiredAlert;
            commentRequiredAlert[id] = '';
            this.setState({commentRequiredAlert: commentRequiredAlert});

            let commentDisplay = this.state.commentsDisplay;
            commentDisplay[id] = 'block';
            this.setState({commentDisplay: commentRequiredAlert});

            let imageList = this.state.imageList;
            imageList.forEach(function (image) {
                if (image.id === id) {
                    image.commentContent.push(this.state.comment);
                    this.setState({ comment: "" });
                    image.clear = "";
                }
            }, this);
        }
    };

    getDatetimeString(timestamp){
        //Padding 0 in front of dates amd months to achieve dd/mm/yyyy date format
        let datetimeString = String(timestamp.getDate()).padStart(2, '0') + "/" +
        String((timestamp.getMonth() + 1)).padStart(2, '0') + "/" + timestamp.getFullYear() + " " 
        + timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds()

        return datetimeString;
    }

    searchKeywordHandler = (keyword) => {
        let filterImages = this.state.imageBase.filter((image) => {
                return String(image.caption).toLowerCase().indexOf(keyword) >= 0;
            });
        this.setState({ imageList: filterImages});
    };

    sendImages = () => {
        return "here!!!";
    }

    render() {
        const { classes } = this.props;
        const isLoggedIn = this.state.isLoggedIn;

        return (
            <div>
                {/* display the contents only if the user is logged in */}
                {isLoggedIn &&
                    <div>
                        <Header
                            screen="home"
                            isLoggedIn={this.state.isLoggedIn}
                            profilePic={this.state.profilePic}
                            baseUrl={this.props.baseUrl}
                            list={this.state.imageBase}
                            searchBarHandler={this.searchKeywordHandler}
                            history={this.props.history}
                            sendImages={this.sendImages}
                        />
                        <div className="home-page-container">
                            {this.state.imageList.map((image) => (
                                <Card className="grid-item" key={"image" + image.id}>
                                    <div className="images">
                                        <CardHeader
                                            avatar={<Avatar src={image.profilePic} alt="profilePic" />}
                                            title={image.username}
                                            subheader={this.getDatetimeString(image.timestamp)}
                                        />
                                        <CardContent>
                                            <CardMedia
                                                component={image.media_type === 'VIDEO' ? 'iframe' : 'div'}
                                                className={image.media_type === 'VIDEO' ? classes.video : classes.image}
                                                image={image.media_url}
                                            />
                                            < br />
                                            <Divider />
                                            <Typography variant="body2" color="inherit" component="p">
                                                {image.caption && image.caption.split(" ").map(function (word, index) {
                                                    if (image.caption) {
                                                        let hashtags = image.caption.split(' ').filter(v => v.startsWith('#'))
                                                        if (hashtags) {
                                                            if (hashtags.includes(word)) {
                                                                return (
                                                                    <span style={{ color: "blue" }} key={"caption" + index}>{word} </span>
                                                                )
                                                            } else {
                                                                return (
                                                                    <span key={"caption" + index}>{word} </span>
                                                                )
                                                            }
                                                        } else {
                                                            return (<span key={"caption" + index}>{word} </span>)
                                                        }
                                                    } else {
                                                        return null
                                                    }
                                                })
                                                }
                                            </Typography>
                                            <CardActions disableSpacing>
                                                <div className="likes">
                                                    <div
                                                        className={image.likeIcon}
                                                        onClick={() => this.likeClickHandler(image.id)}
                                                    >
                                                        <FavoriteBorderIcon />
                                                    </div>
                                                    <div className={image.likedIcon}>
                                                        <FavoriteIcon
                                                            style={{ color: "red" }}
                                                            onClick={() => this.unlikeClickHandler(image.id)}
                                                        />
                                                    </div>
                                                    <span style={{ marginLeft: 10, marginBottom: 8 }}>
                                                        {image.likes.count < 2 ? (
                                                            <div> {image.likes.count} like </div>
                                                        ) : (
                                                                <div> {image.likes.count} likes </div>
                                                            )}
                                                    </span>
                                                </div>
                                            </CardActions>
                                            <div className="comments-section">
                                                {image.commentContent.map((value, index) => (
                                                    <CardActions>
                                                        <div key={"comment" + index}>
                                                            <Typography
                                                                key={"comment-text" + index}
                                                                variant="body2"
                                                                color="inherit"
                                                                component="span"
                                                                style={{ fontWeight: "bold", 
                                                                display: this.state.commentsDisplay[image.id] }}
                                                            >
                                                                {image.username}:{" "}
                                                                <span style={{ fontWeight: "normal"}}>
                                                                    {value}
                                                                </span>
                                                            </Typography>
                                                        </div>
                                                    </CardActions>
                                                ))}
                                            </div>
                                            <br />
                                            <div className="comments">
                                                <FormControl className="control">

                                                    <InputLabel htmlFor="comment">
                                                        Add a comment
                                                    </InputLabel >

                                                    <Input
                                                        comment={this.state.comment}
                                                        onChange={(event) =>
                                                            this.commentChangeHandler(event, image.id)
                                                        }
                                                        value={image.clear}
                                                    />
                                                    <FormHelperText className={this.state.usernameRequired}>
                                                        <span className="red">{this.state.commentRequiredAlert[image.id]}</span>
                                                    </FormHelperText>
                                                </FormControl>
                                                <Tooltip title="Add a comment">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginLeft: 20 }}
                                                    onClick={() => this.addCommentHandler(image.id)}
                                                >
                                                    ADD
                                                </Button>
                                                </Tooltip>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>}

                    {
                        !isLoggedIn && 
                        this.props.history.push("/")
                    }
            </div>
        );
    }
}

const imageStyle = (theme) => ({
    image: {
        height: 150,
        paddingTop: "56.25%", //9:16 proportion.
    },
    video: {
        maxWidth: "100%",
    },
});

export default withStyles(imageStyle)(Home);