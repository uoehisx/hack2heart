import React, { useState, useEffect, ChangeEvent } from 'react';
import { axiosRequest, useAxios } from '../../hooks/useAxios';
import { GENDER_TYPES } from '../../constants';
import { openSidebar } from '../panel/TestPanel';
import { SIDEBAR_TYPES } from '../../constants';
import styled from '@emotion/styled';
import { Badge } from '../components/badge';
import { useAuthContext } from '../../contexts/AuthContext';

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
const languages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Ruby',
  'Go',
  'Kotlin',
];
const packages = [
  'React',
  'Vue',
  'Angular',
  'Express',
  'PyTorch',
  'TensorFlow',
];
const likeToOptions = [
  'Code Together',
  'Code Alone',
  'TDD',
  'Early-bird',
  'Night-owl',
  'Code Golf',
  'AI repeater',
  'Enjoy Smokeoding',
  'Fxck testing',
];

export const ProfileSidebar = () => {
  const { session, setSession } = useAuthContext();

  const [avatarId, setAvatarId] = useState(0);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(GENDER_TYPES.MALE);
  const [lookingForLove, setLookingForLove] = useState<boolean>(true);
  const [lookingForFriend, setLookingForFriend] = useState<boolean>(false);
  const [lookingForCoWorker, setLookingForCoWorker] = useState<boolean>(false);
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [preferredPackage, setPreferredPackage] = useState('');
  const [likeTo, setLikeTo] = useState<string[]>([]);

  useEffect(() => {
    // Pick a random profile image on first mount
    const idx = Math.floor(Math.random() * AVATAR_IMG_SRC.length);
    setAvatarId(idx);
  }, []);

  const toggleLikeTo = (opt: string) =>
    setLikeTo(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    );

  const onContinueButtonHandler = async () => {
    if (!session) {
      console.error('No session found. Please log in first.');
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
            most_preferred_language_id: 1,
            most_preferred_package_id: 1,
            tmi_ids: [],
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
            {languages.includes(preferredLanguage) ? (
              <RemovableBadge>
                <Badge text={preferredLanguage} />
                <RemoveButton
                  onClick={() => setPreferredLanguage('')}
                  aria-label="Remove language"
                >
                  ×
                </RemoveButton>
              </RemovableBadge>
            ) : (
              <>
                <input
                  list="language-options"
                  value={preferredLanguage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPreferredLanguage(e.target.value)
                  }
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    marginBottom: 0,
                  }}
                />
                <datalist id="language-options">
                  {languages.map(lang => (
                    <option key={lang} value={lang} />
                  ))}
                </datalist>
              </>
            )}
          </BadgeRow>
        </Field>

        {/* Most Preferred Package */}
        <Field>
          <FieldLabel>Most Preferred Package</FieldLabel>
          <BadgeRow>
            {packages.includes(preferredPackage) ? (
              <RemovableBadge>
                <Badge text={preferredPackage} />
                <RemoveButton
                  onClick={() => setPreferredPackage('')}
                  aria-label="Remove package"
                >
                  ×
                </RemoveButton>
              </RemovableBadge>
            ) : (
              <>
                <input
                  list="package-options"
                  value={preferredPackage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPreferredPackage(e.target.value)
                  }
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    marginBottom: 0,
                  }}
                />
                <datalist id="package-options">
                  {packages.map(pkg => (
                    <option key={pkg} value={pkg} />
                  ))}
                </datalist>
              </>
            )}
          </BadgeRow>
        </Field>

        {/* I like to… */}
        <Field>
          <FieldLabel>I like to…</FieldLabel>
          <BadgeRow>
            {likeToOptions.map(opt => {
              const selected = likeTo.includes(opt);
              return (
                <ToggleBadge
                  key={opt}
                  selected={selected}
                  onClick={() => toggleLikeTo(opt)}
                  aria-pressed={selected}
                >
                  <Badge text={opt} />
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
