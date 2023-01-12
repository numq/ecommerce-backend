package account

type Account struct {
	Id          string
	PhoneNumber string
	Role        Role
	Status      Status
	CreatedAt   int64
}
