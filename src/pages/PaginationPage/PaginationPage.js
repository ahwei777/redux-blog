/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, { useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../../components/templates/Wrapper';
import Post from '../../components/templates/Post';
import PaginationWrapper from '../../components/templates/PaginationWrapper';
import styled from 'styled-components';
import {
  getPost,
  setByPagePostData,
  selectIsGettingPost,
  selectByPagePostData,
  selectTotalPostCount,
} from '../../redux/reducers/postReducer';
import PostLoadingBackground from '../../components/Loaders/LoopCircleLoading';
import SideBar from '../../components/SideBar';

const Layout = styled.div`
  display: flex;
`;

function PaginationPage() {
  const { page } = useParams();
  const dispatch = useDispatch();
  const isGettingPost = useSelector(selectIsGettingPost);
  const byPagePostData = useSelector(selectByPagePostData);
  const totalPostsCount = useSelector(selectTotalPostCount);

  // page 更新時拿新資料
  useEffect(() => {
    dispatch(getPost('byPage', page));
    // 跳轉至葉面頂端，提升使用者體驗
    window.scrollTo(0, 0);
    //  clean up 避免下次回來時因為仍有舊資料而短暫顯示
    return () => {
      dispatch(setByPagePostData(null));
    };
  }, [dispatch, page]);

  return (
    <>
      {isGettingPost && <PostLoadingBackground />}

      <Layout>
        <SideBar />
        <Wrapper>
          {byPagePostData && byPagePostData.length > 0 && (
            <>
              {/* post */}
              {byPagePostData.map((post) => (
                <Post key={post.id} post={post} />
              ))}
              {/* 分頁按鈕列 */}
              <PaginationWrapper
                postsCount={totalPostsCount}
                currentPage={page}
              />
            </>
          )}
        </Wrapper>
      </Layout>
    </>
  );
}

export default memo(PaginationPage);
