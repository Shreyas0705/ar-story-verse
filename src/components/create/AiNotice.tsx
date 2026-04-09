import { Info } from "lucide-react";

interface AiNoticeProps {
  visible: boolean;
}

const AiNotice = ({ visible }: AiNoticeProps) => {
  if (!visible) return null;

  return (
    <div className="mx-auto mb-6 flex max-w-xl items-start gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm animate-fade-in">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>
        AI generation is currently unavailable so a <strong>demo story</strong> is shown instead.
        To re‑enable AI, set the <code className="rounded bg-muted px-1 text-xs">OPENAI_API_KEY</code> environment variable.
      </p>
    </div>
  );
};

export default AiNotice;
