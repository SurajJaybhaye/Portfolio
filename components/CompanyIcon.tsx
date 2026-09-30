import { LuBuilding2 } from "react-icons/lu";

// Icons for the Experience badges. Invade has a drawn version of its logo;
// other companies use a generic building icon. Add a company by adding an entry
// to `icons` and setting `icon` on it in content.ts.

const icons: Record<
  string,
  (props: { className?: string }) => React.ReactElement
> = {
  // Orange open ring around a filled dot, with two dots rising to the upper right.
  invade: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path
        d="M37.5 32.4 A26 26 0 1 0 66.4 66.9"
        fill="none"
        stroke="#E8702A"
        strokeWidth="12"
      />
      <circle cx="42" cy="58" r="13" fill="#E8702A" />
      <circle cx="64" cy="38" r="9" fill="#E8702A" />
      <circle cx="80" cy="22" r="6" fill="#E8702A" />
    </svg>
  ),
  building: ({ className }) => (
    <LuBuilding2 aria-hidden className={`${className ?? ""} text-mid`} />
  ),
};

export default function CompanyIcon({
  name,
  fallback,
  className,
}: {
  name?: string;
  fallback: string;
  className?: string;
}) {
  const Icon = name ? icons[name] : undefined;
  return Icon ? (
    <Icon className={className} />
  ) : (
    <span className="font-bold text-mid">{fallback}</span>
  );
}
