package elastic

import (
	"github.com/elastic/elastic-transport-go/v8/elastictransport"
	"github.com/elastic/go-elasticsearch/v8"
	"log"
	"os"
)

type Elastic struct {
	Client *elasticsearch.Client
}

func NewElastic(addresses []string) Elastic {
	client, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: addresses,
		Logger:    &elastictransport.TextLogger{Output: os.Stdout},
	})
	if err != nil {
		log.Fatal(err)
	}
	return Elastic{Client: client}
}

func (e *Elastic) CreateIndex(name string) error {
	res, err := e.Client.Indices.Exists([]string{name})
	if err != nil {
		return err
	}
	if res.StatusCode == 200 {
		return nil
	}
	if _, err := e.Client.Indices.Create(name); err != nil {
		return err
	}
	return nil
}
