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

const CARD_WIDTH = 580;


/* ───────── 레이아웃 컨테이너 ───────── */
/* → 전체 ExplorePanel 을 원하는 만큼 아래로 이동 */
const Wrapper = styled.div`
  margin-top: 40px;
  background: #1f1f1f;
  padding: 32px 0; /* 카드 묶음을 아래로 내림 */
`;

/* ───────── Slider 커스텀 ───────── */
const StyledSlider = styled(Slider)`
  /* 좌·우 화살표 숨기기 */
  .slick-prev,
  .slick-next {
    display: none !important;
  }

  /* slide 간 여백 */
  .slick-slide {
    width: ${CARD_WIDTH}px !important;
    padding: 0 12px;
    box-sizing: border-box;
  }

  /* dots 위치 & 간격 조정 */
  .slick-dots {
    position: absolute;
    top: -24px;
    left: 0;
    right: 0;
    display: flex !important;
    justify-content: center;
    /* 슬라이더 아래 여백 */
    li {
      margin: 0 4px;
    }
    button:before {
      font-size: 10px; /* 기본 점 크기 */
      color: #bbb; /* 비활성 색상 */
      opacity: 1; /* 투명도 초기화 */
    }
    .slick-active button:before {
      color: #a37ef2; /* 활성 점 색상 */
    }
  }
`;

/* ───────── 카드 항목 ───────── */
const Card = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px #1f1f1f;
  height: 500px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;
const InfoRow = styled.div`
  margin: 28px auto 0;
  display: flex;
  gap: 24px; /* 두 박스 사이 간격 */
  justify-content: center;
  flex-wrap: wrap; /* 화면이 좁아지면 아래로 내려가도록 */
`;

/* 모든 작은 카드(좌우 박스)에 공통으로 쓸 스타일 */
const BaseCard = styled.div`
  flex: 0 0 ${CARD_WIDTH / 2}px; /* 고정 너비 */
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px #1f1f1f;
  padding: 20px 28px;
  display: flex;
`;

const UserBar = styled(BaseCard)`
  align-items: center;
  gap: 16px;
`;
const Profile = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0e8ff;
`;
const NameColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`;

const Meta = styled.span`
  margin-top: 2px;
  font-size: 14px;
  color: #a37ef2;
`;

const LanguagesBar = styled(BaseCard)`
  flex-direction: column;
  gap: 12px;
`;

const LangTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;

  /* ‘Languages’만 보라색 강조 */
  & > span {
    color: #a37ef2;
  }
`;

const ReactionBar = styled.div`
  margin: 40px auto 0;
  max-width: 280px;
  background: #1a1a1a;
  border-radius: 999px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px #1f1f1f;
  padding: 20px 28px;
  display: flex;
  justify-content: center;
  gap: 70px;
`;

const ReactionImg = styled.img`
  width:36px;
  height:36px;
  cursor:pointer;
  transition:transform:0.15s;
  &:hover{
    transform:scale(1.2);}
`;

const CommitText = styled.span`
  display: block;
  margin: 24px auto 0;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: #a37ef2;
`;

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
