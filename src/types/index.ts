// ─── Domain enums ────────────────────────────────────────────────────────────

export type Scope      = 'rf' | 'fo' | 'reg';
export type Period     = 'today' | 'month' | 'qtr' | 'ytd' | 'year';
export type IssueMode  = 'all' | 'nat' | 'cert';
export type Theme      = 'dark' | 'light';
export type ActiveTab  = 'executive' | 'population' | 'exam' | 'tsr';

// ─── KPI / Trend ─────────────────────────────────────────────────────────────

export interface TrendData {
  sign: '▲' | '▼' | '→';
  cls: 'trend-up' | 'trend-down' | 'trend-flat';
  delta: number;
  text?: string;
  periodLabel?: string;
}

export interface KpiItem {
  label: string;
  value: number;
  note: string;
  status: 'ok' | 'warn' | 'risk';
  decimals?: number;
  suffix?: string;
  trend: TrendData | null;
}

// ─── Data structures ─────────────────────────────────────────────────────────

export interface GroupItem {
  name: string;
  nat: number;
  cert: number;
  sum: number;
  people: number;
}

export interface OkvedItem {
  name: string;
  value: number;
  share: number;
}

export interface AgeGroupData {
  labels: string[];
  values: number[];
  male: number[];
  female: number[];
}

export interface AgeData {
  children: AgeGroupData;
  adults: AgeGroupData;
}

export interface EmployData {
  labels: string[];
  working: number[];
  notWorking: number[];
  okved: OkvedItem[];
}

export interface CauseItem {
  name: string;
  value: number;
  color: string;
}

export interface NosologyItem {
  name: string;
  value: number;
}

export interface ExamPeriodData {
  primary: number;
  reexam: number;
  appealMain: number;
  appealFed: number;
  terms: number;
  form: [number, number];
  result: [number, number];
}

export interface TsrPeriodData {
  budgetTotal: number;
  budgetUsed: number;
  issuedNat: number;
  issuedCert: number;
  status: [number, number, number];
  groups: GroupItem[];
}

export interface BaseData {
  total: number;
  adults: number;
  children: number;
  veterans: number;
  causes: CauseItem[];
  employ: EmployData;
  age: AgeData;
  nosology: NosologyItem[];
  exam: Record<string, ExamPeriodData>;
  tsr: Record<string, TsrPeriodData>;
}

export interface RegionGroup {
  fo: string;
  color: string;
  list: string[];
}

// ─── Store ───────────────────────────────────────────────────────────────────

export interface StoreState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  focusTarget: string | null;
  setFocusTarget: (target: string | null) => void;
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  scope: Scope;
  setScope: (scope: Scope) => void;
  mapMode: string;
  setMapMode: (mode: string) => void;
  d3Mode: string;
  setD3Mode: (mode: string) => void;
  selectedFo: string | null;
  setSelectedFo: (fo: string | null) => void;
  activeRegion: string | null;
  setActiveRegion: (region: string | null) => void;
  activeFo: string | null;
  setActiveFo: (fo: string | null) => void;
  period: Period;
  setPeriod: (period: Period) => void;
  issueMode: IssueMode;
  setIssueMode: (mode: IssueMode) => void;
  syncFromStorage: () => void;
}

// ─── Component props ─────────────────────────────────────────────────────────

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface CardProps {
  id: string;
  label: string;
  title: string;
  titleBadge?: React.ReactNode;
  children: React.ReactNode;
  detailsContent?: React.ReactNode;
}

export interface KpiCardProps extends KpiItem {}

export interface DetailTableRow {
  name: string;
  count: string | number;
  share: string;
  trend?: TrendData;
}

export interface DetailTableProps {
  rows: DetailTableRow[];
  secondColumnLabel?: string;
}
