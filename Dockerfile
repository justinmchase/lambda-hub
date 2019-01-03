FROM node:8.10

WORKDIR /var/app
COPY src/app/*.json /var/app/
RUN npm i

COPY src/app/ /var/app/

EXPOSE 2354
CMD [ "./run.sh" ]
