# Makefile for n0dejs-api

HUB_ACCOUNT := dockerian
DOCKER_IMAG := n0dejs-api
DOCKER_TAGS := $(HUB_ACCOUNT)/$(DOCKER_IMAG)
# Set current dir name from $(shell pwd), $(PWD), or $(CURDIR) in GNU Makefile
MAKEFILE := $(abspath $(lastword $(MAKEFILE_LIST)))
CWD := $(notdir $(patsubst %/,%,$(dir $(MAKEFILE))))

.PHONY: build check clean cmd install dev run run-mon run-watch start test
default: cmd

all: clean-all build run

clean:
	rm -rf .dev/*
	rm -rf docker_build.log
	rm -rf dist/*

clean-docker:
ifeq ("$(wildcard /.dockerenv)","")
	# make in a docker host environment
	docker rm -f $(docker ps -a|grep ${DOCKER_IMAG}|awk '{print $1}') 2>/dev/null || true
	docker rmi -f $(docker images -a|grep ${DOCKER_TAGS} 2>&1|awk '{print $1}') 2>/dev/null || true
endif

clean-all: clean-docker clean
	rm -rf .dev
	rm -rf node_modules
	rm -rf npm-*.log.*
	rm -rf *.log

check:
ifneq ("$(wildcard /.dockerenv)","")
	@echo "Cannot make inside docker container. Use 'npm run' script instead."
	exit 1
endif

docker_build.log: Dockerfile
ifeq ("$(wildcard /.dockerenv)","")
	# make in a docker host environment
	@echo ""
	@echo `date +%Y-%m-%d:%H:%M:%S` "Building '$(DOCKER_TAGS)'"
	@echo "------------------------------------------------------------------------"
	docker build -t $(DOCKER_TAGS) . | tee docker_build.log
	@echo "------------------------------------------------------------------------"
	@echo ""
	docker images --all | grep -e 'REPOSITORY' -e '$(DOCKER_TAGS)'
	@echo "........................................................................"
	@echo "DONE: {docker build}"
	@echo ""
endif

build: docker_build.log install
	./run.sh "npm run build"
	@echo "DONE: [$@]"

build-mon build-watch:
	./run.sh "npm run build:mon"
	@echo "DONE: [$@]"

cmd: docker_build.log
ifeq ("$(wildcard /.dockerenv)","")
	@echo ""
	@echo `date +%Y-%m-%d:%H:%M:%S` "Start bash in container '$(DOCKER_IMAG)'"
	./run.sh "/bin/bash"
else
	@echo "env in the container:"
	@echo "------------------------------------------------------------------------"
	@env | sort
	@echo "------------------------------------------------------------------------"
endif
	@echo "DONE: [$@]"

install:
	./run.sh "npm install"
	@echo "DONE: [$@]"

lint:
	./run.sh "npm run pretest"
	@echo "DONE: [$@]"

run dev:
	./run.sh "npm run dev $(ARGS)"
	@echo "DONE: [$@]"

dev-mon run-mon dev-watch run-watch:
	./run.sh "npm run dev:mon"
	@echo "DONE: [$@]"

mon: build-mon dev-mon

stop: stop-build-mon stop-dev-mon stat

stop-build-mon stop-build-watch:
	./run.sh "npm run build:mon:stop"
	@echo "DONE: [$@]"

stop-dev-mon stop-dev-watch:
	./run.sh "npm run dev:mon:stop"
	@echo "DONE: [$@]"

start:
	./run.sh "npm run start $(ARGS)"
	@echo "DONE: [$@]"

start-mon:
	./run.sh "npm run start:mon"
	@echo "DONE: [$@]"

stat:
	@echo ""
	netstat -antp tcp
	@echo "............................................................"
	ps -aef
	@echo "............................................................"
	@echo "DONE: [$@]"

test:
	./run.sh "npm test"
	@echo "DONE: [$@]"
