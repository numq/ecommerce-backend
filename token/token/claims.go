package token

type Claims struct {
	Payload        string
	IssuedAt       int64
	ExpirationTime int64
}
