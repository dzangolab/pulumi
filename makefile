tag = 0
version = 0.1

build:
	@printf "\033[0;32m>>> Build packages\033[0m\n"
	npm run build

install:
	@printf "\033[0;32m>>> Installing dependencies\033[0m\n"
	npm -r install

lint:
	@printf "\033[0;32m>>> Lint code\033[0m\n"
	npm run lint

lint.fix:
	@printf "\033[0;32m>>> Lint code\033[0m\n"
	npm run lint:fix

outdated:
	@printf "\033[0;32m>>> Check for outdated dependencies\033[0m\n"
	npm -r outdated

publish:
	@printf "\033[0;32m>>> Publish packages033[0m\n"
	shipjs trigger

release:
	@printf "\033[0;32m>>> Prepare packages for release033[0m\n"
	shipjs prepare

sort-package:
	@printf "\033[0;32m>>> Format package.json\033[0m\n"
	npm sort-package

typecheck:
	@printf "\033[0;32m>>> Running Type check\033[0m\n"
	npm typecheck
