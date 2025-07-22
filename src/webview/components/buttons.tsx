import styled from '@emotion/styled';

export const PrimaryButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: #1f1f1f;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 5px;
  box-shadow: 4px 4px 8px #000000, -4px -4px 8px #1f1f1f;

  &:active {
    box-shadow: inset 4px 4px 8px #000000, inset -4px -4px 8px #1f1f1f;
    transform: translateY(2px);
`;

export const SecondaryButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: #6a4bff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 5px;
  box-shadow: 4px 4px 8px #000000, -4px -4px 8px #1f1f1f;

  &:active {
    box-shadow: inset 4px 4px 8px #5a40d9, inset -4px -4px 8px #7a56ff;
    transform: translateY(2px);
  }
`;

export const BackButton = styled.button`
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
