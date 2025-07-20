import React, { useState, useEffect } from 'react';
import { openPanel, openSidebar } from '../panel/TestPanel';
import { PANEL_TYPES } from '../../constants';

const profileImages = [
  require('../../assets/profileImage/gopher.png'),
  require('../../assets/profileImage/kodee.png'),
  require('../../assets/profileImage/octocat.png'),
  require('../../assets/profileImage/rustcrab.png'),
  require('../../assets/profileImage/scratchcat.png'),
  require('../../assets/profileImage/tux.jpeg'),
];

const genders = ['Male', 'Female', 'Other'];
const lookingFor = ['Love', 'Friend', 'Co-worker'];

export const ProfileSidebar = () => {
  const [profileImg, setProfileImg] = useState(profileImages[0]);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');
  const [looking, setLooking] = useState<string[]>([]);

  useEffect(() => {
    // Pick a random profile image on first mount
    const idx = Math.floor(Math.random() * profileImages.length);
    setProfileImg(profileImages[idx]);
  }, []);

  const onContinueButtonHandler = () => {
    openPanel(PANEL_TYPES.EXPLORE);
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
          src={profileImg}
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
            {genders.map(g => (
              <label
                key={g}
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
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  lang="en"
                />
                {g}
              </label>
            ))}
          </div>
        </div>
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            Looking For
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {lookingFor.map(l => (
              <label
                key={l}
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
                  value={l}
                  checked={looking.includes(l)}
                  onChange={() => {
                    setLooking(prev =>
                      prev.includes(l)
                        ? prev.filter(item => item !== l)
                        : [...prev, l]
                    );
                  }}
                  lang="en"
                />
                {l}
              </label>
            ))}
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
