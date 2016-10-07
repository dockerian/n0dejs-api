#!/usr/bin/env bash
# This script will run "make ${1:-test}" inside a Docker container
set -e
SCRIPT_FILE="${BASH_SOURCE[0]##*/}"
SCRIPT_PATH="$( cd "$( echo "${BASH_SOURCE[0]%/*}" )" && pwd )"


# main function
function main() {
  ARGS="$@"
  DOCHUB_USER="dockerian"
  DOCKER_IMAG="n0dejs-api"
  DOCKER_TAGS="${DOCHUB_USER}/${DOCKER_IMAG}"
  RESULT_GREP="$(docker images 2>&1|grep ${DOCKER_TAGS}|awk '{print $1;}')"
  # detect if running inside the container
  DOCKER_PROC="$(cat /proc/1/cgroup 2>&1|grep -e "/docker/[0-9a-z]\{64\}"|head -1)"
  # specify runtime host port, overriding directive EXPOSE port in Dockerfile
  DOCKER_PORT=${PORT:-8888}
  SOURCE_PATH="/usr/src/app"

  RUN_SCRIPTS="${ARGS}"
  CHK="${ARGS:-npm run stat}"
  OUT="$(ps -aef|grep -v 'make'|grep -v 'grep'|grep -v "${SCRIPT_FILE}")"
  EXP="babel src --watch -d .dev"

  # here the ${EXP} must match to the script in `package.json`
  case "${CHK}" in
    "npm run dev:"*) EXP=" ./.dev/index.js localhost 8888" ;;
    "npm run start:"*) EXP="node ./dist/bundle.js npm run start" ;;
  esac

  # check for 'mon' (monitor/watch) command, same as (regex)
  #   `[[ "${CHK}" != "${CHK//:mon/}" ]]`
  # or
  #   `[[ -z "${CHK##*:mon*}" ]] || [[ -z "${CHK##*:watch*}" ]]`
  #
  if [[ "${CHK}" =~ ":mon" ]] || [[ "${CHK}" =~ ":watch" ]]; then
    echo "Looking up PID [${CHK}] for '${EXP}' ..."
    PID="$(echo "${OUT}"|grep -e "${EXP}"|awk '{print $2}'|head -2)"

    if [[ "${PID}" != "" ]]; then
      echo ""
      echo `date +%Y-%m-%d:%H:%M:%S` "Stopping [${PID//$'\n'/,}] '${CHK}'"
      echo ${PID} | xargs kill -9  2>/dev/null
      rm -rf "${SCRIPT_PATH}/nohup.out"
    fi
    RUN_NOHUP="nohup"
  fi

  if [[ "${CHK}" =~ "stop" ]]; then
    exit
  fi

  cd -P "${SCRIPT_PATH}"

  if [[ -e "/.dockerenv" ]] || [[ "${DOCKER_PROC}" != "" ]]; then
    echo -e "\n"`date +%Y-%m-%d:%H:%M:%S` [${RUN_NOHUP}]
    echo "Docker container HOSTNAME='${HOSTNAME}', CMD='${CHK}'"
    if [[ "${RUN_NOHUP}" != "" ]]; then
      nohup ${CHK} &
    else
      echo "${CHK}"
      echo "--------------------------------------------------------------------"
      ${CHK}
      echo "--------------------------------------------------------------------"
    fi
    echo ""
    return
  fi

  if [[ "${RESULT_GREP}" != "${DOCKER_TAGS}" ]]; then
    echo -e "\n"
    echo `date +%Y-%m-%d:%H:%M:%S` "Building docker image '${DOCKER_TAGS}' ..."
    echo "--------------------------------------------------------------------"
    docker build -t ${DOCKER_TAGS} . | tee docker_build.log
    echo "--------------------------------------------------------------------"
  fi

  CMD="docker run -it --rm \
  --hostname ${DOCKER_IMAG} --name ${DOCKER_IMAG} \
  --expose ${DOCKER_PORT} -p ${DOCKER_PORT}:${DOCKER_PORT} \
  -v "${PWD}":"${SOURCE_PATH}" \
  -e DEBUG=${DEBUG} \
  -e PORT=${DOCKER_PORT} \
  -e VERBOSE \
  ${DOCKER_TAGS} "

  echo -e "\n"`date +%Y-%m-%d:%H:%M:%S` [${RUN_NOHUP}]
  echo "Running '${CHK}' in docker container '${DOCKER_IMAG}'"
  echo "${CMD} ${CHK}"
  if [[ "${RUN_NOHUP}" == "" ]]; then
    echo "...................................................................."
    if [[ "${RUN_SCRIPTS}" != "" ]]; then
      ${CMD} "${RUN_SCRIPTS}"
    else
      ${CMD}
    fi
    echo "...................................................................."
  else # nohup
    if [[ "${RUN_SCRIPTS}" != "" ]]; then
      nohup ${CMD} "${RUN_SCRIPTS}" &
    else
      nohup ${CMD} &
    fi
  fi
}

[[ $0 != "${BASH_SOURCE}" ]] || main "$@"
