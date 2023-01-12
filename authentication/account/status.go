package account

type Status int

const (
	PendingConfirmation Status = iota
	Active
	Suspended
)

func (s Status) String() string {
	return [...]string{"PENDING_CONFIRMATION", "ACTIVE", "SUSPENDED"}[s]
}
