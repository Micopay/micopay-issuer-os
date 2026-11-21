import { locale } from './i18n';

const MXN = new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });

/** Example amounts are decimal strings, as an API would send them; formatting is display-only. */
export const mxn = (v: string | number | null | undefined) => MXN.format(Number(v ?? 0));
/** Token amounts: 2 decimals shown. */
export const token = (v: string | number | null | undefined) =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v ?? 0));
export const short = (s: string, n = 6) => (s.length > n * 2 ? `${s.slice(0, n)}…${s.slice(-n)}` : s);
export const dia = (v: string | Date) =>
  new Date(v).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
/** Date and time as stored by the simulator (UTC), for lifecycle milestones. */
export const fechaHora = (v: string | Date) =>
  new Date(v).toLocaleString(locale, {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  });
