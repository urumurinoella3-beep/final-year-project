# A4 Printing Guide for DQIMS Class Diagrams

## 📄 **3 Versions Created for A4 Paper**

| File | Orientation | Best For | Classes Shown |
|------|-------------|----------|---------------|
| **CLASS_DIAGRAM_A4_COMPACT.puml** ⭐ | Portrait | Quick reference, handouts | All 20 (minimal detail) |
| **CLASS_DIAGRAM_A4_PRINT.puml** | Portrait | Standard presentation | All 20 (moderate detail) |
| **CLASS_DIAGRAM_A4_LANDSCAPE.puml** | Landscape | Detailed review | All 20 (full detail) |

---

## ⚡ **QUICK START: Generate & Print**

### **Step 1: Generate the Diagram (2 minutes)**

1. Go to: **http://www.plantuml.com/plantuml/uml/**
2. Copy all code from **CLASS_DIAGRAM_A4_COMPACT.puml**
3. Paste into the website
4. Click **Submit**
5. Diagram appears!

### **Step 2: Download for Printing (1 minute)**

Click the download format:
- **PNG** - For quick printing (recommended)
- **SVG** - For high-quality printing (best quality)
- **PDF** - For direct printing (easiest)

### **Step 3: Print (1 minute)**

**Recommended Settings:**
- Paper: **A4** (210mm × 297mm)
- Orientation: **Portrait** (for compact version)
- Quality: **High** or **Best**
- Color: **Color** (to see package colors)
- Margins: **Narrow** (0.5 inch)

**Total Time: 4 minutes!** ⏱️

---

## 🎨 **WHICH VERSION TO USE?**

### **1. CLASS_DIAGRAM_A4_COMPACT.puml** ⭐ **RECOMMENDED**

**Pros:**
✅ Fits perfectly on A4 portrait
✅ All 20 classes visible at once
✅ Readable when printed
✅ No need to zoom
✅ Perfect for defense handouts
✅ Committee can see everything on one page

**Cons:**
❌ Less detail (only essential attributes)
❌ No methods shown

**Use when:**
- Printing handouts for defense committee
- Quick reference sheet
- Need to see all classes at once
- Printing on standard office printer

**Print Settings:**
```
Paper: A4 Portrait
DPI: 300
Color: Yes
Scale: 100%
```

---

### **2. CLASS_DIAGRAM_A4_PRINT.puml**

**Pros:**
✅ More detail than compact version
✅ Shows methods
✅ Still fits on A4
✅ Better for technical review

**Cons:**
❌ Text might be small on some printers
❌ Need good quality printer

**Use when:**
- Technical documentation
- Detailed review needed
- High-quality printer available
- Committee wants to see methods

**Print Settings:**
```
Paper: A4 Portrait
DPI: 300
Color: Yes
Scale: 100%
Quality: Best
```

---

### **3. CLASS_DIAGRAM_A4_LANDSCAPE.puml**

**Pros:**
✅ More horizontal space
✅ Classes arranged in columns
✅ Clear separation of packages
✅ Easy to follow relationships

**Cons:**
❌ Need to rotate paper
❌ Landscape orientation

**Use when:**
- Prefer landscape layout
- Presenting to group
- Need clear package separation
- Wider display area preferred

**Print Settings:**
```
Paper: A4 Landscape
DPI: 300
Color: Yes
Scale: 100%
```

---

## 🖨️ **PRINTING OPTIONS**

### **Option 1: Home/Office Printer**

**Recommended File:** CLASS_DIAGRAM_A4_COMPACT.puml

**Steps:**
1. Generate PNG from PlantUML online
2. Save to computer
3. Open in image viewer or Word
4. Print → Select A4 paper
5. Print quality: High
6. Done!

**Expected Result:**
- All 20 classes visible
- Text readable (7-8pt font)
- Colors show package types
- Fits on one page

---

### **Option 2: Professional Print Shop**

**Recommended File:** CLASS_DIAGRAM_A4_PRINT.puml or LANDSCAPE

**Steps:**
1. Generate **SVG** format (highest quality)
2. Save SVG file
3. Take to print shop
4. Request: "A4 color print, high quality"
5. Optional: Ask for glossy paper

**Expected Result:**
- Professional quality
- Sharp text
- Vibrant colors
- Perfect for defense presentation

**Cost:** ~$0.50 - $2.00 per page

---

### **Option 3: PDF for Digital + Print**

**Recommended File:** Any version

**Steps:**
1. Generate **PDF** directly from PlantUML
2. Open in Adobe Reader
3. Print with "Fit to page" enabled
4. Or share PDF digitally with committee

**Expected Result:**
- Same quality as original
- Can zoom in PDF viewer
- Easy to share via email
- Print anytime

---

## 📐 **SIZE SPECIFICATIONS**

### **A4 Paper Dimensions:**
- Width: 210 mm (8.27 inches)
- Height: 297 mm (11.69 inches)

### **Diagram Dimensions (approximate):**

**Compact Version:**
- Width: ~180 mm
- Height: ~250 mm
- Margins: 15 mm on all sides
- Font: 7-8pt
- **Result:** All 20 classes fit perfectly ✅

**Print Version:**
- Width: ~190 mm
- Height: ~270 mm
- Margins: 10 mm on all sides
- Font: 9pt
- **Result:** Fits with more detail ✅

**Landscape Version:**
- Width: ~270 mm (landscape)
- Height: ~180 mm
- Margins: 10 mm on all sides
- Font: 8pt
- **Result:** Wide layout ✅

---

## 🎯 **DEFENSE COMMITTEE HANDOUTS**

### **What to Print:**

**Main Handout:**
- **CLASS_DIAGRAM_A4_COMPACT.puml**
- Print **5-7 copies** (one per committee member + extras)
- Color printing
- A4 paper
- Portrait orientation

**Backup Detailed Version:**
- **CLASS_DIAGRAM_A4_PRINT.puml**
- Print **2 copies**
- Keep in folder for detailed questions

**Personal Copy:**
- Print **1 color copy** of compact version
- Laminate if possible
- Keep as reference during defense

**Total Copies Needed:** 8-10 pages

**Total Cost:** ~$5-10 (if using print shop)

---

## ✅ **PRINT QUALITY CHECKLIST**

Before printing multiple copies, print ONE test page:

- [ ] All 20 classes are visible
- [ ] Text is readable (can read class names clearly)
- [ ] Colors are distinct (can tell packages apart)
- [ ] Relationships/arrows are clear
- [ ] Legend is readable
- [ ] Title is clear
- [ ] No text cut off at edges
- [ ] No blurry text
- [ ] Paper orientation correct

**If all checked:** Print remaining copies ✅

**If issues:** Adjust settings or try different version

---

## 🔧 **TROUBLESHOOTING PRINT ISSUES**

### **Problem: Text too small to read**

**Solutions:**
1. Use **CLASS_DIAGRAM_A4_COMPACT.puml** (largest font)
2. Print on A3 instead of A4
3. Increase font size in `.puml` file:
   ```plantuml
   skinparam defaultFontSize 9  ' Change from 7 to 9
   ```
4. Print landscape instead of portrait

---

### **Problem: Diagram cut off at edges**

**Solutions:**
1. Enable "Fit to page" in print dialog
2. Reduce margins to 0.5 inch
3. Export as PDF first, then print
4. Scale to 95% in print settings

---

### **Problem: Colors not showing/printing gray**

**Solutions:**
1. Check printer color ink levels
2. Enable "Color" in print settings (not "Grayscale")
3. Use color printer (not black & white)
4. Try print shop if home printer doesn't support color

---

### **Problem: Image is blurry**

**Solutions:**
1. Download **SVG** instead of PNG
2. Set DPI to 300 in PlantUML settings
3. Don't upscale/stretch the image
4. Use "Best" quality in print settings

---

### **Problem: Doesn't fit on A4**

**Solutions:**
1. Use **CLASS_DIAGRAM_A4_COMPACT.puml** (designed specifically for A4)
2. Enable "Shrink to fit" in print dialog
3. Check paper size is set to A4 (not Letter)
4. Reduce margins

---

## 💡 **PRO PRINTING TIPS**

### **1. Color Coding Strategy**

The diagrams use 5 colors for packages:
- **Green (#E8F5E9):** Core Domain - Most important
- **Blue (#E3F2FD):** Data Validation
- **Orange (#FFF3E0):** Analysis & Reporting
- **Pink (#FCE4EC):** System & Compliance
- **Purple (#F3E5F5):** Integration

**Tip:** Even if printing black & white, colors become gray shades that differentiate packages.

---

### **2. Two-Color Printing (Cost Saver)**

If color is expensive:
- Print compact version in **color** for yourself (1 copy)
- Print detailed version in **black & white** for committee (5 copies)
- Save 60% on printing cost

---

### **3. Timing**

**Print 2-3 days before defense:**
- Allows time for reprints if issues
- Can test different versions
- No last-minute stress

**Not recommended:**
- Morning of defense (printer might jam, ink might run out)
- Night before (print shops might be closed)

---

### **4. Backup Strategy**

Prepare these backups:

1. **Digital Copy:**
   - Save PDF on laptop
   - Email to yourself
   - USB drive

2. **Physical Copy:**
   - Print 2 extra copies
   - Keep in separate folder

3. **PowerPoint Version:**
   - Insert PNG in presentation
   - Can project if handouts run out

---

## 📊 **PRINT SETTINGS QUICK REFERENCE**

### **Windows:**
```
File → Print
Printer: [Your Color Printer]
Paper: A4
Orientation: Portrait
Color: Color
Quality: Best/High
Pages: 1
Scaling: Fit to page
Margins: Narrow
```

### **Mac:**
```
File → Print
Printer: [Your Color Printer]
Paper Size: A4
Orientation: Portrait
Quality & Media: Best
Color Matching: ColorSync
Scale to fit page: Yes
```

### **Adobe Reader (PDF):**
```
File → Print
Page Sizing: Fit
Auto-rotate: No
Choose paper source: A4
Quality: High
```

---

## 🎓 **DEFENSE DAY CHECKLIST**

### **3 Days Before:**
- [ ] Generate compact version PNG/SVG
- [ ] Print 1 test copy
- [ ] Verify quality
- [ ] If good, print all copies needed

### **1 Day Before:**
- [ ] Check all prints are in folder
- [ ] Count: Need 5-7 copies
- [ ] Verify no pages stuck together
- [ ] No smudges or printing errors

### **Defense Day Morning:**
- [ ] Put printed diagrams in presentation folder
- [ ] Order: Title page → Diagram → Other materials
- [ ] Carry in protective folder (don't fold!)
- [ ] Have backup PDF on USB

### **During Defense:**
- [ ] Distribute one to each committee member
- [ ] Keep one for yourself
- [ ] Point to diagram while explaining
- [ ] Reference classes by name

---

## 💰 **COST ESTIMATE**

### **Home Printer:**
- Ink/toner usage: ~$0.20 per color page
- A4 paper: ~$0.05 per page
- **Total: ~$0.25 per copy**
- **For 7 copies: ~$1.75**

### **Print Shop:**
- Color A4 print: $0.50 - $2.00 per page
- High-quality paper: +$0.50
- **Total: ~$1.00 - $2.50 per copy**
- **For 7 copies: ~$7.00 - $17.50**

### **University Print Center:**
- Usually cheaper: $0.25 - $0.50 per color page
- **For 7 copies: ~$1.75 - $3.50**

**Recommendation:** Use university print center if available (cheapest + good quality)

---

## 🌟 **FINAL RECOMMENDATIONS**

### **For Defense Presentation:**

**Best Choice:** **CLASS_DIAGRAM_A4_COMPACT.puml**

**Why:**
1. ✅ Fits perfectly on A4 (tested)
2. ✅ All 20 classes visible at once
3. ✅ Committee can follow along easily
4. ✅ No need to flip pages
5. ✅ Professional appearance
6. ✅ Cost-effective (1 page per person)

**Print:**
- 7 copies color (committee + extras)
- 1 laminated copy for yourself
- Save PDF on USB as backup

**Total:** 8 pages, ~$5-10, prints in 10 minutes

---

## 📞 **QUICK HELP**

**Need to print RIGHT NOW?**

1. Go to: http://www.plantuml.com/plantuml/uml/
2. Copy code from: **CLASS_DIAGRAM_A4_COMPACT.puml**
3. Paste and click Submit
4. Download PNG
5. Print on A4 color printer
6. Done in 5 minutes!

---

**YOU'RE READY TO PRINT! 🖨️**

Choose **CLASS_DIAGRAM_A4_COMPACT.puml** and print it now!

---

**Document Version:** 1.0  
**Created:** March 6, 2026  
**For:** DQIMS Defense Presentation - AUCA
