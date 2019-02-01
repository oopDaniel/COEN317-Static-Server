SHELL := /bin/bash
NODE_PATH = $(shell ./getNode) # requires root permission
PATH := $(NODE_PATH):$(shell echo $$PATH)

all:
	make installNode build

build:
	@echo Installing pkg...
	## pkg only supports global install
	npm i -g pkg
	@echo Building executable...
	pkg -t linux buildExec.js
	mv buildExec server
	@echo Done!

installNode:
	@echo Installing NodeJS...
	chmod +x getNode
	node -v
	npm -v

.PHONY: installNode build all