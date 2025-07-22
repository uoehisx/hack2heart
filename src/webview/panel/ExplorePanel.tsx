import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, {useState,useEffect} from 'react';
import {axiosRequest} from '../../hooks/useAxios';
import {Badge} from '../components/badge';
import {useAuthContext} from '../../contexts/AuthContext';
import { AVATAR_IMG_SRC, DEFAULT_AVATAR_IMG_ID, GENDER_TYPES,User} from '../../constants';
import Slider from 'react-slick';

import fireBtn from '../../assets/buttons/fire.png';
import likeBtn from '../../assets/buttons/Thumbs Up.png';
import dislikeBtn from '../../assets/buttons/Thumbs Down.png';
import styled from '@emotion/styled';
import { getAge } from '../../utils/ageUtil';

import{
  StyledSlider,
  Wrapper,
  Card,
  InfoRow,
  BaseCard,
  UserBar,
  Profile,
  NameColumn,
  UserName,
  Meta,
  LanguagesBar,
  LangTitle,
  ReactionBar,
  ReactionImg,
  CommitText

} from './ExplorePanel.styles';

export const ExplorePanel: React.FC = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
  };
  const {session}=useAuthContext();
  const [currentUser,setCurrentUser]=useState<User|null>(null);
  const [openChats,setOpenChats]=useState(false);

    useEffect(() => {
      // 최초 진입 시 사용자 정보 요청
      const fetchUserProfile = async () => {
        console.log('serviceToken:', session?.serviceToken);
        if (session) {
          try {
            const response = await axiosRequest({
              method: 'GET',
              url: '/users/me',
              headers: {
                Authorization: `Bearer ${session.serviceToken}`,
              },
            });
  
            setCurrentUser(response.data);
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
          }
        }
      };
      fetchUserProfile();
    }, [session]);

  if (!session || !currentUser) {
    return <p>Loading...</p>;
  }


  return (
    <Wrapper>
      <StyledSlider {...settings}>
        {[1, 2, 3, 4, 5].map(n => (
          <Card key={n}></Card>
        ))}
      </StyledSlider>
      <InfoRow>
        <UserBar>
          <Profile src={AVATAR_IMG_SRC[currentUser.avatar_id || DEFAULT_AVATAR_IMG_ID]} alt={currentUser.name} />
          <NameColumn>
            <UserName>{currentUser.name}</UserName>
            <Meta>
              {currentUser.gender}, {getAge(currentUser.birth_date)}
            </Meta>
          </NameColumn>
        </UserBar>
        <LanguagesBar>
          <LangTitle>
            Preferred <span>Languages</span>
          </LangTitle>
          <UserName>
            {currentUser.most_preferred_language}
          </UserName>
          <UserName>
            {currentUser.most_preferred_package}
          </UserName>
        </LanguagesBar>
      </InfoRow>
      <ReactionBar>
        <ReactionImg src={dislikeBtn} alt="Dislike" />
        <ReactionImg src={fireBtn} alt="Superlike" />
        <ReactionImg src={likeBtn} alt="Like" />
      </ReactionBar>
      <CommitText>Commit!</CommitText>
    </Wrapper>
  );
};
