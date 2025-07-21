import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/* ─────────────── Types ─────────────── */
interface CodeCard {
  id: string;
  title: string;
  length: number; // used to determine card height
}

interface BlankSlot {
  id: string;
  codeId: string | null; // stores the id of the dropped code card
}

/* ─────────────── Constants ─────────────── */
const MAX_BLANKS = 5;

const CODE_LIBRARY: Record<string, CodeCard> = {
  'code-1': { id: 'code-1', title: 'Bubble Sort', length: 120 },
  'code-2': { id: 'code-2', title: 'Dijkstra', length: 450 },
  'code-3': { id: 'code-3', title: 'QuickSort', length: 320 },
  'code-4': { id: 'code-4', title: 'A* Search', length: 640 },
};

/* ─────────────── Styled Components (Dark Neumorphism) ─────────────── */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 32px 24px;
  background: #1b1b1b; /* deep dark */
  font-family: 'Inter', sans-serif;
  color: #ffffff;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`;

const PlusButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 36px;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const neumorphismDark = css`
  background: #1b1b1b;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.9), -6px -6px 12px #1a1a1a;
  border-radius: 16px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9), -4px -4px 8px #1a1a1a;
  }
`;

const BlanksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 5개까지 한 줄에 균등 분할
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 1200px; // 더 넓게
  margin-left: auto;
  margin-right: auto;
  min-height: 180px;
  justify-items: center; // 각 칸 내용 중앙 정렬
`;

const BlankWrapper = styled.div<{ isOver: boolean }>`
  width: 95%; // grid 셀을 거의 다 채우게
  height: 170px;
  ${neumorphismDark};
  ${p =>
    p.isOver &&
    css`
      box-shadow: inset 4px 4px 12px rgba(0, 0, 0, 0.9),
        inset -4px -4px 12px #1a1a1a;
    `};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: box-shadow 0.2s;
`;

const CloseBtn = styled.button<{ big?: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  border: none;
  background: transparent;
  font-size: ${p => (p.big ? '28px' : '16px')};
  color: #595959;
  cursor: pointer;
  font-weight: bold;
  line-height: 1;
  padding: 0 4px;
  z-index: 2;
  transition: color 0.15s;
  &:hover {
    color: #595959;
    background: #000000;
    border-radius: 50%;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
`;

const CardWrapper = styled.div<{ length: number; compact?: boolean }>`
  ${neumorphismDark};
  padding: ${p => (p.compact ? '12px' : '24px')};
  width: ${p => (p.compact ? '100%' : 'auto')};
  height: ${p => (p.compact ? '100%' : 'auto')};
  min-height: ${p => (p.compact ? 'auto' : '120px')};

  ${p =>
    !p.compact &&
    css`
      ${p.length > 300 && 'min-height: 200px;'}
      ${p.length > 600 && 'min-height: 280px;'}
    `};

  display: flex;
  flex-direction: column;
  position: relative;

  overflow: hidden;
`;

/* ─────────────── Draggable & Droppable Components ─────────────── */
interface DraggableCardProps {
  code: CodeCard;
  compact?: boolean;
  onRemove?: (id: string) => void;
  showDelete?: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  code,
  compact = false,
  onRemove,
  showDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: code.id,
    });

  // onClick만 제외한 나머지 드래그 리스너

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  };

  return (
    <CardWrapper
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      length={code.length}
      compact={compact}
    >
      {showDelete && !compact && (
        <CloseBtn
          big
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onRemove && onRemove(code.id);
          }}
        >
          ×
        </CloseBtn>
      )}
      <strong style={{ fontSize: compact ? 14 : 16 }}>{code.title}</strong>
      {!compact && (
        <span style={{ marginTop: 'auto', fontSize: 12, color: '#888' }}>
          {code.length} chars
        </span>
      )}
    </CardWrapper>
  );
};

const DroppableBlank: React.FC<{
  blank: BlankSlot;
  onRemove: (id: string) => void;
}> = ({ blank, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({ id: blank.id });

  return (
    <BlankWrapper ref={setNodeRef} isOver={isOver}>
      {blank.codeId ? (
        <DraggableCard code={CODE_LIBRARY[blank.codeId]} compact />
      ) : null}
      <CloseBtn
        big
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          onRemove(blank.id);
        }}
      >
        ×
      </CloseBtn>
    </BlankWrapper>
  );
};

/* ─────────────── Main Component ─────────────── */
export const MycodePanel: React.FC = () => {
  const [codes, setCodes] = useState<CodeCard[]>(Object.values(CODE_LIBRARY));
  const [blanks, setBlanks] = useState<BlankSlot[]>([
    { id: 'blank-1', codeId: null },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isInCodes = (id: string) => codes.some(c => c.id === id);
  const findBlankIndexByCode = (id: string) =>
    blanks.findIndex(b => b.codeId === id);
  /* Sensors */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  /* Add new blank slot */
  const addBlank = () => {
    setBlanks(prev => {
      if (prev.length >= MAX_BLANKS) return prev;
      return [...prev, { id: `blank-${prev.length + 1}`, codeId: null }];
    });
  };

  /* Remove blank slot or clear its content */
  const removeFromBlank = (blankId: string) => {
    setBlanks(prev => {
      const target = prev.find(b => b.id === blankId);
      if (!target) return prev;

      // If slot contains a card, put it back into codes list
      if (target.codeId) {
        setCodes(codesPrev =>
          codesPrev.some(c => c.id === target.codeId)
            ? codesPrev
            : [...codesPrev, CODE_LIBRARY[target.codeId!]]
        );
      }

      // If it's the only slot, just clear it; otherwise remove the slot entirely
      if (prev.length === 1) {
        return prev.map(b => (b.id === blankId ? { ...b, codeId: null } : b));
      }
      return prev.filter(b => b.id !== blankId);
    });
  };

  /* Delete code card from the list */
  const deleteCodeCard = (codeId: string) => {
    setCodes(prev => prev.filter(c => c.id !== codeId));
  };

  /* Drag End */
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const srcId = active.id.toString();
    const destId = over.id.toString();

    /* ---------- 1. dropping onto a blank ---------- */
    if (destId.startsWith('blank-')) {
      const originIdx = findBlankIndexByCode(srcId); // -1 if dragged from list

      setBlanks(prev =>
        prev.map((b, idx) => {
          /* a) empty the source blank (if any) */
          if (idx === originIdx) return { ...b, codeId: null };
          /* b) replace the destination blank and remember what was there */
          if (b.id === destId) {
            const previous = b.codeId; // the card we’re about to bump out

            /* put the bumped‑out card back to the library */
            if (previous && !codes.some(c => c.id === previous)) {
              setCodes(c => [...c, CODE_LIBRARY[previous]]);
            }
            return { ...b, codeId: srcId };
          }
          return b;
        })
      );
      /* c) if the src came from the library, remove it there */
      if (isInCodes(srcId)) {
        setCodes(prev => prev.filter(c => c.id !== srcId));
      }
    }
    /* ---------- 2. dropping back on the library ---------- */
    if (destId === 'codes') {
      const originIdx = findBlankIndexByCode(srcId);
      if (originIdx !== -1) {
        setBlanks(prev =>
          prev.map((b, idx) => (idx === originIdx ? { ...b, codeId: null } : b))
        );
        setCodes(prev => [...prev, CODE_LIBRARY[srcId]]);
      }
    }

    setActiveId(null);
  };

  /* ─────────────── Render ─────────────── */
  return (
    <Wrapper>
      <SectionTitle>Code List (Pinned Top)</SectionTitle>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={e => setActiveId(e.active.id.toString())}
        onDragEnd={handleDragEnd}
      >
        {/* ---------- Blank Slots ---------- */}
        <BlanksContainer>
          {blanks.map(blank => (
            <DroppableBlank
              key={blank.id}
              blank={blank}
              onRemove={removeFromBlank}
            />
          ))}
          {blanks.length < MAX_BLANKS && (
            <BlankWrapper isOver={false}>
              <PlusButton onClick={addBlank}>+</PlusButton>
            </BlankWrapper>
          )}
        </BlanksContainer>

        {/* ---------- Divider ---------- */}
        <div
          style={{ height: 2, background: '#333', margin: '16px 0 24px 0' }}
        />

        <SectionTitle>Uploaded Code Cards</SectionTitle>
        <div id="codes" style={{ width: '100%' }}>
          <CardGrid>
            {codes.map(code => (
              <DraggableCard
                key={code.id}
                code={code}
                onRemove={deleteCodeCard}
                showDelete
              />
            ))}
          </CardGrid>
        </div>

        {/* ---------- Drag Overlay ---------- */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? <DraggableCard code={CODE_LIBRARY[activeId]} /> : null}
        </DragOverlay>
      </DndContext>
    </Wrapper>
  );
};

export default MycodePanel;
