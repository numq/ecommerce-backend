package confirmation

import (
	"fmt"
)

var (
	NotYetTime            = fmt.Errorf("not yet time")
	WrongConfirmationCode = fmt.Errorf("wrong confirmation code")
)
