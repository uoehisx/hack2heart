// src/webview/sidebar/ProfileSidebar.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import { openPanel } from '../panel/TestPanel';
import { PANEL_TYPES } from '../../constants';
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

  background-color: ${({ selected }) =>
    selected ? '#556cd6' : 'transparent'};
`;

// --- constants & assets ---
const profileImages = [
  require('../../assets/profileImage/gopher.png'),
  require('../../assets/profileImage/kodee.png'),
  require('../../assets/profileImage/octocat.png'),
  require('../../assets/profileImage/rustcrab.png'),
  require('../../assets/profileImage/scratchcat.png'),
  require('../../assets/profileImage/tux.jpeg'),
];

const genders      = ['Male', 'Female', 'Other'];
const lookingFor   = ['Love', 'Friend', 'Co-worker'];
const languages    = ['JavaScript', 'TypeScript', 'Python', 'Ruby', 'Go', 'Kotlin'];
const packages     = ['React', 'Vue', 'Angular', 'Express', 'PyTorch', 'TensorFlow'];
const likeToOptions = [
  'Code Together','Code Alone','TDD',
  'Early-bird','Night-owl','Code Golf',
  'AI repeater','Enjoy Smokeoding','Fxck testing'
];

// --- component ---
export const ProfileSidebar: React.FC = () => {
  const [profileImg, setProfileImg]       = useState(profileImages[0]);
  const [name, setName]                   = useState('');
  const [birth, setBirth]                 = useState('');
  const [gender, setGender]               = useState('');
  const [looking, setLooking]             = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [preferredPackage, setPreferredPackage]   = useState('');
  const [likeTo, setLikeTo]               = useState<string[]>([]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * profileImages.length);
    setProfileImg(profileImages[idx]);
  }, []);

  const toggleLikeTo = (opt: string) =>
    setLikeTo(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    );

  const onContinue = () => openPanel(PANEL_TYPES.EXPLORE);

  return (
    <Container>
      <Form lang="en">
        {/* Profile Image & Name */}
        <img
          src={profileImg}
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
            {genders.map(g => (
              <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                />
                {g}
              </label>
            ))}
          </div>
        </Field>

        {/* Looking For */}
        <Field>
          <FieldLabel>Looking For</FieldLabel>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {lookingFor.map(l => (
              <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  value={l}
                  checked={looking.includes(l)}
                  onChange={() =>
                    setLooking(prev =>
                      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
                    )
                  }
                />
                {l}
              </label>
            ))}
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
          onClick={onContinue}
        >
          Continue
        </button>
      </Form>
    </Container>
  );
};
