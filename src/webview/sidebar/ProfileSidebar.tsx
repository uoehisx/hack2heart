import React, { useState, useEffect } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { GENDER_TYPES } from '../../types';

const AVATAR_IMG_SRC = [
  require('../../assets/profileImage/gopher.png'),
  require('../../assets/profileImage/kodee.png'),
  require('../../assets/profileImage/octocat.png'),
  require('../../assets/profileImage/rustcrab.png'),
  require('../../assets/profileImage/scratchcat.png'),
  require('../../assets/profileImage/tux.jpeg'),
];

export const ProfileSidebar = () => {
  const [avatarId, setAvatarId] = useState(0);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(GENDER_TYPES.MALE);
  const [lookingForLove, setLookingForLove] = useState<boolean>(true);
  const [lookingForFriend, setLookingForFriend] = useState<boolean>(false);
  const [lookingForCoWorker, setLookingForCoWorker] = useState<boolean>(false);

  useEffect(() => {
    // Pick a random profile image on first mount
    const idx = Math.floor(Math.random() * AVATAR_IMG_SRC.length);
    setAvatarId(idx);
  }, []);

  const { request, loading, error, data } = useAxios();

  const onContinueButtonHandler = async () => {
    await request({
      method: 'POST',
      url: '/users',
      data: {
        github_oauth_id: 'test',
        name,
        gender,
        birth_date: birth,
        avatar_id: avatarId,
        looking_for_love: lookingForLove,
        looking_for_friend: lookingForFriend,
        looking_for_coworker: lookingForCoWorker,
      },
    });
  };

  return (
    <div
      lang="en"
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <form
        style={{
          width: 320,
          background: 'transparent',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 8px #0001',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        acceptCharset="UTF-8"
        lang="en"
      >
        <img
          src={AVATAR_IMG_SRC[avatarId]}
          alt="profile"
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #eee',
            marginBottom: 20,
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
            marginBottom: 24,
            fontSize: 16,
            textAlign: 'center',
          }}
        />
        <div style={{ width: '100%', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            Date of Birth
          </div>
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
            placeholder="YYYY-MM-DD"
            autoComplete="off"
          />
        </div>
        <div style={{ width: '100%', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            Gender
          </div>
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
        </div>
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            Looking For
          </div>
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
        </div>
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
      </form>
    </div>
  );
};
