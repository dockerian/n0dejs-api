# NodeJS with ES6


## Basic Usage

### Install Docker

See
[Install Docker Platform](https://www.docker.com/products/docker)
or
[Docker Toolbox](https://www.docker.com/products/docker-toolbox)


### Build docker image
```
make build
```

<a name="cmd"></a>
### Start command shell inside Docker container
```
make  # or `make cmd`
```

### Run API server in Docker container
```
make run  # or `./run.sh`
```

or specifying customized port `${PORT}`

```
PORT=9999 make run
```

### Run test in Docker container
```
make test
```


<br/><a name="how-to"></a>
## How to start a NodeJS project

### Build docker image and run in container

It is recommended to start a [command shell](#cmd) inside
	the docker container before running the following steps (or
	actually any command, so that there is no need to install [node](https://nodejs.org)
	on a dev box.

```
make cmd  # after that you will be in the container
```

### Init a new project

```
npm init
```

### Install dev dependencies

```
npm install --save-dev \
  babel-cli babel-preset-es2015 babel-preset-es2015-node5 babel-preset-node5 \
  chai chai-as-promised \
  eslint babelify browserify vinyl-source-stream \
  gulp gulp-eslint gulp-filter gulp-header gulp-jsbeautifier \
  gulp-mocha gulp-replace gulp-util \
  nodemon request \
  rimraf \
  mockery istanbul mocha \
  sinon-chai sinon \
```

### Install dist build dependencies

```
npm install --save \
  body-parser cookie-parser express morgan lodash \
	http-status-codes node-fetch uuid4 \
  bunyan mysql \

```

### Add any `npm run` scripts

See `package.json` for reference.


### Runtime

  - Use the following command to review monitoring/watch process and listening ports

	```
	make stat # or `netstat -antp tcp; ps -aef`
	```

  - Upon the API server running, by default port, e.g. `8888`, the endpoint will be at

	```
	http://localhost:8888
	```



<br/><a name="design"></a>
## API Server Architecture

```
[ Browser ] <===>  [ Nginx ]  <===> [ API server ]
```


<br/><a name="es6"></a>
## Learning ES6

- https://babeljs.io/docs/learn-es2015/
- https://github.com/ericdouglas/ES6-Learning
- http://exploringjs.com/es6
