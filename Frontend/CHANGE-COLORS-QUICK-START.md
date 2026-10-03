# 🚀 Quick Start: Change Colors in 5 Minutes

The fastest way to change colors in your DQIMS application.

---

## ⚡ SUPER QUICK METHOD (Global Change)

### Step 1: Open Theme File
```
File: Frontend/src/styles/theme.css
```

### Step 2: Change These 3 Lines (Lines 4-6)
```css
:root {
  --rra-green: #YOUR_NEW_COLOR;    /* Change from #20603D */
  --rra-blue: #YOUR_NEW_COLOR_2;   /* Change from #00A1DE */
  --rra-orange: #YOUR_NEW_COLOR_3; /* Change from #E5BE01 */
}
```

### Step 3: Also Change Line 11
```css
--primary: #YOUR_NEW_COLOR;  /* Same as rra-green */
```

### Step 4: Save and Reload Browser
✅ **Done!** Most buttons and icons will now use your new colors.

---

## 🎯 STANDARD METHOD (Complete Change)

### Step 1: Choose Your New Colors
Example: Let's say you want to change green to blue:
- **Old Green:** `#20603D`
- **New Blue:** `#1E5A8E`

### Step 2: Open VS Code

### Step 3: Find & Replace (Press `Ctrl + Shift + H`)

**Replace 1: Main Color**
```
Find:    #20603D
Replace: #1E5A8E
```
Click "Replace All" in `src/app/pages/` folder

**Replace 2: Hover Color**
```
Find:    #1a4d31
Replace: #16486F  (your darker shade)
```
Click "Replace All"

**Replace 3: Link Color (Optional)**
```
Find:    #00A1DE
Replace: #YOUR_LINK_COLOR
```
Click "Replace All"

### Step 4: Update Theme File
Open `Frontend/src/styles/theme.css`:
```css
:root {
  --rra-green: #1E5A8E;      /* Line 4 */
  --rra-blue: #00A1DE;       /* Line 5 */
  --rra-orange: #E5BE01;     /* Line 6 */
  --primary: #1E5A8E;        /* Line 11 */
  --sidebar-primary: #1E5A8E; /* Line 37 */
  --chart-1: #1E5A8E;        /* Line 30 */
}
```

### Step 5: Test
1. Save all files
2. Refresh browser (`Ctrl + R`)
3. Check these pages:
   - Login page
   - Dashboard
   - Create Issue button
   - User avatar colors

✅ **Done!** All colors updated.

---

## 🎨 COLOR PICKER TOOLS

### Need to Find a Darker/Lighter Shade?
Visit: https://coolors.co/

1. Enter your main color: `#20603D`
2. Click "Generate" to see similar shades
3. Pick a darker shade for hover states
4. Pick a lighter shade for backgrounds

### Common Shade Formulas
- **Hover (darker):** Reduce brightness by 15-20%
- **Background (lighter):** Add 90% opacity `/10`
- **Border (very light):** Add 80% opacity `/20`

---

## 📋 FILES YOU NEED TO CHANGE

### Essential (2 files)
1. ✅ `Frontend/src/styles/theme.css` - Global colors
2. ✅ `Frontend/src/app/pages/*.tsx` - Page-specific colors

### Optional (if you customized)
3. `Frontend/src/app/components/*.tsx` - Component colors
4. `Frontend/src/app/components/ui/*.tsx` - UI library colors

---

## 🔍 VERIFICATION CHECKLIST

After changing colors, verify:

- [ ] Login button color changed
- [ ] "Forgot password" link color changed
- [ ] Dashboard buttons color changed
- [ ] "Create Issue" button color changed
- [ ] User avatar background color changed
- [ ] Icons color changed
- [ ] Hover states work correctly
- [ ] Charts use new colors

---

## ⚠️ COMMON MISTAKES

### Mistake 1: Only Changed Theme File
**Problem:** Page-specific hardcoded colors still show old color
**Solution:** Use Find & Replace to update all `.tsx` files

### Mistake 2: Forgot Hover States
**Problem:** Button looks good but weird on hover
**Solution:** Always update both normal and hover colors together
```css
/* Update both of these */
bg-[#20603D]      ← Main color
hover:bg-[#1a4d31] ← Hover color (darker)
```

### Mistake 3: Opacity Not Updated
**Problem:** Light backgrounds still use old color
**Solution:** Update colors with `/10`, `/15`, `/20` suffix
```css
bg-[#20603D]/10  ← Very light background
```

---

## 🎯 PAGE-BY-PAGE QUICK FIND

### Login Page
```bash
File: src/app/pages/LoginPage.tsx
Lines: 67, 72
Find: #20603D, #00A1DE
```

### Issue Management
```bash
File: src/app/pages/IssueManagementPage.tsx
Lines: 142, 316, 460
Find: #20603D, #1a4d31
```

### Issue Details
```bash
File: src/app/pages/IssueDetailsPage.tsx
Lines: 137, 193, 211, 242, 252, 265, 270
Find: #20603D, #00A1DE
```

### Department Management
```bash
File: src/app/pages/DepartmentManagementPage.tsx
Lines: 91, 115, 144, 171
Find: #20603D, #1a4d31
```

---

## 💡 PRO TIPS

### Tip 1: Test One Page First
1. Change colors on Login page only
2. Test in browser
3. If it looks good, proceed to other pages

### Tip 2: Use Browser DevTools
1. Right-click element → Inspect
2. Find the color in styles
3. Test new color directly in DevTools
4. Copy working color to your code

### Tip 3: Keep a Color Reference
Create a note with your colors:
```
Primary:   #1E5A8E (Blue)
Hover:     #16486F (Dark Blue)
Link:      #00A1DE (Cyan)
Background: #1E5A8E/10 (Light Blue)
```

### Tip 4: Git Commit Before Changing
```bash
git add .
git commit -m "Before color changes"
```
Now you can easily revert if needed!

---

## 🆘 TROUBLESHOOTING

### "Color didn't change!"
1. Clear browser cache (`Ctrl + Shift + R`)
2. Check if you saved the file
3. Look for that color in other files
4. Check browser console for errors

### "Hover state looks weird!"
Make hover color darker than main color:
```css
Normal: #1E5A8E
Hover:  #16486F (15-20% darker)
```

### "Some elements still old color!"
Search entire project:
```bash
# In VS Code
Ctrl + Shift + F
Search: #20603D
```

### "Text not readable on new color!"
Check contrast ratio: https://webaim.org/resources/contrastchecker/
- White text needs 4.5:1 contrast minimum
- If ratio too low, choose darker button color

---

## 📞 QUICK HELP REFERENCE

| Problem | Solution |
|---------|----------|
| Color not changing | Clear cache, check all files |
| Hover looks bad | Make it 15-20% darker |
| Text not readable | Use darker background color |
| Only some buttons changed | Search for hardcoded colors in .tsx files |
| Opacity background wrong | Update colors with `/10` or `/20` |

---

## ✅ FINAL CHECKLIST

Before you're done:

- [ ] Updated `theme.css` lines 4, 5, 6, 11, 37
- [ ] Replaced `#20603D` in all .tsx files
- [ ] Replaced `#1a4d31` in all .tsx files
- [ ] Replaced `#00A1DE` if changing blue
- [ ] Tested login page
- [ ] Tested dashboard
- [ ] Tested creating an issue
- [ ] Tested hovering buttons
- [ ] Checked text contrast
- [ ] Committed changes to git

---

## 🎉 SUCCESS!

If all checkboxes above are checked, you're done!

Your DQIMS application now has your custom colors.

---

**Need More Details?**
- Full guide: `COLOR-CUSTOMIZATION-GUIDE.md`
- Line numbers: `COLOR-LINE-NUMBERS.md`
- Color palette: `COLOR-PALETTE.md`

**Time to Complete:** 5-15 minutes

**Last Updated:** June 16, 2026
