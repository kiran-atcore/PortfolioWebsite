# Token Efficiency & Workspace Rules

These guidelines are designed to minimize context window bloat, reduce unnecessary token consumption, and optimize speed and cost during development.

## 1. Targeted File Inspection (Avoid Full-File Dumps)
- **Slice Views**: Always inspect files using `StartLine` and `EndLine` slices when locating specific functions, types, or components. Avoid reading whole 300+ line files when only a small section is needed.
- **Search First**: Prefer `grep_search` to pinpoint symbols, imports, or styles before reading files.
- **Directory Discovery**: Use `list_dir` with specific target paths rather than recursive or repetitive directory walks.

## 2. Surgical Code Edits (Diffs Over Rewrites)
- **Targeted Replacements**: Use `replace_file_content` or `multi_replace_file_content` for surgical updates.
- **Never Rewrite Entire Files**: Avoid using `write_to_file` to rewrite entire existing components or pages when making incremental changes. Rewriting entire files consumes hundreds to thousands of tokens in both input and output.
- **Modular Component Architecture**: Keep React/Next.js components small and decomposed (< 120 lines). Smaller files are inherently cheaper to read, modify, and verify.

## 3. Terminal & Command Output Management
- **Suppress Verbose Logs**: When running build, lint, or package commands, filter or limit verbosity (e.g. `npm run build --silent` or targeted linting like `npx eslint src/path/to/file.tsx`).
- **Avoid Command Flooding**: Avoid running commands that print thousands of lines of logs directly into context.

## 4. Concise Communication & Output
- **No Redundant Code Echoing**: Do not paste full source files into final responses when code has already been written to disk. Use file links (e.g., `[ComponentName](file:///path/to/file.tsx)`) with brief explanations of the delta.
- **Direct & Action-Oriented**: Keep conversational responses brief, technical, and focused on decisions and results.
- **Skip Walkthrough Artifacts**: Do not generate, modify, or update `walkthrough.md` files after execution unless explicitly requested by the user.
- **Ultra-Concise Post-Execution**: Avoid lengthy post-execution explanations. Keep outputs to minimal bullet points highlighting file links and essential status.

## 5. Asset & Fixture Optimization
- **Externalize Large Data**: Do not inline large mock JSON arrays, long SVG paths, or base64 strings in code. Store them in separate data files or assets in `public/` so they are not loaded into working context repeatedly.
