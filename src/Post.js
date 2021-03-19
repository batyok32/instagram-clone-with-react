import React, { useEffect, useState } from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import { db } from './firebase';
import firebase from "firebase"
import ReactPlayer from 'react-player'
import videoThumnail from "./video__thumbnail.jpg"

function Post({user, postId, username, imageUrl, caption}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                    console.log("it is trying to set it", comments);
                });
                console.log("this is comments", comments);
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text : comment,
            username : user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("posted", comment);
        setComment(""); 
    }
{/* <video className='post__video' src={imageUrl}></video> */}
    const isImageUrl = require('is-image-url');
            // https://mk0hootsuiteblof6bud.kinstacdn.com/wp-content/uploads/2018/01/free-stock-videos-1.jpg
    return (
        <div className="post">
            <div className="post__header">
                < Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>

            {isImageUrl(imageUrl) ? (<img className="post__image" src={imageUrl} alt=""/>) : (<ReactPlayer previewTabIndex={1} fallback={<div>Connection Error</div>}  height='100%' width='100%' light={videoThumnail} controls='true' loop='true' volume='1' playing="true" className="post__video" url={imageUrl} />) }
            <h4 className="post__text"><strong>{username}</strong>: {caption}</h4>
            
            <div className="post__comments">
                {comments.map((comment) => (
                    <p className="post__comment">
                        <strong>{comment.username}:</strong> {comment.text}
                    </p>
                ))}
            </div>
            {user && (
                <form className="post__commentBox" action="">
                    <input 
                        type="text"
                        className="post__input"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    
                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}

            

        </div>
    )
}

export default Post
