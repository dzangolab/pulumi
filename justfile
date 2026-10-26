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
    npm -r install

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
    npm -r outdated

# Publish packages
publish:
    @echo "{{ GREEN }}>>> Publish packages{{ NORMAL }}"
    npx shipjs trigger

# Prepare packages for release
release:
    @echo "{{ GREEN }}>>> Prepare packages for release{{ NORMAL }}"
    npx shipjs prepare

# Format package.json
sort-package:
    @echo "{{ GREEN }}>>> Format package.json{{ NORMAL }}"
    npm run sort-package

# Run type check
typecheck:
    @echo "{{ GREEN }}>>> Running Type check{{ NORMAL }}"
    npm run typecheck
