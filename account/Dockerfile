FROM golang:alpine
WORKDIR /build
COPY . .
RUN apk update && apk add protoc
CMD ["rm","-r","generated"]
CMD ["mkdir","-p","generated"]
CMD ["protoc", "--go_out=generated", "--go-grpc_out=generated", "--proto_path=proto", "proto/*.proto"]
RUN go get -d -v ./...
RUN go build -o target ./main

FROM alpine:latest
COPY --from=0 build/config/prod.env .
COPY --from=0 build/target .
CMD ["./target","-production"]