import React, { use, useEffect, useState } from 'react';
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
import {
  BlanksContainer,
  BlankWrapper,
  CardGrid,
  CardWrapper,
  CloseBtn,
  PlusButton,
  SectionTitle,
} from './MycodePanel.styles';
import { Wrapper } from './UploadPanel.styles';
import { postVsCodeMessage } from '../../utils/vscodeApi';
import { useAuthContext } from '../../contexts/AuthContext';

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
  const { session } = useAuthContext();
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

  useEffect(() => {
    console.log('Requesting session info from VS Code...');
    postVsCodeMessage({ type: 'requestSessionInfo' });
  }, [session]);

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

  if (!session) {
    return <p>Loading...</p>;
  }

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
