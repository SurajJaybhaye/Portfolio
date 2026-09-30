// Renders **bold** markers in content strings as emphasised spans.
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-semibold text-on-surface">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
