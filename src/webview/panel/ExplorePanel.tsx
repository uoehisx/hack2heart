import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../../hooks/useAxios';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  AVATAR_IMG_SRC,
  DEFAULT_AVATAR_IMG_ID,
  GENDER_TYPES,
  User,
} from '../../constants';
import Slider from 'react-slick';

import fireBtn from '../../assets/buttons/fire.png';
import likeBtn from '../../assets/buttons/Thumbs Up.png';
import dislikeBtn from '../../assets/buttons/Thumbs Down.png';
import styled from '@emotion/styled';
import { getAge } from '../../utils/ageUtil';
import { postVsCodeMessage } from '../../utils/vscodeApi';

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

interface RecUser {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birth_date: string;
  avatar_id?: number;
  most_preferred_language: string;
  most_preferred_package: string;
  looking_for_love: boolean;
  looking_for_friend: boolean;
  looking_for_coworker: boolean;
  tmis: { id: number; name: string }[];
  previous_reaction_type: 'SUPER_LIKE' | 'LIKE' | 'DISLIKE' | null;
}

interface UserCode {
  id: number;
  content: string;
  index: number | null;
  created_at: string;
}

export const ExplorePanel: React.FC = () => {
  const { session } = useAuthContext();
  const [recs, setRecs] = useState<RecUser[]>([]);
  const [displayedUser, setDisplayedUser] = useState<RecUser | null>(null);
  // ① userCodes 상태 추가
  const [userCodes, setUserCodes] = useState<UserCode[]>([]);

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

  useEffect(() => {
    console.log('Requesting session info from VS Code...');
    postVsCodeMessage({ type: 'requestSessionInfo' });
  }, []);

if (!session || !displayedUser) {
    return <p>Loading...</p>;
  }

  // 추천 사용자 불러오기
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = (await axiosRequest({
          method: 'GET',
          url: '/users/recommendations',
          headers: { Authorization: `Bearer ${session.serviceToken}` },
        })).data;

        const users: RecUser[] = res.users;
        setRecs(users);
        if (users.length > 0) {
          setDisplayedUser(users[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchRecommendations();
  }, [session]);

  // ② displayedUser가 바뀔 때마다 해당 사용자의 코드를 가져와서 상태에 저장
  useEffect(() => {
    axiosRequest({
      method: 'GET',
      url: `/users/${displayedUser.id}/codes`,
      headers: { Authorization: `Bearer ${session.serviceToken}` },
      params: {
        user_id: displayedUser.id,
        pinned: false,
      },
    })
    .then(res => {
      setUserCodes(res.data.userCodes);
    })
    .catch(console.error);
  }, [displayedUser]);

  const handleReaction = async (reactionType: 'SUPER_LIKE' | 'LIKE' | 'DISLIKE') => {
    try {
      await axiosRequest({
        method: 'POST',
        url: '/create_user_reaction',
        headers: { Authorization: `Bearer ${session.serviceToken}` },
        data: {
          to_user_id: displayedUser.id,
          reaction_type: reactionType,
        },
      });
      console.log('Reaction sent:', reactionType);
    } catch (error) {
      console.error('Failed to send reaction', error);
    }
  };

  return (
    <Wrapper>
      {/* ③ 코드 슬라이더 */}
      <StyledSlider {...settings}>
        {userCodes.length > 0 ? (
          userCodes.map(code => (
            <Card key={code.id}>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {code.content}
              </pre>
            </Card>
          ))
        ) : (
          <Card>
            <p>No code snippets available.</p>
          </Card>
        )}
      </StyledSlider>

      <InfoRow>
        <UserBar>
          <Profile
            src={AVATAR_IMG_SRC[displayedUser.avatar_id || DEFAULT_AVATAR_IMG_ID]}
            alt={displayedUser.name}
          />
          <NameColumn>
            <UserName>{displayedUser.name}</UserName>
            <Meta>
              {displayedUser.gender}, {getAge(new Date(displayedUser.birth_date))}
            </Meta>
          </NameColumn>
        </UserBar>
        <LanguagesBar>
          <LangTitle>
            Preferred <span>Languages</span>
          </LangTitle>
          <UserName>{displayedUser.most_preferred_language}</UserName>
          <UserName>{displayedUser.most_preferred_package}</UserName>
        </LanguagesBar>
      </InfoRow>

      <ReactionBar>
        <ReactionImg
          src={dislikeBtn}
          alt="Dislike"
          onClick={() => handleReaction('DISLIKE')}
          style={{ cursor: 'pointer' }}
        />
        <ReactionImg
          src={fireBtn}
          alt="Superlike"
          onClick={() => handleReaction('SUPER_LIKE')}
          style={{ cursor: 'pointer' }}
        />
        <ReactionImg
          src={likeBtn}
          alt="Like"
          onClick={() => handleReaction('LIKE')}
          style={{ cursor: 'pointer' }}
        />
      </ReactionBar>
      <CommitText>Commit!</CommitText>
    </Wrapper>
  );
};
