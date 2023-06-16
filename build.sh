#!/bin/bash

tsServices=("profile" "category" "catalog" "cart" "promo" "delivery" "order")
goServices=("authentication" "search")
authInternalServices=("account" "confirmation" "token")
gatewayServices=("authentication" "category" "catalog" "cart" "order" "delivery" "profile" "promo" "search")

function cleanup() {
  folderPath="$1/generated"
  echo "$folderPath"
  if [ -d "$folderPath" ]; then
    rm -r "$folderPath"
  fi
  mkdir -p "$folderPath"
}

function generateTS() {
  if [ -d "$1" ]; then
    cd "$1" || return
    npm run protoc
    cd ..
  fi
}

function generateGo() {
  path="$1/generated"
  protoc --go_out="$path" --go-grpc_out="$path" --proto_path=proto "$2.proto"
}

# generate code for TS services
for service in "${tsServices[@]}"; do
  generateTS "$service" "$service"
  echo "generated proto for TS service: $service"
done

# generate code for Go services
for service in "${goServices[@]}"; do
  cleanup "$service"
  if [ "$service" == "authentication" ]; then
    # generate code for authentication
    for innerService in "${authInternalServices[@]}"; do
      generateGo "$service" "$innerService"
      echo "generated proto for authentication: $innerService"
    done
  fi
  generateGo "$service" "$service"
  echo "generated proto for Go service: $service"
done

# generate code for gateway
cleanup gateway
for service in "${gatewayServices[@]}"; do
  generateGo gateway "$service"
  echo "generated proto for gateway: $service"
done

sleep .5
