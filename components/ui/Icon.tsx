import type { SVGProps } from 'react';

export type IconName =
  | 'overview'
  | 'expenses'
  | 'budgets'
  | 'wallet'
  | 'target'
  | 'trend'
  | 'receipt'
  | 'calendar'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'arrow';

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export default function Icon({ name, ...props }: Props) {
  const paths: Record<IconName, React.ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    expenses: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h3"/></>,
    budgets: <><path d="M12 2v20M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    wallet: <><path d="M3 7h15a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12"/><path d="M16 13h5M16 13a1 1 0 1 0 0 .01"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    trend: <><path d="M3 20V10M9 20V4M15 20v-7M21 20V7"/></>,
    receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z"/><path d="M9 7h6M9 11h6M9 15h3"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    edit: <><path d="m14 4 6 6L8 22H2v-6L14 4Z"/><path d="m12 6 6 6"/></>,
    trash: <><path d="M3 6h18M8 6V3h8v3M19 6l-1 15H6L5 6M10 11v5M14 11v5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}
