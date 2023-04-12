import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { fetchPosts } from '../redux/slices/posts';
const TagsPage = () =>{
  const dispatch = useDispatch();
  const {tag} = useParams();
  const {posts} = useSelector(state=>state.posts);
  const userData = useSelector((state)=>state.auth.data);
  
  const postsIsLoading = posts.status === 'loading';

  const filteredPosts = posts ? posts.items.filter(post=>post.tags.indexOf(tag) !== -1) : [];
 
  React.useEffect(()=>{
   if(posts.items.length === 0){
    dispatch(fetchPosts());
   }
  },[])

  return (
  <>
   <h1>{tag}</h1>
   <Grid xs={8} item>
    {(postsIsLoading ? [...Array(5)] : filteredPosts).map((obj,index) => (
      postsIsLoading ? <Post isLoading key={index}/> :
      <Post
       key={obj._id}
       id={obj._id}
       title={obj.title}
       imageUrl={obj.imgUrl ? `http://localhost:8000${obj.imgUrl}` : '' }
       user={{
        avatarUrl: obj.author.avatarUrl ?? '',
        fullName: obj.author.nickname,
       }}
       createdAt={obj.createdAt.substr(0,10)}
       viewsCount={obj.viewsCount}
       commentsCount={3}
       tags={obj.tags}
       isEditable={userData?.user._id === obj.author._id}
      />
     ))}
   </Grid>
  </>
 )
}

export default TagsPage;