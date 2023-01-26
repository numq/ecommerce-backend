package amqp

import (
	"errors"
	"fmt"
	mq "github.com/rabbitmq/amqp091-go"
	"log"
)

type Queue struct {
	connection *mq.Connection
	channels   map[string]*mq.Channel
}

func NewClient(address string) Queue {
	connection, err := mq.Dial(address)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Connected to message queue: %s\n", address)
	return Queue{
		connection: connection,
		channels:   make(map[string]*mq.Channel),
	}
}

func (m Queue) Disconnect() {
	if err := m.connection.Close(); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Disconnected from message queue: %s\n", m.connection.RemoteAddr())
}

func (m Queue) OpenChannel(name string) {
	channel, err := m.connection.Channel()
	if err != nil {
		log.Fatal(err)
	}
	m.channels[name] = channel
}

func (m Queue) CloseChannel(name string) {
	if err := m.channels[name].Close(); err != nil {
		log.Fatal(err)
	}
	delete(m.channels, name)
}

func (m Queue) UseChannel(name string) (*mq.Channel, error) {
	if channel := m.channels[name]; channel != nil {
		return channel, nil
	}
	return nil, errors.New("undefined channel")
}
