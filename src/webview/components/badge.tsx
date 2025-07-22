import styled from '@emotion/styled';
import React from 'react';

interface BadgeProps {
  text: string;
  selectable?: boolean;
  selected?: boolean;
  backgroundColor?: string;
  onClick?: () => void;
}
const BADGE_COLORS = ['#767676', '#6A6E7E', '#7B6577'];

const StyledBadge = styled.span<{
  backgroundColor?: string;
  selectable?: boolean;
  selected?: boolean;
}>`
  background-color: ${({ selectable, selected, backgroundColor }) =>
    selectable
      ? selected
        ? '#6a4bff'
        : '#808080'
      : backgroundColor ||
        BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)]};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #ffffff;
  box-shadow: 2px 2px 4px #000000, -2px -2px 4px #1f1f1f;
  cursor: ${({ selectable }) => (selectable ? 'pointer' : 'default')};
  transition: transform 0.1s;
  &:active {
    transform: ${({ selectable }) => (selectable ? 'translateY(1px)' : 'none')};
  }
`;

export const Badge = ({
  text,
  backgroundColor,
  onClick,
  selectable,
  selected,
}: BadgeProps) => {
  return (
    <StyledBadge
      backgroundColor={backgroundColor}
      selectable={selectable}
      selected={selected}
      onClick={onClick}
    >
      {text}
    </StyledBadge>
  );
};
