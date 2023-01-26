package search

type Item struct {
	Id          string
	Sku         string
	Name        string
	Description string
	ImageBytes  []byte
	Price       float32
	Discount    float32
	Weight      float32
	Quantity    int32
	Tags        []string
	CreatedAt   int64
	UpdatedAt   int64
}
