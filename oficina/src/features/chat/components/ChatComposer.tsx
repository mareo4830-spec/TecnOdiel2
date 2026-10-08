import { Folder, SendHorizontal, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import type { ChatMessageKind, Project } from '../../../types';

interface ChatComposerProps {
  projects: Project[];
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onSend: (input: { text: string; kind: ChatMessageKind; projectId: string | null }) => void;
}

export function ChatComposer({ projects, inputRef, onSend }: ChatComposerProps) {
  const [text, setText] = useState('');
  const [projectId, setProjectId] = useState('');
  const [aviso, setAviso] = useState(false);
  const canSend = text.trim().length > 0;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (!canSend) return;
    onSend({ text, kind: aviso ? 'aviso' : 'mensaje', projectId: projectId || null });
    setText('');
    setAviso(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border-t border-gray-800 bg-gray-900 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mb-2 flex items-center gap-2">
        <label className="relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">Proyecto del mensaje</span>
          <Folder className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-gray-500" />
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full truncate rounded-lg border border-gray-800 bg-gray-950 py-1.5 pl-7 pr-2 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Sin proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.businessName}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setAviso((v) => !v)}
          aria-pressed={aviso}
          title="Marcar como aviso importante"
          className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
            aviso
              ? 'border-amber-400/60 bg-amber-500/15 text-amber-300'
              : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
          }`}
        >
          <TriangleAlert className="h-3.5 w-3.5" />
          Aviso
        </button>
      </div>

      <div className="flex items-end gap-2">
        <label className="flex-1">
          <span className="sr-only">Mensaje</span>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={1000}
            placeholder={aviso ? 'Escribe el aviso para el equipo…' : 'Escribe un mensaje…'}
            className="field-sizing-content block max-h-32 min-h-10 w-full resize-none rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-base text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Enviar mensaje"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-600 text-white transition hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1.5 hidden text-[11px] text-gray-500 sm:block">
        Enter para enviar · Shift + Enter para salto de línea
      </p>
    </form>
  );
}
