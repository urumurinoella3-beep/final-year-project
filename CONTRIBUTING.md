# Contributing to DQIMS

Thank you for your interest in contributing to the Data Quality Issues Management System (DQIMS)!

## 📋 About This Project

This is a Final Year Project for academic purposes at the University of Rwanda. While the project is primarily for educational purposes, we welcome feedback, suggestions, and contributions that can improve the system.

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with a clear title and description
3. **Provide details**:
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Java/Node version)

### Suggesting Enhancements

We appreciate feature suggestions! Please:

1. **Describe the feature** clearly
2. **Explain the use case** - why would this be valuable?
3. **Consider implementation** - how might it work?
4. **Check feasibility** - does it align with project goals?

### Code Contributions

While this is primarily an academic project, quality contributions are welcome:

#### Before You Start

1. **Fork the repository**
2. **Create a new branch** for your feature/fix
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Discuss major changes** by opening an issue first

#### Development Guidelines

**Backend (Java/Spring Boot):**
- Follow Java naming conventions
- Write clean, documented code
- Add comments for complex logic
- Ensure backward compatibility
- Test your changes locally

**Frontend (React/TypeScript):**
- Use TypeScript for type safety
- Follow React best practices
- Keep components modular and reusable
- Maintain consistent styling (Tailwind CSS)
- Test UI changes in different screen sizes

**Database:**
- Use migrations for schema changes
- Document new tables/columns
- Ensure data integrity with constraints
- Test with sample data

#### Code Style

**Java:**
- Use camelCase for variables and methods
- Use PascalCase for class names
- Indent with 4 spaces
- Maximum line length: 120 characters
- Add JavaDoc comments for public methods

**TypeScript/React:**
- Use camelCase for variables and functions
- Use PascalCase for components
- Indent with 2 spaces
- Use functional components with hooks
- Prefer arrow functions

#### Testing

- Test your changes thoroughly
- Include both positive and negative test cases
- Test with different user roles (Admin, HOD, Staff)
- Verify database integrity after changes
- Check for console errors

#### Commit Messages

Write clear, descriptive commit messages:

```
type: Brief description (max 50 chars)

Detailed explanation if needed:
- What changed
- Why it changed
- Any breaking changes
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat: Add issue filtering by date range
fix: Correct staff dashboard visibility issue
docs: Update installation instructions
refactor: Simplify authentication logic
```

#### Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** on your local environment
3. **Create a pull request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference to related issues
   - Screenshots for UI changes
4. **Wait for review** - be patient and responsive to feedback
5. **Make requested changes** if any
6. **Celebrate** when merged! 🎉

### Documentation Contributions

Documentation improvements are always welcome:

- Fix typos and grammatical errors
- Clarify confusing sections
- Add missing information
- Improve examples
- Add diagrams or screenshots

## 🚫 What We Don't Accept

- Breaking changes without discussion
- Code without proper testing
- Undocumented complex logic
- Security vulnerabilities
- Performance regressions
- Changes that break existing functionality

## 🏗️ Development Setup

See [README.md](README.md) for complete setup instructions.

**Quick Start:**
```bash
# Backend
cd Backend/DQIMS
mvn spring-boot:run

# Frontend
cd Frontend
npm install
npm run dev
```

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙋 Questions?

- Open an issue for questions
- Email: noella.urumuri@student.ur.ac.rw
- Check existing documentation first

## 🎓 Academic Integrity

Please note:
- This is an academic project
- Direct copying for other academic submissions is not permitted
- Use as reference or learning material is encouraged
- Cite appropriately if using in academic work

## 🌟 Recognition

All contributors will be acknowledged in:
- GitHub contributors list
- Project documentation (if significant contributions)
- Final project presentation (if applicable)

## 📚 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Git Best Practices](https://git-scm.com/book/en/v2)

---

**Thank you for contributing to DQIMS!** 🙏

Every contribution, no matter how small, helps make this project better for everyone learning about full-stack development and data quality management.
