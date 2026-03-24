"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Expand, Loader2, Minimize } from "lucide-react";

type PuzzlePlayerFrameProps = {
  title: string;
  src: string;
  puzzleSlug?: string;
  puzzleVariantSlug?: string | null;
  classroomId?: string | null;
  assignmentId?: string | null;
};

type IncomingPuzzleMessage = {
  type?: string;
  payload?: {
    score?: number | null;
    timeMs?: number | null;
    attempts?: number | null;
    completed?: boolean | null;
    completionPct?: number | null;
    [key: string]: unknown;
  };
};

export function PuzzlePlayerFrame({
  title,
  src,
  puzzleSlug,
  puzzleVariantSlug,
  classroomId,
  assignmentId
}: PuzzlePlayerFrameProps) {
  const iframeTitle = useMemo(() => `${title} puzzle player`, [title]);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  async function enterFullscreen() {
    if (!shellRef.current) return;

    try {
      if (shellRef.current.requestFullscreen) {
        await shellRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error("Unable to enter fullscreen:", error);
    }
  }

  async function exitFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error("Unable to exit fullscreen:", error);
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      void exitFullscreen();
    } else {
      void enterFullscreen();
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    function sendInitContext() {
      if (!iframeRef.current?.contentWindow) return;

      iframeRef.current.contentWindow.postMessage(
        {
          type: "mathpickle:init",
          payload: {
            puzzleSlug: puzzleSlug ?? null,
            puzzleVariantSlug: puzzleVariantSlug ?? null,
            classroomId: classroomId ?? null,
            assignmentId: assignmentId ?? null
          }
        },
        "*"
      );
    }

    const iframeEl = iframeRef.current;
    if (!iframeEl) return;

    iframeEl.addEventListener("load", sendInitContext);
    return () => {
      iframeEl.removeEventListener("load", sendInitContext);
    };
  }, [puzzleSlug, puzzleVariantSlug, classroomId, assignmentId]);

  useEffect(() => {
    async function handlePuzzleMessage(event: MessageEvent<IncomingPuzzleMessage>) {
      if (!iframeRef.current?.contentWindow) return;
      if (event.source !== iframeRef.current.contentWindow) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type !== "mathpickle:puzzleResult" && data.type !== "mathpickle:puzzleComplete") {
        return;
      }

      if (!puzzleSlug) return;

      const payload = data.payload ?? {};

      setSaveState("saving");
      setSaveMessage("Saving result...");

      try {
        const response = await fetch("/api/puzzle-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            puzzleSlug,
            puzzleVariantSlug: puzzleVariantSlug ?? null,
            classroomId: classroomId ?? null,
            assignmentId: assignmentId ?? null,
            score: payload.score ?? null,
            timeMs: payload.timeMs ?? null,
            attempts: payload.attempts ?? 1,
            completed: payload.completed ?? (data.type === "mathpickle:puzzleComplete"),
            completionPct: payload.completionPct ?? null
          })
        });

        if (!response.ok) {
          const errorJson = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(errorJson?.error || "Failed to save result");
        }

        setSaveState("saved");
        setSaveMessage("Result saved");
        window.setTimeout(() => {
          setSaveState("idle");
          setSaveMessage("");
        }, 2200);
      } catch (error) {
        console.error("Error saving puzzle result:", error);
        setSaveState("error");
        setSaveMessage("Could not save result");
      }
    }

    window.addEventListener("message", handlePuzzleMessage);
    return () => {
      window.removeEventListener("message", handlePuzzleMessage);
    };
  }, [puzzleSlug, puzzleVariantSlug, classroomId, assignmentId]);

  return (
    <div
      ref={shellRef}
      className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-gradient-to-r from-pickle-50 to-white px-6 py-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
            Puzzle player
          </div>
          <div className="mt-1 text-lg font-semibold text-ink">{title}</div>

          {(puzzleSlug || puzzleVariantSlug || classroomId || assignmentId) ? (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
              {puzzleSlug ? (
                <div className="rounded-full border border-line px-3 py-1">
                  Puzzle: {puzzleSlug}
                </div>
              ) : null}
              {puzzleVariantSlug ? (
                <div className="rounded-full border border-line px-3 py-1">
                  Variant: {puzzleVariantSlug}
                </div>
              ) : null}
              {classroomId ? (
                <div className="rounded-full border border-line px-3 py-1">
                  Class: {classroomId}
                </div>
              ) : null}
              {assignmentId ? (
                <div className="rounded-full border border-line px-3 py-1">
                  Assignment: {assignmentId}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {saveState !== "idle" ? (
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                saveState === "saved"
                  ? "bg-pickle-50 text-pickle-800"
                  : saveState === "saving"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {saveState === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {saveState === "saved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
              {saveMessage}
            </div>
          ) : null}

          <div className="rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
            Standalone interactive
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-pickle-50"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" />
                Exit fullscreen
              </>
            ) : (
              <>
                <Expand className="h-4 w-4" />
                Full screen
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-canvas p-3 md:p-4">
        <div className="overflow-hidden rounded-[1.5rem] border border-line bg-black">
          <iframe
            ref={iframeRef}
            title={iframeTitle}
            src={src}
            className="block w-full border-0"
            style={{ height: isFullscreen ? "100vh" : "85vh", minHeight: isFullscreen ? "100vh" : "800px" }}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}