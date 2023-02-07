FROM node:alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY tsconfig*.json .
COPY .env .
COPY ./src ./src
RUN apk update && apk add protoc
CMD ["rm", "-r", "src/generated"]
CMD ["mkdir", "-p", "src/generated"]
CMD ["protoc", "--plugin=./node_modules/.bin/protoc-gen-ts_proto", "--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true", "--ts_proto_out=./src/generated", "-I=proto proto/*.proto"]
RUN npm run build
RUN npm prune --production

FROM node:alpine
COPY --from=0 app/.env .
COPY --from=0 app/build .
COPY --from=0 app/node_modules /node_modules
CMD ["node", "index.js"]