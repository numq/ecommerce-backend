package account

type Role int

const (
	Root Role = iota
	Staff
	Courier
	Customer
)

func (r Role) String() string {
	return [...]string{"ROOT", "STAFF", "COURIER", "CUSTOMER"}[r]
}
