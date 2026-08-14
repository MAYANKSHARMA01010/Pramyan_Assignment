# UI/UX Design System Specification (Pramyan Corporate Systems)

The visual design system is designed using **Stitch** for an authentic, human-designed enterprise B2B SaaS platform (inspired by Deel, Rippling, BambooHR, Ashby, and Lattice).

---

## 1. Design Philosophy

- **Corporate Modern (Light Mode)**: High-clarity light mode canvas that emphasizes readability, structural integrity, and calm productivity.
- **Tonal Layering**: Differentiates workspace background (`slate-50`) from interactive white cards (`#ffffff`) with subtle 1px border dividers (`#e2e8f0`) and soft natural ambient shadows.
- **Authentic Semantic Accents**: Crisp, non-AI badge colors (Emerald-700/50 for Present, Amber-700/50 for Leave, Rose-700/50 for Absent).
- **Zero AI Gimmicks**: No glowing neon borders, no futuristic cyberpunk grids, no rainbow gradients.

---

## 2. Color Palette & Tokens

| Token | Hex Value | Role | Usage |
|---|---|---|---|
| `--bg` | `#f8fafc` | Canvas Background | Main application body |
| `--surface` | `#ffffff` | Card & Panel Surface | White cards, modals, sidebar, topbar |
| `--surface-muted` | `#f1f5f9` | Muted Surface | Table headers, secondary buttons, tags |
| `--border` | `#e2e8f0` | Standard Border | 1px card and divider borders |
| `--border-strong`| `#cbd5e1` | Input Border | Form inputs, select dropdowns |
| `--primary` | `#0f172a` | Solid Slate Navy | Primary buttons, active sidebar links, brand marks |
| `--primary-hover`| `#1e293b` | Primary Hover | Button hover state |
| `--success` | `#15803d` | Semantic Emerald | Present attendance, Active status |
| `--warning` | `#b45309` | Semantic Amber | On Leave attendance, pending logs |
| `--danger` | `#be123c` | Semantic Rose | Absent attendance, Inactive status, delete CTA |
| `--text-primary`| `#0f172a` | Charcoal Black | Headings, employee names, data numbers |
| `--text-secondary`| `#475569`| Slate Gray | Table values, body descriptions |
| `--text-muted` | `#64748b` | Muted Slate | Subtitles, field labels, timestamps |

---

## 3. Typography Hierarchy

- **Primary UI Font**: `Inter` (Google Fonts)
  - Display / Headlines: `font-bold text-slate-900 tracking-tight`
  - Body: `font-normal text-slate-700`
  - Field Labels / Metadata: `text-xs font-semibold text-slate-700 uppercase font-mono-code`
- **Identifier Font**: `JetBrains Mono` (Google Fonts)
  - Employee IDs: `font-mono-code text-xs font-medium`
  - Telemetry Numbers: `text-3xl font-bold font-mono-code text-slate-900`
  - Dates: `font-mono-code text-xs text-slate-600`

---

## 4. Component Standards

### Status Pills
- **Active / Present**: `bg-emerald-50 text-emerald-700 border border-emerald-200` with emerald-600 indicator dot.
- **Inactive / Absent**: `bg-rose-50 text-rose-700 border border-rose-200` with rose-600 indicator dot.
- **On Leave**: `bg-amber-50 text-amber-700 border border-amber-200` with amber-600 indicator dot.

### Navigation Rail
- Fixed 256px (`w-64`) left sidebar with pure white background and 1px right border.
- Active navigation item has a subtle gray background (`bg-slate-100 font-semibold text-slate-900`).

### Interactive Roll Call
- 3-button status toggle:
  - Present: `bg-emerald-600 text-white`
  - Absent: `bg-rose-600 text-white`
  - On Leave: `bg-amber-500 text-white`
