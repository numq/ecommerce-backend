package search

import (
	pb "search/generated"
)

type Mapper interface {
	MessageToEntity(message *pb.Item) *Item
	EntityToMessage(entity *Item) *pb.Item
}

type MapperImpl struct {
}

func NewMapper() Mapper {
	return &MapperImpl{}
}

func (m *MapperImpl) MessageToEntity(message *pb.Item) *Item {
	return &Item{
		Id:          message.GetId(),
		Sku:         message.GetSku(),
		Name:        message.GetName(),
		Description: message.GetDescription(),
		ImageBytes:  message.GetImageBytes(),
		Price:       message.GetPrice(),
		Discount:    message.GetDiscount(),
		Weight:      message.GetWeight(),
		Quantity:    message.GetQuantity(),
		Tags:        message.GetTags(),
		CreatedAt:   message.GetCreatedAt(),
		UpdatedAt:   message.GetUpdatedAt(),
	}
}

func (m *MapperImpl) EntityToMessage(entity *Item) *pb.Item {
	return &pb.Item{
		Id:          entity.Id,
		Sku:         entity.Sku,
		Name:        entity.Name,
		Description: entity.Description,
		ImageBytes:  entity.ImageBytes,
		Price:       entity.Price,
		Discount:    entity.Discount,
		Weight:      entity.Weight,
		Quantity:    entity.Quantity,
		Tags:        entity.Tags,
		CreatedAt:   entity.CreatedAt,
		UpdatedAt:   entity.UpdatedAt,
	}
}
