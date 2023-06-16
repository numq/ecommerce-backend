package search

import (
	pb "search/generated"
)

type Mapper interface {
	MessageToEntity(message *pb.SearchItem) *Item
	EntityToMessage(entity *Item) *pb.SearchItem
}

type MapperImpl struct {
}

func NewMapper() Mapper {
	return &MapperImpl{}
}

func (m *MapperImpl) MessageToEntity(message *pb.SearchItem) *Item {
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

func (m *MapperImpl) EntityToMessage(entity *Item) *pb.SearchItem {
	return &pb.SearchItem{
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
