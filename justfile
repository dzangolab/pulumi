[private]
default:
    @just --list

# Build packages
build:
    @echo "{{ GREEN }}>>> Build packages{{ NORMAL }}"
    npm run build

# Install dependencies
install:
    @echo "{{ GREEN }}>>> Installing dependencies{{ NORMAL }}"
    npm install

# Lint code
lint:
    @echo "{{ GREEN }}>>> Lint code{{ NORMAL }}"
    npm run lint

# Lint code and fix issues
lint-fix:
    @echo "{{ GREEN }}>>> Lint code{{ NORMAL }}"
    npm run lint:fix

# Check for outdated dependencies
outdated:
    @echo "{{ GREEN }}>>> Check for outdated dependencies{{ NORMAL }}"
    npm outdated

# Bump the version (patch, minor or major) and push the tag that triggers publishing
[no-exit-message]
release bump="patch":
    @echo "{{ GREEN }}>>> Release {{ bump }} version{{ NORMAL }}"
    @test "$(git branch --show-current)" = main || { echo "Not on main"; exit 1; }
    @test -z "$(git status --porcelain)" || { echo "Working copy not clean"; exit 1; }
    git pull --ff-only origin main
    npm version {{ bump }} -m "chore: release v%s"
    git push --follow-tags origin main

# Format package.json
sort-package:
    @echo "{{ GREEN }}>>> Format package.json{{ NORMAL }}"
    npm run sort-package

# Run type check
typecheck:
    @echo "{{ GREEN }}>>> Running Type check{{ NORMAL }}"
    npm run typecheck
