import styled from '@emotion/styled';
import Slider from 'react-slick';

export const CARD_WIDTH = 580;
/* ───────── 레이아웃 컨테이너 ───────── */
/* → 전체 ExplorePanel 을 원하는 만큼 아래로 이동 */
export const Wrapper = styled.div`
  margin-top: 40px;
  background: #1f1f1f;
  padding: 32px 0; /* 카드 묶음을 아래로 내림 */
`;

/* ───────── Slider 커스텀 ───────── */
export const StyledSlider = styled(Slider)`
  /* slide 간 여백 */
  .slick-slide {
    width: ${CARD_WIDTH}px !important;
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
export const Card = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px #1f1f1f;
  height: 500px;
  width: 100%;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ;
`;
export const InfoRow = styled.div`
  margin: 28px auto 0;
  display: flex;
  gap: 24px; /* 두 박스 사이 간격 */
  justify-content: center;
  flex-wrap: wrap; /* 화면이 좁아지면 아래로 내려가도록 */
`;

/* 모든 작은 카드(좌우 박스)에 공통으로 쓸 스타일 */
export const BaseCard = styled.div`
  flex: 0 0 ${CARD_WIDTH / 2}px; /* 고정 너비 */
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px #1f1f1f;
  padding: 20px 28px;
  display: flex;
`;
export const UserBar = styled(BaseCard)`
  align-items: center;
  gap: 16px;
`;
export const Profile = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0e8ff;
`;
export const NameColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
export const UserName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`;

export const Meta = styled.span`
  margin-top: 2px;
  font-size: 14px;
  color: #a37ef2;
`;

export const LanguagesBar = styled(BaseCard)`
  flex-direction: column;
  gap: 12px;
`;
export const LangTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;

  /* ‘Languages’만 보라색 강조 */
  & > span {
    color: #a37ef2;
  }
`;

export const ReactionBar = styled.div`
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

export const ReactionImg = styled.img`
  width:36px;
  height:36px;
  cursor:pointer;
  transition:transform:0.15s;
  &:hover{
    transform:scale(1.2);}
`;

export const CommitText = styled.span`
  display: block;
  margin: 24px auto 0;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: #a37ef2;
`;
