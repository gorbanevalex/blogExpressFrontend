import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = React.useState('createdAt');
  const {tags, posts} = useSelector(state=>state.posts);
  const userData = useSelector((state)=>state.auth.data);
  
  const postsIsLoading = posts.status === 'loading';
  const tagsIsLoading = tags.status === 'loading';
  
  React.useEffect(()=>{
    dispatch(fetchPosts(sortBy));
  },[sortBy])

  React.useEffect(()=>{
    dispatch(fetchTags());
  },[]);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={Number(sortBy==='viewsCount')} aria-label="basic tabs example">
        <Tab label="Новые" onClick={()=>setSortBy('createdAt')}/>
        <Tab label="Популярные" onClick={()=>setSortBy('viewsCount')}/>
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(postsIsLoading ? [...Array(5)] : posts.items).map((obj,index) => (
            postsIsLoading ? <Post isLoading key={index}/> :
            <Post
              key={obj._id}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imgUrl ? `http://45.141.76.148:8000${obj.imgUrl}` : '' }
              user={{
                avatarUrl: obj.author.avatarUrl ?? '',
                fullName: obj.author.nickname,
              }}
              createdAt={obj.createdAt.substr(0,10)}
              viewsCount={obj.viewsCount}
              commentsCount={obj.comments.length}
              tags={obj.tags}
              isEditable={userData?.user?._id === obj.author?._id}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={tagsIsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
