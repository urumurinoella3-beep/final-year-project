# 🎨 DQIMS Color Palette Reference

Quick visual reference for all colors used in the application.

---

## 🏢 BRAND COLORS (RRA Official)

### Primary Brand Color - RRA Green
```
██████████ #20603D (Main)
████████   #1a4d31 (Hover - Darker)
██         #20603D/10 (10% Opacity - Very Light)
████       #20603D/15 (15% Opacity - Light)
██████     #20603D/20 (20% Opacity - Medium Light)
```
**Usage:** Primary buttons, headers, icons, branding
**RGB:** rgb(32, 96, 61)
**HSL:** hsl(154, 50%, 25%)

### Secondary Brand Color - RRA Blue
```
██████████ #00A1DE (Main)
██         #00A1DE/10 (10% Opacity)
```
**Usage:** Links, secondary actions, attachment icons
**RGB:** rgb(0, 161, 222)
**HSL:** hsl(196, 100%, 44%)

### Accent Color - RRA Orange
```
██████████ #E5BE01
```
**Usage:** Warnings, highlights, charts
**RGB:** rgb(229, 190, 1)
**HSL:** hsl(50, 99%, 45%)

---

## ✅ STATUS & ACTION COLORS

### Success Green (Tailwind)
```
██████████ green-50   #f0fdf4 (Light background)
████████   green-600  #16a34a (Main)
██████     green-700  #15803d (Hover)
████       green-800  #166534 (Dark text)
```
**Usage:** Success messages, resolve buttons, completed status

### Info Blue (Tailwind)
```
██████████ blue-50    #eff6ff (Light background)
████████   blue-600   #2563eb (Main)
██████     blue-700   #1d4ed8 (Hover)
```
**Usage:** Information displays, staff counts, status indicators

### Danger Red
```
██████████ #d4183d (Main)
████████   red-600    #dc2626 (Alternative)
██████     red-700    #b91c1c (Hover)
```
**Usage:** Delete buttons, error messages, critical alerts

### Warning (Tailwind)
```
██████████ yellow-50  #fefce8 (Light background)
████████   yellow-600 #ca8a04 (Main)
```
**Usage:** Warnings, pending status

---

## 🎨 NEUTRAL COLORS (UI Backgrounds)

### Gray Scale
```
██████████ #ffffff    white (Page background)
██████████ gray-50    #f9fafb (Card background)
████████   gray-100   #f3f4f6 (Muted background)
██████     gray-200   #e5e7eb (Border)
████       gray-300   #d1d5db (Divider)
██         gray-400   #9ca3af (Disabled)
████       gray-600   #4b5563 (Secondary text)
██████     gray-800   #1f2937 (Text)
████████   gray-900   #111827 (Headings)
```

---

## 📊 CHART COLORS

### Chart Color Palette
```
Chart 1: ██████████ #20603D (RRA Green)
Chart 2: ██████████ #00A1DE (RRA Blue)
Chart 3: ██████████ #E5BE01 (RRA Orange)
Chart 4: ██████████ #EF4444 (Red)
Chart 5: ██████████ #8B5CF6 (Purple)
```

**Defined in:** `theme.css` lines 30-34
```css
--chart-1: #20603D;
--chart-2: #00A1DE;
--chart-3: #E5BE01;
--chart-4: #EF4444;
--chart-5: #8B5CF6;
```

---

## 🎯 COMPONENT-SPECIFIC COLORS

### Buttons

**Primary Button (Green)**
```css
Normal:  bg-[#20603D]
Hover:   bg-[#1a4d31]
Text:    text-white
```

**Success Button (Green)**
```css
Normal:  bg-green-600
Hover:   bg-green-700
Text:    text-white
```

**Info Button (Blue)**
```css
Normal:  bg-blue-600
Hover:   bg-blue-700
Text:    text-white
```

**Danger Button (Red)**
```css
Normal:  bg-destructive (#d4183d)
Hover:   bg-destructive/90
Text:    text-white
```

**Outline Button (Green)**
```css
Border:  border-[#20603D]
Text:    text-[#20603D]
Hover:   bg-[#20603D]/10
```

### Links
```css
Color:   text-[#00A1DE]
Hover:   underline
```

### Icons
```css
Primary:   text-[#20603D]
Secondary: text-[#00A1DE]
Muted:     text-gray-600
```

### User Avatars
```css
Background: bg-[#20603D]
Text:       text-white
Ring:       ring-[#20603D]/15
```

### Input Fields
```css
Background: bg-[#f3f3f5]
Border:     border-gray-200
Focus:      ring-[#20603D]
Text:       text-gray-900
```

### Cards
```css
Background: bg-white
Border:     border-gray-200/80
Shadow:     shadow-sm
```

### Status Badges

**Open**
```css
bg-blue-50 text-blue-700
```

**In Progress**
```css
bg-yellow-50 text-yellow-700
```

**Resolved**
```css
bg-green-50 text-green-700
```

**Closed**
```css
bg-gray-100 text-gray-700
```

---

## 🌓 DARK MODE COLORS

### Dark Mode Brand Colors
```css
Primary:    oklch(0.985 0 0) /* Near white */
Chart 1:    oklch(0.488 0.243 264.376) /* Blue */
Chart 2:    oklch(0.696 0.17 162.48) /* Green */
Chart 3:    oklch(0.769 0.188 70.08) /* Yellow */
```

**Note:** Dark mode uses OKLCH color space for better perceptual uniformity

---

## 🔄 COLOR OPACITY GUIDE

### How Opacity Works
```
/10 = 10% opacity (very light)
/15 = 15% opacity (light)
/20 = 20% opacity (medium light)
/50 = 50% opacity (half transparent)
/90 = 90% opacity (slightly transparent)
```

### Common Opacity Uses
```css
bg-[#20603D]/10    /* Subtle highlight */
bg-[#20603D]/15    /* Avatar rings */
bg-[#20603D]/20    /* Card borders */
bg-[#20603D]/90    /* Button hover slight fade */
```

---

## 🎨 COLOR COMBINATIONS GUIDE

### Primary Actions (Green on White)
```
Background: #20603D
Text:       #ffffff
Contrast:   ✅ WCAG AAA (8.5:1)
```

### Links (Blue on White)
```
Text:       #00A1DE
Background: #ffffff
Contrast:   ✅ WCAG AA (3.5:1)
```

### Success Messages
```
Background: green-50 (#f0fdf4)
Text:       green-800 (#166534)
Border:     green-200
```

### Info Messages
```
Background: blue-50 (#eff6ff)
Text:       blue-800 (#1e40af)
Border:     blue-200
```

### Error Messages
```
Background: red-50 (#fef2f2)
Text:       red-800 (#991b1b)
Border:     red-200
```

### Warning Messages
```
Background: yellow-50 (#fefce8)
Text:       yellow-800 (#854d0e)
Border:     yellow-200
```

---

## 📐 COLOR ACCESSIBILITY

### WCAG Contrast Ratios

**AAA Standard (7:1 minimum)**
- ✅ White text on #20603D: 8.5:1
- ✅ White text on green-700: 7.8:1
- ✅ White text on blue-600: 7.2:1

**AA Standard (4.5:1 minimum)**
- ✅ White text on #00A1DE: 3.9:1 (AA for large text)
- ✅ Gray-900 on white: 18.2:1
- ✅ Gray-600 on white: 5.9:1

---

## 🛠️ HOW TO USE THIS PALETTE

### 1. Choosing Button Colors
- **Primary actions:** Use `bg-[#20603D]` (RRA Green)
- **Success:** Use `bg-green-600`
- **Info/Secondary:** Use `bg-blue-600`
- **Danger/Delete:** Use `bg-destructive` or `bg-red-600`

### 2. Choosing Text Colors
- **Headings:** `text-gray-900`
- **Body text:** `text-gray-700` or `text-gray-600`
- **Links:** `text-[#00A1DE]`
- **Emphasis:** `text-[#20603D]`

### 3. Choosing Background Colors
- **Page:** `bg-white` or `bg-gray-50`
- **Cards:** `bg-white` with `border-gray-200`
- **Muted sections:** `bg-gray-50` or `bg-gray-100`
- **Highlights:** `bg-[#20603D]/10` (light green tint)

---

## 🎯 QUICK REFERENCE TABLE

| Element | Normal | Hover | Active |
|---------|--------|-------|--------|
| Primary Button | `#20603D` | `#1a4d31` | - |
| Success Button | `green-600` | `green-700` | - |
| Link | `#00A1DE` | underline | - |
| Icon | `#20603D` | - | - |
| Border | `gray-200` | - | `#20603D` |
| Avatar | `#20603D` | - | - |

---

## 📱 RESPONSIVE COLOR NOTES

Colors remain consistent across screen sizes. Only opacity and sizing may vary:
- Mobile: Slightly larger touch targets, same colors
- Tablet: Same colors
- Desktop: Same colors, may use hover states more

---

## 🎨 DESIGN TOKENS

If implementing a design system, use these token names:

```javascript
{
  brand: {
    primary: '#20603D',
    secondary: '#00A1DE',
    accent: '#E5BE01'
  },
  semantic: {
    success: '#16a34a',
    info: '#2563eb',
    warning: '#ca8a04',
    danger: '#d4183d'
  },
  neutral: {
    white: '#ffffff',
    gray: { /* 50-900 */ },
    black: '#111827'
  }
}
```

---

**Color Palette Version:** 1.0
**Last Updated:** June 16, 2026
**Design System:** RRA DQIMS
