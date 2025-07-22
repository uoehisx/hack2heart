import React, { useState, useEffect, ChangeEvent, FocusEvent, useRef } from 'react';
import { axiosRequest, useAxios } from '../../hooks/useAxios';
import { GENDER_TYPES } from '../../types';
import { openSidebar } from '../panel/TestPanel';
import { SIDEBAR_TYPES } from '../../constants';
import styled from '@emotion/styled';
import { Badge } from '../components/badge';

// --- styled helpers ---
const Container = styled.div`
  margin-top: 30px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, sans-serif;
`;

const Form = styled.form`
  width: 320px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Field = styled.div`
  width: 100%;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const RemovableBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  color: #ffffff;
`;

// ToggleBadge for “I like to…” options
const ToggleBadge = styled.div<{ selected: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  margin: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  background-color: ${({ selected }) => (selected ? '#556cd6' : 'transparent')};
`;

// --- constants & assets ---
const AVATAR_IMG_SRC = [
  require('../../assets/profileImage/gopher.png'),
  require('../../assets/profileImage/kodee.png'),
  require('../../assets/profileImage/octocat.png'),
  require('../../assets/profileImage/rustcrab.png'),
  require('../../assets/profileImage/scratchcat.png'),
  require('../../assets/profileImage/tux.jpeg'),
];

interface LanguageInfo {
  id: number;
  name: string;
}

interface PackageInfo{
  id:number;
  name:string;
}

interface TmiInfo{
  id:number;
  name:string;
}

export const ProfileSidebar = () => {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [avatarId, setAvatarId] = useState(0);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(GENDER_TYPES.MALE);
  const [lookingForLove, setLookingForLove] = useState<boolean>(true);
  const [lookingForFriend, setLookingForFriend] = useState<boolean>(false);
  const [lookingForCoWorker, setLookingForCoWorker] = useState<boolean>(false);
  const [preferredPackage, setPreferredPackage] = useState('');
  const [likeTo, setLikeTo] = useState<string[]>([]);


  const [languageInput, setLanguageInput] = useState('');
  const [languageList, setLanguageList] = useState<LanguageInfo[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageInfo | null>(null);

  const[packageInput,setpackageInput]=useState('');
  const [packagelist,setPackageList]=useState<PackageInfo[]>([]);
  const[selectedPackage,setSelectedPackage]=useState<PackageInfo| null>(null);

  const [tmiList,setTmiList]=useState<TmiInfo[]>([]);
  const[selectedTmi,setSelectedTmi]=useState<TmiInfo[]>([]);


  useEffect(() => {
    // Pick a random profile image on first mount
    const idx = Math.floor(Math.random() * AVATAR_IMG_SRC.length);
    setAvatarId(idx);

    const fetchTmis=async()=>{
      try{
        const res=await axiosRequest<{tmis:TmiInfo[]}>({
          method:'GET',
          url:'/tmis',
        });
        setTmiList(res.data.tmis);
      }catch(err){
        console.error('failed to fetch TMIs',err);
      }
    };
    fetchTmis();
  }, []);

  const onLanguageInputChangeHandler = async (input: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);


    if(!input) {
      setLanguageList([]);
      return;
    }

    // 마지막 입력 후 300ms 동안 추가 입력이 없으면 실제 요청 실행
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await axiosRequest({
          method: 'GET',
          url: `/languages?query=${encodeURIComponent(input)}`,
        });
        setLanguageList(res.data.languages);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  }

  // 삭제 버튼 클릭 시 빈 값으로 저장
  const handleLanguageRemove=()=>{
    setSelectedLanguage(null);
  };

  const toggleLikeTo = (opt: string) =>
    setLikeTo(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    );
const onPackageInputChangeHandler = async (input: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);


    if(!input) {
      setPackageList([]);
      return;
    }

    // 마지막 입력 후 300ms 동안 추가 입력이 없으면 실제 요청 실행
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await axiosRequest({
          method: 'GET',
          url: `/packages?query=${encodeURIComponent(input)}`,
        });
        setPackageList(res.data.packages);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  }

  // 삭제 버튼 클릭 시 빈 값으로 저장
  const handlePackageRemove=()=>{
    setSelectedPackage(null);
  };
  const handleTmiToggle = (tmi: TmiInfo) => {
    setSelectedTmi(prev =>
      prev.find(x => x.id === tmi.id)
        ? prev.filter(x => x.id !== tmi.id)  // 이미 있으면 제거
        : [...prev, tmi]                     // 없으면 추가
  );
};
  
  
  

  const onContinueButtonHandler = async () => {
    // const session = await getVsCodeSession();
    // console.log('Session:', session);
    const result = await axiosRequest({
      method: 'POST',
      url: '/users',
      data: {
        // github_oauth_id: 'test',
        name,
        gender,
        birth_date: birth,
        avatar_id: avatarId,
        looking_for_love: lookingForLove,
        looking_for_friend: lookingForFriend,
        looking_for_coworker: lookingForCoWorker,
      },
    });
    console.log('Profile created:', result.data);
    // openSidebar(SIDEBAR_TYPES.HOME);
  };

  return (
    <Container>
      <Form lang="en">
        {/* Profile Image & Name */}
        <img
          src={AVATAR_IMG_SRC[avatarId]}
          alt="profile"
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #eee',
          }}
        />
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: '80%',
            padding: 8,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
            textAlign: 'center',
          }}
        />

        {/* Date of Birth */}
        <Field>
          <FieldLabel>Date of Birth</FieldLabel>
          <input
            type="date"
            value={birth}
            onChange={e => setBirth(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 6,
              border: '1px solid #ccc',
            }}
            lang="en-CA"
          />
        </Field>

        {/* Gender */}
        <Field>
          <FieldLabel>Gender</FieldLabel>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <input
                type="checkbox"
                name="gender"
                value={GENDER_TYPES.MALE}
                checked={gender === GENDER_TYPES.MALE}
                onChange={() => setGender(GENDER_TYPES.MALE)}
                lang="en"
              />
              Male
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <input
                type="checkbox"
                name="gender"
                value={GENDER_TYPES.FEMALE}
                checked={gender === GENDER_TYPES.FEMALE}
                onChange={() => setGender(GENDER_TYPES.FEMALE)}
                lang="en"
              />
              Female
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <input
                type="checkbox"
                name="gender"
                value={GENDER_TYPES.OTHER}
                checked={gender === GENDER_TYPES.OTHER}
                onChange={() => setGender(GENDER_TYPES.OTHER)}
                lang="en"
              />
              Other
            </label>
          </div>
        </Field>

        {/* Looking For */}
        <Field>
          <FieldLabel>Looking For</FieldLabel>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <input
                type="checkbox"
                name="looking"
                checked={lookingForLove}
                onChange={() => {
                  setLookingForLove(!lookingForLove);
                }}
                lang="en"
              />
              Love
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <input
                type="checkbox"
                name="looking"
                checked={lookingForFriend}
                onChange={() => {
                  setLookingForFriend(!lookingForFriend);
                }}
                lang="en"
              />
              Friend
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <input
                type="checkbox"
                name="looking"
                checked={lookingForCoWorker}
                onChange={() => {
                  setLookingForCoWorker(!lookingForCoWorker);
                }}
                lang="en"
              />
              Co-workder
            </label>
          </div>
        </Field>

        {/* Most Preferred Language */}
        <Field>
          <FieldLabel>Most Preferred Language</FieldLabel>
          <BadgeRow>
            {selectedLanguage ? (
              <RemovableBadge>
                <Badge text={selectedLanguage.name} />
                <RemoveButton
                  onClick={handleLanguageRemove}
                  aria-label="Remove language"
                >
                  ×
                </RemoveButton>
              </RemovableBadge>
            ) : (
              <>
                <input
                  list="language-options"
                  value={languageInput}
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    marginBottom: 0,
                  }}
                  onChange={e=>{
                    const v=e.target.value;
                    setLanguageInput(v);
                    onLanguageInputChangeHandler(v);
                    const match=languageList.find(lang=>lang.name===v);
                    if(match){
                      setSelectedLanguage(match);
                      setLanguageInput('');
                      setLanguageList([]);
                      }
                    }
                  }
                />
                <datalist id="language-options">
                  {languageList.map(lang => (
                    <option key={lang.id} value={lang.name}/>
                  ))}
                </datalist>
              </>
            )}
          </BadgeRow>
        </Field>

        {/*Most Preferred Package */}
        <Field>
          <FieldLabel>Most Preferred Package</FieldLabel>
          <BadgeRow>
            {selectedPackage ? (
              <RemovableBadge>
                <Badge text={selectedPackage.name} />
                <RemoveButton
                  onClick={handlePackageRemove}
                  aria-label="Remove package"
                >
                  ×
                </RemoveButton>
              </RemovableBadge>
            ) : (
              <>
                <input
                  list="package-options"
                  value={packageInput}
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    marginBottom: 0,
                  }}
                  onChange={e=>{
                    const v=e.target.value;
                    setpackageInput(v);
                    onPackageInputChangeHandler(v);
                    const match=packagelist.find(pkg=>pkg.name===v);
                    if(match){
                      setSelectedPackage(match);
                      setpackageInput('');
                      setPackageList([]);
                      }
                    }
                  }
                />
                <datalist id="package-options">
                  {packagelist.map(pkg => (
                    <option key={pkg.id} value={pkg.name} 
                    />
                  ))}
                </datalist>
              </>
            )}
          </BadgeRow>
        </Field>


        {/* I like to… */}
       <Field>
  <FieldLabel>나를 더 잘 알 수 있는 TMI</FieldLabel>
  <BadgeRow>
    {tmiList.map(tmi => {
      const isSelected = selectedTmi.some(x => x.id === tmi.id);
      return (
        <ToggleBadge
          key={tmi.id}
          selected={isSelected}
          onClick={() => handleTmiToggle(tmi)}
        >
          <Badge text={tmi.name} />
        </ToggleBadge>
      );
    })}
  </BadgeRow>
</Field>


        {/* Continue Button */}
        <button
          type="button"
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            background: '#444',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={onContinueButtonHandler}
        >
          Continue
        </button>

        <button
          type="button"
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            background: '#444',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => {}}
        >
          Save
        </button>
        <button
          type="button"
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            background: '#444',
            color: '#000',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => {}}
        >
          Cancel
        </button>
      </Form>
    </Container>
  );
};
