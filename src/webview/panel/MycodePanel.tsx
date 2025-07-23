// MycodePanel.tsx
import React, { useEffect, useState } from 'react';
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
import { Loading } from '../components/loading';
import { axiosRequest } from '../../hooks/useAxios'; // 경로 확인

/* ─────────────── Types ─────────────── */
interface ServerCode {
  id: number;
  content: string;
  index: number | null;
  created_at: string;
}

interface CodeCard {
  id: string; // "code-<server id>"
  title: string;
  length: number;
  raw: ServerCode;
}

interface BlankSlot {
  id: string;
  codeId: string | null;
}

interface CodesResp {
  message?: string;
  codes: ServerCode[];
}

/* ─────────────── Constants ─────────────── */
const MAX_BLANKS = 5;

/* ─────────────── Reusable Components ─────────────── */
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
    useDraggable({ id: code.id });

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

interface DroppableBlankProps {
  blank: BlankSlot;
  onRemove: (id: string) => void;
  getCode: (id: string) => CodeCard | undefined;
}

const DroppableBlank: React.FC<DroppableBlankProps> = ({
  blank,
  onRemove,
  getCode,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: blank.id });
  const code = blank.codeId ? getCode(blank.codeId) : undefined;

  return (
    <BlankWrapper ref={setNodeRef} isOver={isOver}>
      {code ? <DraggableCard code={code} compact /> : null}
      <CloseBtn
        big
        onPointerDown={e => e.stopPropagation()}
        onClick={() => onRemove(blank.id)}
      >
        ×
      </CloseBtn>
    </BlankWrapper>
  );
};

/* ─────────────── Main Component ─────────────── */
export const MycodePanel: React.FC<{ pinned?: boolean }> = ({ pinned }) => {
  const { session } = useAuthContext();

  const [codesMap, setCodesMap] = useState<Record<string, CodeCard>>({});
  const [codes, setCodes] = useState<string[]>([]); // ids only
  const [blanks, setBlanks] = useState<BlankSlot[]>([
    { id: 'blank-1', codeId: null },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCode = (id: string) => codesMap[id];

  const isInCodes = (id: string) => codes.includes(id);
  const findBlankIndexByCode = (id: string) =>
    blanks.findIndex(b => b.codeId === id);

  /* ---------- Fetch Codes ---------- */
  useEffect(() => {
    if (!session) return;
    const fetchCodes = async () => {
      setLoading(true);
      try {
        const res = await axiosRequest<CodesResp>({
          method: 'GET',
          url: '/users/me/codes',
          params: pinned !== undefined ? { pinned } : undefined,
        });

        const serverCodes: ServerCode[] = res.data?.codes ?? [];

        const toCard = (c: ServerCode): CodeCard => ({
          id: `code-${c.id}`,
          title: (c.content.split(/\r?\n/)[0] || 'Untitled Code').slice(0, 40),
          length: c.content.length,
          raw: c,
        });

        const map: Record<string, CodeCard> = {};
        const ids: string[] = [];
        serverCodes.forEach(sc => {
          const card = toCard(sc);
          map[card.id] = card;
          ids.push(card.id);
        });

        setCodesMap(map);
        setCodes(ids);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCodes();
  }, [session, pinned]);

  /* Sensors */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  /* Ask VS Code host for session info (optional) */
  useEffect(() => {
    postVsCodeMessage({ type: 'requestSessionInfo' });
  }, []);

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
        setCodes(cPrev => (cPrev.includes(target.codeId!) ? cPrev : [...cPrev, target.codeId!]));
      }

      // if only 1 slot, just clear
      if (prev.length === 1) {
        return prev.map(b => (b.id === blankId ? { ...b, codeId: null } : b));
      }
      return prev.filter(b => b.id !== blankId);
    });
  };

  /* Delete code card from the list */
  const deleteCodeCard = (codeId: string) => {
    setCodes(prev => prev.filter(id => id !== codeId));
  };

  /* Drag End */
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveId(null);

    if (!over) return;

    const srcId = active.id.toString();
    const destId = over.id.toString();

    // 1. Dropping onto a blank
    if (destId.startsWith('blank-')) {
      const originIdx = findBlankIndexByCode(srcId); // -1 if from library

      setBlanks(prev =>
        prev.map((b, idx) => {
          // a) empty the source blank (if any)
          if (idx === originIdx) return { ...b, codeId: null };

          // b) destination blank
          if (b.id === destId) {
            const bumped = b.codeId;

            // put bumped code back to library if existed
            if (bumped && !codes.includes(bumped)) {
              setCodes(c => [...c, bumped]);
            }
            return { ...b, codeId: srcId };
          }
          return b;
        })
      );

      // c) if src came from library, remove it there
      if (isInCodes(srcId)) {
        setCodes(prev => prev.filter(id => id !== srcId));
      }
    }

    // 2. Dropping back on the library container
    if (destId === 'codes') {
      const originIdx = findBlankIndexByCode(srcId);
      if (originIdx !== -1) {
        setBlanks(prev =>
          prev.map((b, idx) => (idx === originIdx ? { ...b, codeId: null } : b))
        );
        if (!codes.includes(srcId)) {
          setCodes(prev => [...prev, srcId]);
        }
      }
    }
  };

  if (!session || loading) {
    return <Loading />;
  }

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
              getCode={getCode}
            />
          ))}
          {blanks.length < MAX_BLANKS && (
            <BlankWrapper isOver={false}>
              <PlusButton onClick={addBlank}>+</PlusButton>
            </BlankWrapper>
          )}
        </BlanksContainer>

        {/* ---------- Divider ---------- */}
        <div style={{ height: 2, background: '#333', margin: '16px 0 24px 0' }} />

        <SectionTitle>Uploaded Code Cards</SectionTitle>
        <div id="codes" style={{ width: '100%' }}>
          <CardGrid>
            {codes.map(id => {
              const card = getCode(id);
              if (!card) return null;
              return (
                <DraggableCard
                  key={card.id}
                  code={card}
                  onRemove={deleteCodeCard}
                  showDelete
                />
              );
            })}
          </CardGrid>
        </div>

        {/* ---------- Drag Overlay ---------- */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? <DraggableCard code={getCode(activeId)!} /> : null}
        </DragOverlay>
      </DndContext>
    </Wrapper>
  );
};

export default MycodePanel;
