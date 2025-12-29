# Contributing to Task Manager Application

First off, thank you for considering contributing to the Task Manager Application! It's people like you that make this project better for everyone. ❤️

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

**Positive behavior includes:**
- ✅ Being respectful and inclusive
- ✅ Welcoming newcomers
- ✅ Accepting constructive criticism gracefully
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

**Unacceptable behavior includes:**
- ❌ Harassment or discriminatory language
- ❌ Trolling or insulting comments
- ❌ Publishing others' private information
- ❌ Any conduct that could be considered unprofessional

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
## Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 10, macOS 12.0]
- Node.js version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 120, Firefox 118]

## Screenshots
If applicable, add screenshots to help explain your problem.

## Additional Context
Any other information about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Enhancement Template:**
```markdown
## Summary
A clear and concise description of the enhancement.

## Motivation
Why is this enhancement needed? What problem does it solve?

## Detailed Description
A detailed explanation of the proposed feature.

## Alternatives Considered
Alternative solutions or features you've considered.

## Additional Context
Screenshots, mockups, or examples.
```

### Code Contributions

1. **Find or Create an Issue**
   - Check existing issues or create a new one
   - Comment on the issue to claim it
   - Wait for approval before starting work

2. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/task-manager-app.git
   cd task-manager-app
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**
   - Follow the coding standards below
   - Write/update tests
   - Update documentation

5. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   npm test

   # Frontend tests
   cd frontend
   npm test
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Use the PR template
   - Link related issues
   - Add screenshots if applicable

---

## 🛠️ Development Setup

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app

# Add upstream remote
git remote add upstream https://github.com/original/task-manager-app.git

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev  # Runs with nodemon for auto-reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 3 - Tests (Optional):**
```bash
# Backend tests in watch mode
cd backend
npm run test:watch

# Frontend tests in watch mode
cd frontend
npm test
```

---

## 📝 Coding Standards

### General Principles

- ✅ Write clean, readable, and maintainable code
- ✅ Follow the existing code style
- ✅ Keep functions small and focused
- ✅ Use meaningful variable and function names
- ✅ Add comments for complex logic
- ✅ Avoid code duplication (DRY principle)

### JavaScript/React Standards

**Formatting:**
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 100 characters

**React Components:**
```javascript
/**
 * Component description
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title
 * @returns {JSX.Element} Rendered component
 */
function MyComponent({ title }) {
  // State declarations
  const [count, setCount] = useState(0);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Backend Code:**
```javascript
/**
 * Function description
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const myFunction = (req, res) => {
  // Function logic
};
```

### File Organization

**Backend:**
```
backend/
├── routes/           # Route handlers
├── __tests__/        # Test files
├── database.js       # Database configuration
└── server.js         # Server entry point
```

**Frontend:**
```
frontend/src/
├── components/       # React components
│   ├── Component.js
│   └── Component.test.js
├── App.js
└── index.js
```

### Naming Conventions

- **Files:** PascalCase for components (`TaskForm.js`), camelCase for utilities
- **Components:** PascalCase (`TaskForm`, `TaskItem`)
- **Functions:** camelCase (`handleSubmit`, `fetchTasks`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **CSS Classes:** kebab-case (but we use Tailwind classes)

---

## 💾 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(backend): add task filtering by status

Implement endpoint to filter tasks by pending/completed status.
Includes validation and tests.

Closes #123
```

```bash
fix(frontend): resolve task deletion confirmation bug

The confirmation dialog was not showing before deletion.
Added proper event handling.

Fixes #456
```

```bash
docs: update API documentation with new endpoints

- Added examples for filtering
- Updated response schemas
- Fixed typos in README
```

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Update documentation if needed
2. ✅ Add/update tests for your changes
3. ✅ Ensure all tests pass
4. ✅ Update CHANGELOG.md if applicable
5. ✅ Rebase on latest main branch

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe the tests you ran and how to reproduce.

## Screenshots (if applicable)
Add screenshots here.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

1. At least one maintainer must review your PR
2. Address all review comments
3. Ensure CI/CD checks pass
4. Once approved, a maintainer will merge your PR

---

## 🧪 Testing Guidelines

### Writing Tests

**Backend (Jest + Supertest):**
```javascript
describe('POST /api/tasks', () => {
  test('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' })
      .expect(201);

    expect(response.body.task).toHaveProperty('id');
    expect(response.body.task.title).toBe('Test Task');
  });
});
```

**Frontend (React Testing Library):**
```javascript
test('renders task form', () => {
  render(<TaskForm onSubmit={jest.fn()} />);

  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
});
```

### Test Coverage

- Aim for at least 80% code coverage
- All new features must include tests
- All bug fixes must include regression tests

### Running Tests

```bash
# Backend
cd backend
npm test                 # Run once
npm run test:watch      # Watch mode
npm test -- --coverage  # With coverage

# Frontend
cd frontend
npm test                # Interactive mode
npm test -- --coverage  # With coverage
```

---

## 📖 Documentation

### Code Documentation

- Add JSDoc comments to all functions
- Explain complex logic with inline comments
- Keep comments up-to-date with code changes

### README Updates

Update README.md when:
- Adding new features
- Changing installation steps
- Updating dependencies
- Modifying API endpoints

### CLAUDE.md Updates

Update technical documentation for:
- Architecture changes
- New design patterns
- Database schema changes
- Performance optimizations

---

## 🎯 Priorities

We prioritize:
1. 🐛 Bug fixes
2. 🔒 Security improvements
3. ♿ Accessibility enhancements
4. 📱 Mobile responsiveness
5. ✨ New features
6. 🎨 UI/UX improvements

---

## ❓ Questions?

- 📧 Email: [project-email@example.com]
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/task-manager-app/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/task-manager-app/issues)

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

<div align="center">

**Happy Coding! 🚀**

</div>
