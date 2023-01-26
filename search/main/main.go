package main

import (
	"flag"
	"fmt"
	"google.golang.org/grpc"
	"log"
	"os"
	"os/exec"
	"search/amqp"
	"search/config"
	"search/elastic"
	pb "search/generated"
	"search/search"
	"search/server"
)

func main() {
	productionMode := flag.Bool("production", false, "enable production mode")
	flag.Parse()
	cfgName := func() string {
		if *productionMode {
			return "prod"
		}
		return "dev"
	}()
	cfg, err := config.LoadConfig(cfgName)
	if err != nil {
		log.Fatal(err)
	}
	if !*productionMode {
		if err := os.RemoveAll("./generated"); err != nil {
			log.Fatal(err)
		}
		if err := os.Mkdir("./generated", os.ModePerm); err != nil {
			log.Fatal(err)
		}
		if err := exec.Command("protoc", "--go_out=generated", "--go-grpc_out=generated", "--proto_path=proto", "proto/*.proto").Run(); err != nil {
			log.Fatal(err)
		}
	}

	es := elastic.NewElastic([]string{fmt.Sprintf("http://%s:%s", cfg.ElasticHostname, cfg.ElasticPort)})
	if err := es.CreateIndex("catalog"); err != nil {
		log.Println(err)
	}

	messageQueue := amqp.NewClient(fmt.Sprintf("amqp://%s:%s", cfg.AmqpHostname, cfg.AmqpPort))
	defer messageQueue.Disconnect()

	messageQueue.OpenChannel(cfg.AmqpChannelCatalog)
	defer messageQueue.CloseChannel(cfg.AmqpChannelCatalog)

	channel, err := messageQueue.UseChannel(cfg.AmqpChannelCatalog)
	if err != nil {
		log.Fatal(err)
	}

	searchRepository := search.NewRepository(es.Client)
	searchUseCase := search.NewUseCase(searchRepository)
	searchDispatcher := search.NewDispatcher(searchUseCase)

	addConsumer := amqp.NewConsumer[search.Item](channel, "add")
	if err := searchDispatcher.Insert(addConsumer); err != nil {
		log.Println(err)
	}
	defer addConsumer.Stop()
	updateConsumer := amqp.NewConsumer[search.Item](channel, "update")
	if err := searchDispatcher.Update(updateConsumer); err != nil {
		log.Println(err)
	}
	defer updateConsumer.Stop()
	deleteConsumer := amqp.NewConsumer[search.Item](channel, "delete")
	if err := searchDispatcher.Remove(deleteConsumer); err != nil {
		log.Println(err)
	}
	defer deleteConsumer.Stop()

	searchService := search.NewService(searchUseCase, search.NewMapper())
	server.Server{Address: cfg.ServerAddress}.Launch(func(server *grpc.Server) {
		pb.RegisterSearchServiceServer(server, searchService)
	})
}
