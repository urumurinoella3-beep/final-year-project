# PlantUML Class Diagram - Usage Guide
## How to Generate Your DQIMS Class Diagrams

---

## 📦 **FILES CREATED**

| File | Description | Best For |
|------|-------------|----------|
| **CLASS_DIAGRAM.puml** | Complete diagram with all details | Technical documentation, detailed review |
| **CLASS_DIAGRAM_SIMPLIFIED.puml** | Simplified for presentations | Defense presentation, overview slides |

---

## 🚀 **METHOD 1: Online (Easiest - No Installation)**

### **Step 1: Open PlantUML Online Server**
Go to: **http://www.plantuml.com/plantuml/uml/**

### **Step 2: Copy the Code**
1. Open `CLASS_DIAGRAM_SIMPLIFIED.puml` (for presentation)
2. Copy ALL the code (Ctrl+A, Ctrl+C)

### **Step 3: Paste and Generate**
1. Paste the code into the text box on PlantUML website
2. Click "Submit" or press Ctrl+Enter
3. Diagram appears automatically!

### **Step 4: Download the Image**
Click the download options:
- **PNG** (best for PowerPoint/presentations)
- **SVG** (best for high-quality printing)
- **PDF** (best for documents)

**✅ Done in 2 minutes!**

---

## 💻 **METHOD 2: Visual Studio Code (Recommended for Editing)**

### **Step 1: Install VS Code**
Download from: https://code.visualstudio.com/

### **Step 2: Install PlantUML Extension**
1. Open VS Code
2. Click Extensions icon (left sidebar) or press `Ctrl+Shift+X`
3. Search for "PlantUML"
4. Install "PlantUML" by jebbs
5. Restart VS Code

### **Step 3: Install Graphviz (Required)**
**Windows:**
- Download from: https://graphviz.org/download/
- Run installer
- Add to PATH during installation

**Mac:**
```bash
brew install graphviz
```

**Linux:**
```bash
sudo apt-get install graphviz
```

### **Step 4: Open the File**
1. Open `CLASS_DIAGRAM_SIMPLIFIED.puml` in VS Code
2. Press `Alt+D` to preview
3. Diagram appears in preview pane!

### **Step 5: Export Image**
1. Right-click in the editor
2. Choose "PlantUML: Export Current Diagram"
3. Select format: PNG, SVG, or PDF
4. Choose save location

**✅ You can now edit and regenerate instantly!**

---

## 🖼️ **METHOD 3: IntelliJ IDEA / PyCharm (For Developers)**

### **Step 1: Install PlantUML Integration Plugin**
1. Go to File → Settings → Plugins
2. Search for "PlantUML integration"
3. Install and restart

### **Step 2: Open File**
1. Open `CLASS_DIAGRAM_SIMPLIFIED.puml`
2. Diagram renders automatically in preview pane

### **Step 3: Export**
- Right-click → Export to PNG/SVG/PDF

---

## 📊 **METHOD 4: Command Line (Batch Processing)**

### **Step 1: Install PlantUML JAR**
Download from: https://plantuml.com/download

### **Step 2: Generate Diagram**
```bash
# Generate PNG
java -jar plantuml.jar CLASS_DIAGRAM_SIMPLIFIED.puml

# Generate SVG
java -jar plantuml.jar -tsvg CLASS_DIAGRAM_SIMPLIFIED.puml

# Generate PDF
java -jar plantuml.jar -tpdf CLASS_DIAGRAM_SIMPLIFIED.puml
```

**✅ Creates image file in same directory!**

---

## 🎨 **CUSTOMIZATION OPTIONS**

### **Change Colors**

Find this section in the `.puml` file:
```plantuml
skinparam class {
    BackgroundColor<<core>> #E8F5E9
    BackgroundColor<<validation>> #E3F2FD
    BackgroundColor<<analysis>> #FFF3E0
    BackgroundColor<<system>> #FCE4EC
    BorderColor #20603D
    ArrowColor #00A1DE
}
```

**RRA Brand Colors:**
- Green: `#20603D`
- Blue: `#00A1DE`
- Orange: `#E5BE01`

### **Change Title**

Find and edit:
```plantuml
title DQIMS - Simplified Class Diagram\nRwanda Revenue Authority\n
```

### **Add/Remove Classes**

Simply delete or comment out (add `'` at start of line):
```plantuml
' class Attachment <<system>> {
'     ...
' }
```

### **Hide Methods**

To show only attributes, remove the `__` line and all methods:
```plantuml
class User <<core>> {
    - id: UUID
    - employeeId: String
    - email: String
}
```

### **Change Font Size**

Find and edit:
```plantuml
skinparam class {
    FontSize 12  ' Change to 10, 14, 16, etc.
}
```

---

## 📋 **WHICH DIAGRAM TO USE FOR DEFENSE?**

### **For Main Presentation Slide:**
✅ Use **CLASS_DIAGRAM_SIMPLIFIED.puml**
- Cleaner, easier to read
- Focuses on main classes
- Better for projector display

### **For Detailed Documentation:**
✅ Use **CLASS_DIAGRAM.puml**
- Shows all attributes and methods
- Complete relationships
- Technical reference

### **For Backup Slides:**
Create a hybrid:
1. Export simplified version
2. Create additional slides with zoomed sections from detailed version

---

## 🎯 **PRESENTATION TIPS**

### **Slide 1: Complete Diagram**
- Use simplified version
- Show overall structure
- Highlight 4 main packages (colored boxes)

**What to say:**
> "My system has 20 entity classes organized into 4 main packages: Core Domain in green for main business logic, Data Validation in blue for quality checks, Analysis in orange for reporting and RCA, and System & Compliance in pink for audit logs and notifications."

### **Slide 2: Zoom on Core Package**
- Export just the Core Domain section
- Explain Department → User → Issue flow

**What to say:**
> "The core domain has 7 main classes. Departments contain Users who can report Issues. Each Issue has Comments, History tracking, and can be linked to Related Issues."

### **Slide 3: Zoom on Validation Package**
- Show ValidationRule → Execution → Failure → Issue

**What to say:**
> "The validation system has 3 classes. Rules define quality checks, Executions run those checks, and Failures record problems. Failures can automatically create Issues for the team to fix."

### **Slide 4: Key Relationships**
- Highlight the arrows
- Explain cardinality (1 to many, etc.)

**What to say:**
> "One Department has many Users. One User can report many Issues. Each Issue can have many Comments. This structure allows proper tracking and assignment."

---

## 🔧 **TROUBLESHOOTING**

### **"Diagram not rendering"**
- Check for syntax errors (missing braces, quotes)
- Ensure Graphviz is installed (for VS Code method)
- Try online version first to verify code is correct

### **"Text too small"**
- Increase FontSize in skinparam
- Export as SVG and zoom in
- Use larger canvas size

### **"Image is blurry"**
- Export as SVG instead of PNG
- Or export PNG at higher DPI:
  ```bash
  java -jar plantuml.jar -DPLANTUML_LIMIT_SIZE=16384 CLASS_DIAGRAM.puml
  ```

### **"Too much detail for presentation"**
- Use simplified version
- Remove method sections
- Hide less important classes

### **"Need different colors"**
- Edit skinparam section
- Use RRA brand colors: #20603D, #00A1DE, #E5BE01

---

## 📤 **EXPORTING FOR DIFFERENT USES**

### **For PowerPoint Presentation:**
```
Format: PNG
Resolution: 300 DPI
Size: Full width
```

### **For Project Report (PDF):**
```
Format: SVG or PDF
Quality: High
Embedded fonts: Yes
```

### **For Printing (Poster):**
```
Format: SVG
Convert to PDF at print shop
Size: A3 or A2
```

### **For Defense Committee (Handout):**
```
Format: PDF
Include legend
Print on A4 paper
```

---

## 🎨 **CREATING VARIATIONS**

### **Variation 1: Show Only Core Classes (5 classes)**
Delete all packages except "Core Domain" and keep only:
- Department
- User
- Issue
- IssueCategory
- IssueComment

### **Variation 2: Focus on Validation Flow**
Keep only:
- DataValidationRule
- DataValidationExecution
- DataValidationFailure
- Issue

### **Variation 3: Show User Roles**
Add role hierarchy:
```plantuml
class Admin extends User
class HOD extends User
class Secretary extends User
class Member extends User
```

---

## 📚 **PLANTUML SYNTAX QUICK REFERENCE**

### **Basic Class:**
```plantuml
class ClassName {
    - privateAttribute: Type
    + publicAttribute: Type
    # protectedAttribute: Type
    --
    + publicMethod(): ReturnType
    - privateMethod(param: Type): void
}
```

### **Relationships:**
```plantuml
ClassA "1" -- "many" ClassB : label
ClassA "1" --> "many" ClassB : directed
ClassA "1" ..> "1" ClassB : dependency
ClassA "1" --|> "1" ClassB : inheritance
ClassA "1" --* "many" ClassB : composition
ClassA "1" --o "many" ClassB : aggregation
```

### **Stereotypes:**
```plantuml
class MyClass <<stereotype>> {
    ...
}
```

### **Notes:**
```plantuml
note top of ClassName
    This is a note
    explaining the class
end note

note left of ClassName : Short note

note as N1
    Floating note
end note
```

### **Packages:**
```plantuml
package "Package Name" #Color {
    class Class1
    class Class2
}
```

---

## ✅ **QUICK START CHECKLIST**

For your defense presentation, do this:

- [ ] Go to http://www.plantuml.com/plantuml/uml/
- [ ] Copy all code from `CLASS_DIAGRAM_SIMPLIFIED.puml`
- [ ] Paste into PlantUML online
- [ ] Click Submit
- [ ] Download as PNG (for PowerPoint)
- [ ] Download as SVG (for printing)
- [ ] Insert into presentation slide
- [ ] Test on projector/large screen
- [ ] Create zoomed versions if text is too small
- [ ] Print backup copy for committee

**Total time: 10 minutes!**

---

## 🎓 **FOR YOUR DEFENSE**

### **What the Committee Will Ask:**

**Q: "Explain your class diagram"**
**A:** "I have 20 entity classes organized into 4 packages. The Core Domain handles users and issues, Data Validation automates quality checks, Analysis provides reporting and root cause analysis, and System & Compliance ensures audit trails and notifications."

**Q: "What's the main class?"**
**A:** "The Issue class is central. It connects to Users (who reports, who's assigned), Departments, Categories, Comments, History, and Root Cause Analysis. It tracks the complete lifecycle from creation to resolution."

**Q: "How do you handle validation?"**
**A:** "Three classes work together: ValidationRule defines the check, ValidationExecution runs it, and ValidationFailure records problems. Failures can automatically create Issues with a foreign key relationship."

**Q: "What about security?"**
**A:** "The User class has a role attribute (ADMIN, HOD, Secretary, Member). The AuditLog class records every action with user ID, timestamp, and IP address for compliance."

---

## 🔗 **USEFUL LINKS**

- **PlantUML Official:** https://plantuml.com/
- **Online Server:** http://www.plantuml.com/plantuml/
- **Class Diagram Guide:** https://plantuml.com/class-diagram
- **VS Code Extension:** https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml
- **Graphviz Download:** https://graphviz.org/download/
- **Color Picker:** https://htmlcolorcodes.com/

---

## 💡 **PRO TIPS**

1. **Test Early:** Generate diagrams 2-3 days before defense to fix any issues
2. **Have Backups:** Export in multiple formats (PNG, SVG, PDF)
3. **Print Quality:** Use SVG or high-DPI PNG for printing
4. **Simplify:** For presentation, less is more - use simplified version
5. **Practice:** Be ready to explain any class or relationship
6. **Zoom Sections:** Create separate diagrams for each package if needed
7. **Legend:** Always include the legend explaining colors and symbols

---

## 📞 **NEED HELP?**

If diagrams won't generate:
1. Try online version first (http://www.plantuml.com/plantuml/)
2. Check for error messages in red
3. Verify all braces `{}` are matched
4. Ensure Graphviz is installed (for local tools)
5. Start with simplified version (less code = fewer errors)

---

**You now have everything needed to create professional class diagrams for your defense!**

**Good luck with your presentation! 🎓**

---

**Document Version:** 1.0  
**Created:** March 6, 2026  
**For:** DQIMS Final Year Project Defense - AUCA
