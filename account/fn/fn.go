package fn

func Map[T any, R any](in []*T, f func(*T) *R) (out []*R) {
	for _, i := range in {
		out = append(out, f(i))
	}
	return
}
