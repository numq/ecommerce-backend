package token

type Claims struct {
	Id             string
	IssuedAt       int64
	ExpirationTime int64
}
