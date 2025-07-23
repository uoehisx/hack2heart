import React, { useState, useEffect, useRef } from 'react';
import { axiosRequest } from '../../hooks/useAxios';
import {
  AVATAR_IMG_SRC,
  DEFAULT_AVATAR_IMG_ID,
  GENDER_TYPES,
  Language,
  Package,
  Tmi,
  User,
} from '../../constants';
import { openSidebar } from '../panel/TestPanel';
import { SIDEBAR_TYPES } from '../../constants';
import { Badge } from '../components/badge';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  BadgeRow,
  Container,
  Field,
  FieldLabel,
  Form,
  RemovableBadge,
  RemoveButton,
  ToggleBadge,
} from './ProfileSidebar.styles';
import { Loading } from '../components/loading';
import {
  BackButton,
  PrimaryButton,
  SecondaryButton,
} from '../components/buttons';
import { formatDatetime } from '../../utils/ageUtil';
import { Toast } from '../components/toast';

export const ProfileSidebar = () => {
  const { session, setSession } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [avatarId, setAvatarId] = useState(DEFAULT_AVATAR_IMG_ID);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(GENDER_TYPES.MALE);
  const [lookingForLove, setLookingForLove] = useState<boolean>(true);
  const [lookingForFriend, setLookingForFriend] = useState<boolean>(false);
  const [lookingForCoWorker, setLookingForCoWorker] = useState<boolean>(false);

  const [languageInput, setLanguageInput] = useState('');
  const [languageList, setLanguageList] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  const [packageInput, setpackageInput] = useState('');
  const [packagelist, setPackageList] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [tmiList, setTmiList] = useState<Tmi[]>([]);
  const [selectedTmi, setSelectedTmi] = useState<Tmi[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  if (!session) return <Loading />;

  const isLogined = !!session.serviceToken;

  useEffect(() => {
    const fetchTmis = async () => {
      try {
        const res = await axiosRequest<{ tmis: Tmi[] }>({
          method: 'GET',
          url: '/tmis',
        });
        setTmiList(res.data.tmis);
      } catch (err) {
        console.error('failed to fetch TMIs', err);
      }
    };
    fetchTmis();

    // 로그인 상태일 때 사용자 정보 불러오기
    if (isLogined) {
      const fetchUser = async () => {
        try {
          const user = (
            await axiosRequest({
              method: 'GET',
              url: '/users/me',
              headers: {
                Authorization: `Bearer ${session.serviceToken}`,
              },
            })
          ).data;
          console.log('Fetched user:', user);

          setCurrentUser(user);
          setName(user.name || '');
          setBirth(formatDatetime(user.birth_date) || '');
          setGender(user.gender || GENDER_TYPES.MALE);
          setAvatarId(user.avatar_id ?? DEFAULT_AVATAR_IMG_ID);
          setLookingForLove(!!user.looking_for_love);
          setLookingForFriend(!!user.looking_for_friend);
          setLookingForCoWorker(!!user.looking_for_coworker);

          setSelectedLanguage({
            id: user.most_preferred_language.id,
            name: user.most_preferred_language.name,
          });
          setSelectedPackage({
            id: user.most_preferred_package.id,
            name: user.most_preferred_package.name,
          });
          setSelectedTmi(
            user.tmis.map((tmi: Tmi) => ({ id: tmi.id, name: tmi.name }))
          );
        } catch (err) {
          console.error('Failed to fetch user info:', err);
        }
      };
      fetchUser();
    }
  }, []);

  const onLanguageInputChangeHandler = async (input: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!input) {
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
  };

  // 삭제 버튼 클릭 시 빈 값으로 저장
  const handleLanguageRemove = () => {
    setSelectedLanguage(null);
  };

  const onPackageInputChangeHandler = async (input: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!input) {
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
  };

  // 삭제 버튼 클릭 시 빈 값으로 저장
  const handlePackageRemove = () => {
    setSelectedPackage(null);
  };
  const handleTmiToggle = (tmi: Tmi) => {
    setSelectedTmi(prev => {
      if (prev.find(x => x.id === tmi.id)) {
        // 이미 있으면 제거
        return prev.filter(x => x.id !== tmi.id);
      } else {
        // 3개 이상 선택 불가
        if (prev.length >= 3) return prev;
        return [...prev, tmi];
      }
    });
  };

  const onSaveButtonHandler = async () => {
    if (!session) {
      console.error('No session found. Please log in first.');
      return;
    }
    if (!selectedLanguage) {
      setToastMessage('Please select a most preferred language.');
      return;
    }
    if (!selectedPackage) {
      setToastMessage('Please select a most preferred package.');
      return;
    }

    try {
      const user = (
        await axiosRequest({
          method: 'PUT',
          url: '/users/me',
          headers: {
            Authorization: `Bearer ${session.serviceToken}`,
          },
          data: {
            name,
            gender,
            birth_date: birth,
            avatar_id: avatarId,
            looking_for_love: lookingForLove,
            looking_for_friend: lookingForFriend,
            looking_for_coworker: lookingForCoWorker,
            most_preferred_language_id: selectedLanguage.id,
            most_preferred_package_id: selectedPackage.id,
            tmi_ids: selectedTmi.map(tmi => tmi.id),
          },
        })
      ).data;
      setCurrentUser(user);
      setToastMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
    openSidebar(SIDEBAR_TYPES.HOME);
  };

  const onContinueButtonHandler = async () => {
    if (!session) {
      console.error('No session found. Please log in first.');
      return;
    }
    if (!selectedLanguage) {
      setToastMessage('Please select a most preferred language.');
      return;
    }
    if (!selectedPackage) {
      setToastMessage('Please select a most preferred package.');
      return;
    }

    console.log('session:', session);
    try {
      const user = (
        await axiosRequest({
          method: 'POST',
          url: '/users',
          data: {
            github_oauth_id: session.github_oauth_id,
            name,
            gender,
            birth_date: birth,
            avatar_id: avatarId,
            looking_for_love: lookingForLove,
            looking_for_friend: lookingForFriend,
            looking_for_coworker: lookingForCoWorker,
            most_preferred_language_id: selectedLanguage.id,
            most_preferred_package_id: selectedPackage.id,
            tmi_ids: selectedTmi.map(tmi => tmi.id),
          },
        })
      ).data;

      const res = (
        await axiosRequest({
          method: 'POST',
          url: '/auth/github',
          data: {
            access_token: session.accessToken,
          },
        })
      ).data;

      setSession({
        ...session,
        serviceToken: res.access_token,
      });

      openSidebar(SIDEBAR_TYPES.HOME);
    } catch (err) {
      console.error('Failed to create profile:', err);
      return;
    }
  };

  return (
    <>
      {toastMessage !== null ? <Toast>{toastMessage}</Toast> : null}
      {isLogined ? (
        <BackButton
          onClick={() => {
            openSidebar(SIDEBAR_TYPES.HOME);
          }}
        >
          ← back
        </BackButton>
      ) : null}
      <Container>
        <Form>
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
              width: '200px',
              marginTop: 8,
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
                width: '200px',
                marginTop: 8,
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
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
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
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
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
                      width: '200px',
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      marginBottom: 0,
                    }}
                    onChange={e => {
                      const v = e.target.value;
                      setLanguageInput(v);
                      onLanguageInputChangeHandler(v);
                      const match = languageList.find(lang => lang.name === v);
                      if (match) {
                        setSelectedLanguage(match);
                        setLanguageInput('');
                        setLanguageList([]);
                      }
                    }}
                  />
                  <datalist id="language-options">
                    {languageList.map(lang => (
                      <option key={lang.id} value={lang.name} />
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
                      width: '200px',
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      marginBottom: 0,
                    }}
                    onChange={e => {
                      const v = e.target.value;
                      setpackageInput(v);
                      onPackageInputChangeHandler(v);
                      const match = packagelist.find(pkg => pkg.name === v);
                      if (match) {
                        setSelectedPackage(match);
                        setpackageInput('');
                        setPackageList([]);
                      }
                    }}
                  />
                  <datalist id="package-options">
                    {packagelist.map(pkg => (
                      <option key={pkg.id} value={pkg.name} />
                    ))}
                  </datalist>
                </>
              )}
            </BadgeRow>
          </Field>

          {/* I like to… */}
          <Field>
            <FieldLabel>I Like to...</FieldLabel>
            <BadgeRow>
              {tmiList.map(tmi => {
                const isSelected = selectedTmi.some(x => x.id === tmi.id);
                return (
                  <Badge
                    text={tmi.name}
                    key={tmi.id}
                    selected={isSelected}
                    selectable={true}
                    onClick={() => handleTmiToggle(tmi)}
                  />
                );
              })}
            </BadgeRow>
          </Field>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 16,
              flexDirection: 'column',
              width: '280px',
            }}
          >
            {isLogined ? (
              <>
                <SecondaryButton onClick={onSaveButtonHandler}>
                  Save
                </SecondaryButton>

                <PrimaryButton
                  onClick={() => {
                    openSidebar(SIDEBAR_TYPES.HOME);
                  }}
                >
                  Cancel
                </PrimaryButton>
              </>
            ) : (
              <SecondaryButton onClick={onContinueButtonHandler}>
                Continue
              </SecondaryButton>
            )}
          </div>
        </Form>
      </Container>
    </>
  );
};
