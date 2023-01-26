package amqp

import (
	"github.com/rabbitmq/amqp091-go"
	"log"
)

type Consumer[T any] struct {
	Channel  *amqp091.Channel
	Name     string
	Callback func(T)
}

func NewConsumer[T any](channel *amqp091.Channel, name string) Consumer[T] {
	return Consumer[T]{Channel: channel, Name: name}
}

func (c Consumer[T]) Start(callback func(bytes []byte)) {
	_, err := c.Channel.QueueDeclare(c.Name, false, false, false, false, nil)
	if err != nil {
		log.Println(err)
	}
	addedQueue, err := c.Channel.Consume(c.Name, c.Name, false, true, false, false, nil)
	if err != nil {
		log.Println(err)
	}
	go func() {
		for added := range addedQueue {
			callback(added.Body)
		}
	}()
}

func (c Consumer[T]) Stop() {
	err := c.Channel.Cancel(c.Name, false)
	if err != nil {
		log.Println(err)
	}
}
