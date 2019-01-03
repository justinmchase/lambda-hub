FROM node:8.10

WORKDIR /var
COPY package.json package-lock.json /var/
RUN npm i

WORKDIR /var/app
COPY src/app/*.json /var/app/
RUN npm i

COPY src/app/ /var/app/

EXPOSE 2354
CMD [ "./run.sh" ]
