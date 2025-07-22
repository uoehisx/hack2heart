import styled from '@emotion/styled';

export const BackButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px #1f1f1f;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.4),
      inset -6px -6px 12px #1f1f1f;
  }
`;

// --- styled helpers ---
export const Container = styled.div`
  margin-top: 30px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, sans-serif;
`;

export const Form = styled.form`
  width: 320px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const Field = styled.div`
  width: 100%;
`;

export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const RemovableBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const RemoveButton = styled.button`
  background: transparent;
  border: none;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  color: #ffffff;
`;

// ToggleBadge for “I like to…” options
export const ToggleBadge = styled.div<{ selected: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  margin: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  background-color: ${({ selected }) => (selected ? '#556cd6' : 'transparent')};
`;
