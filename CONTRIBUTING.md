# Contributing to Eventuate

## Commit Messages

We use semantic commits to make our commit messages more meaningful. Each commit
message should follow this format:

```text
type(scope): subject

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (whitespace,
  formatting, etcetera)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `ci`: Changes to our CI configuration files and scripts

### Scope

The scope should be the name of the component affected:

- `data`: Changes to data handling
- `extractor`: Changes to data extraction
- `ui`: Changes to user interface elements
- `deps`: Dependency updates

### Examples

```text
fix(extractor): correct volunteer count calculation
docs(readme): update build instructions
test(data): add unit tests for finish time parsing
```
