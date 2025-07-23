import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../../hooks/useAxios';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  AVATAR_IMG_SRC,
  DEFAULT_AVATAR_IMG_ID,
  GENDER_TYPES,
  ReactionType,
  User,
  UserCode,
} from '../../constants';
import fireBtn from '../../assets/buttons/fire.png';
import likeBtn from '../../assets/buttons/Thumbs Up.png';
import dislikeBtn from '../../assets/buttons/Thumbs Down.png';
import { getAge } from '../../utils/ageUtil';
import { postVsCodeMessage } from '../../utils/vscodeApi';

import {
  StyledSlider,
  Wrapper,
  Card,
  InfoRow,
  UserBar,
  Profile,
  NameColumn,
  UserName,
  Meta,
  LanguagesBar,
  LangTitle,
  ReactionBar,
  ReactionImg,
  CommitText,
} from './ExplorePanel.styles';
import { Loading } from '../components/loading';

interface RecUser extends User {
  previous_reaction_type: ReactionType | null;
}

export const ExplorePanel: React.FC = () => {
  const { session } = useAuthContext();
  const [recs, setRecs] = useState<RecUser[]>([]);
  const [displayedUser, setDisplayedUser] = useState<RecUser | null>(null);
  const [userCodes, setUserCodes] = useState<UserCode[]>([]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    draggable: true,
    focusOnSelect: true,
    variableWidth: true,
  };

  useEffect(() => {
    console.log('Requesting session info from VS Code...');
    postVsCodeMessage({ type: 'requestSessionInfo' });
  }, []);

  // 추천 사용자 불러오기
  const fetchRecommendations = async () => {
    if (!session) return;
    console.log('Fetching recommendations...');
    try {
      const res = (
        await axiosRequest({
          method: 'GET',
          url: '/users/recommendations',
          headers: { Authorization: `Bearer ${session.serviceToken}` },
        })
      ).data;
      console.log('Fetched recommendations:', res);

      const users: RecUser[] = res.users;
      setRecs(users);
      if (users.length > 0) {
        setDisplayedUser(users[0]);
      } else {
        setDisplayedUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [session]);

  // displayedUser가 null이 되면 추천 목록을 다시 불러옴
  useEffect(() => {
    if (!session && !displayedUser) return;
    if (displayedUser === null) {
      fetchRecommendations();
    }
  }, [displayedUser, session]);

  // displayedUser가 바뀔 때마다 해당 사용자의 코드를 가져와서 상태에 저장
  useEffect(() => {
    if (!session || !displayedUser) return;

    const fetchUserCodes = async () => {
      console.log(`Fetching codes for user: ${displayedUser.id}`);
      try {
        const res = (
          await axiosRequest({
            method: 'GET',
            url: `/users/${displayedUser.id}/codes?pinned=true`,
            headers: { Authorization: `Bearer ${session.serviceToken}` },
          })
        ).data;
        console.log('Fetched user codes:', res.userCodes);

        setUserCodes(res.userCodes);
      } catch (err) {
        console.error('Failed to fetch user codes:', err);
      }
    };
    fetchUserCodes();
  }, [displayedUser]);

  const handleReaction = async (reactionType: ReactionType) => {
    if (!session || !displayedUser) return;
    try {
      await axiosRequest({
        method: 'POST',
        url: '/users/reactions',
        headers: { Authorization: `Bearer ${session.serviceToken}` },
        data: {
          to_user_id: displayedUser.id,
          reaction_type: reactionType,
        },
      });
      console.log('Reaction sent:', reactionType);

      // displayedUser을 recs 배열에서 다음 사람으로 넘김
      setDisplayedUser(prev => {
        if (!prev) return null;
        const currentIdx = recs.findIndex(u => u.id === prev.id);
        if (currentIdx === -1 || currentIdx + 1 >= recs.length) {
          // 마지막이면 추천 목록 다시 불러오기
          fetchRecommendations();
          return null;
        }
        return recs[currentIdx + 1];
      });
    } catch (err) {
      console.error('Failed to send reaction', err);
    }
  };

  if (!session || !displayedUser) {
    return <Loading />;
  }

  return (
    <Wrapper>
      {/* 코드 슬라이더 */}
      <StyledSlider {...settings}>
        {userCodes.length > 0 ? (
          userCodes.map((code: UserCode) => (
            <Card key={code.id}>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  margin: 0,
                  padding: '20px',
                }}
              >
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
            src={
              AVATAR_IMG_SRC[displayedUser.avatar_id || DEFAULT_AVATAR_IMG_ID]
            }
            alt={displayedUser.name}
          />
          <NameColumn>
            <UserName>{displayedUser.name}</UserName>
            <Meta>
              {displayedUser.gender},{' '}
              {getAge(new Date(displayedUser.birth_date))}
            </Meta>
          </NameColumn>
        </UserBar>
        <LanguagesBar>
          <LangTitle>
            Preferred <span>Languages</span>
          </LangTitle>
          <UserName>{displayedUser.most_preferred_language.name}</UserName>
          <UserName>{displayedUser.most_preferred_package.name}</UserName>
        </LanguagesBar>
      </InfoRow>

      <ReactionBar>
        <ReactionImg
          src={dislikeBtn}
          alt="Dislike"
          onClick={() => handleReaction(ReactionType.DISLIKE)}
          style={{ cursor: 'pointer' }}
        />
        <ReactionImg
          src={fireBtn}
          alt="Superlike"
          onClick={() => handleReaction(ReactionType.SUPER_LIKE)}
          style={{ cursor: 'pointer' }}
        />
        <ReactionImg
          src={likeBtn}
          alt="Like"
          onClick={() => handleReaction(ReactionType.LIKE)}
          style={{ cursor: 'pointer' }}
        />
      </ReactionBar>
      <CommitText>Commit!</CommitText>
    </Wrapper>
  );
};
