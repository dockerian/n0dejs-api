FROM node:6.7.0

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    curl wget nano jq net-tools tree unzip zip \
 && echo "export PS1='\n\u@\h [\w] \D{%F %T} [\#]:\n\$ '" >> ~/.bashrc \
 && echo "alias ll='ls -al ' " >> ~/.bashrc \
 && echo "" >> ~/.bashrc \
 && mkdir -p /usr/src/app

WORKDIR /usr/src/app

EXPOSE 8888

ENTRYPOINT ["/bin/bash", "-c"]

CMD ["npm start"]
