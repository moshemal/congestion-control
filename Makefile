test:
	npm test

publish:
	git push -u --tags origin master
	npm publish

update:
	npm update

npm-patch:
	npm version patch

npm-minor:
	npm version minor

npm-major:
	npm version major

patch: test npm-patch publish
minor: test npm-minor publish
major: test npm-major publish

.PHONY: test publish update npm-patch npm-minor npm-major patch minor major