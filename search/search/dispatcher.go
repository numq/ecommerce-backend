package search

import (
	"context"
	"encoding/json"
	"log"
	"search/amqp"
)

type Dispatcher struct {
	ctx     context.Context
	done    chan error
	useCase UseCase
}

func NewDispatcher(useCase UseCase) Dispatcher {
	return Dispatcher{context.Background(), make(chan error), useCase}
}

func (d *Dispatcher) Insert(consumer amqp.Consumer[Item]) (err error) {
	consumer.Start(func(bytes []byte) {
		var item = Item{}
		if err := json.Unmarshal(bytes, &item); err != nil {
			log.Println(err)
			return
		}
		id, err := d.useCase.Insert(d.ctx, item)
		if err != nil {
			log.Println(err)
			return
		}
		log.Printf("Document with id %s was successfully inserted", *id)
	})
	return nil
}

func (d *Dispatcher) Update(consumer amqp.Consumer[Item]) (err error) {
	consumer.Start(func(bytes []byte) {
		var item = Item{}
		if err := json.Unmarshal(bytes, &item); err != nil {
			log.Println(err)
			return
		}
		id, err := d.useCase.Insert(d.ctx, item)
		if err != nil {
			log.Println(err)
			return
		}
		log.Printf("Document with id %s was successfully updated", *id)
	})
	return nil
}

func (d *Dispatcher) Remove(consumer amqp.Consumer[Item]) (err error) {
	consumer.Start(func(bytes []byte) {
		var item = Item{}
		if err := json.Unmarshal(bytes, &item); err != nil {
			log.Println(err)
			return
		}
		id, err := d.useCase.Insert(d.ctx, item)
		if err != nil {
			log.Println(err)
			return
		}
		log.Printf("Document with id %s was successfully removed", *id)
	})
	return nil
}
