import React, {useState, useEffect, useContext} from 'react'

import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';

import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';

import RootComment from 'components/Comments/EpisodeComments/RootComment.js';

import "assets/css/EpisodePage.css";
import "assets/css/Comments.css";
import axios from 'axios';

import { useParams } from "react-router";

export default function RootCommentList({render, setRender}){

    const [error, setError] = useState("");
    const [comments, setComments] = useState([])
    const [commentCount, setCommentCount] = useState(0)
    const [curPage, setCurPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const { pk } = useParams()
    const episode_comment_list_url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/episode_comments_root_list/${pk}`)    

    useEffect(()=>{
        /**
            Get all them comments for the episode! 
        */
        GetValidToken().then(()=>{
            axios({
            method: 'get',
            url: episode_comment_list_url.concat(`?page=${curPage}`),
            headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'Authorization': GetAuthHeader()
            }}).then((response) => {
            if(response.data && response.data.results){
                //Re-render the comments on submission
                setComments(response.data.results)
                setTotalPages(response.data.total_pages)
                setCommentCount(response.data.count)
            }

            }).catch((error) =>{
                console.log(error)
                if(error.response && error.response.data && error.response.data.detail){
                  setError(error.response.data.detail);
                }else {
                  setError("Something went wrong. Please try again later")
                }
            })

        }).catch(msg=>{
        //Authentication error, send an anonymous request
            axios({
                method: 'get',
                url: episode_comment_list_url.concat(`?page=${curPage}`),
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                }}).then((response) => {
                    if(response.data && response.data.results){
                        //Re-render the comments on submission
                        setComments(response.data.results)
                        setTotalPages(response.data.total_pages)
                        setCommentCount(response.data.count)
                }

                }).catch((error) =>{
                    if(error.response && error.response.data && error.response.data.detail){
                      setError(error.response.data.detail);
                    }else {
                      setError("Something went wrong. Please try again later")
                    }
                })
        })

    },[render, curPage])

    const handlePageChange = (event, page) =>{
        setCurPage(page)
    }

    return (
        <div className="episode-comment-list">
            {render}
            {error != "" ? <Alert severity="error">{error}</Alert>: null}
            <div className="episode-comment-count">
                {commentCount > 0 
                ? <>{commentCount} Comment{commentCount > 1 ? <>s</>: null}</> 
                : <>No comments yet. Be the first!</>
                }</div>
            {comments.map(comment => (
                <React.Fragment key = {`episode-comment-${comment.pk}`}>
                    <RootComment 
                        username={comment.user.username}
                        user_pk={comment.user.pk}
                        postDate={comment.post_date}
                        timeStamp={comment.time_stamp}
                        text={comment.text}
                        pk={comment.pk}
                        num_likes={comment.num_likes}
                        user_liked={comment.cur_user_liked}
                        user_flagged={comment.cur_user_flagged}
                    />
                </React.Fragment>
                ))}
            {totalPages > 1 
                ? <Pagination count={totalPages} page={curPage} onChange={handlePageChange}/>
                : null
            }
        </div>
        )
}