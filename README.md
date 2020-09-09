# Express API Logger

## Install
``` javascript
npm install -D @overnightjs/logger moment
```

## Example
```javascript
import {Logger, Log} from 'logger'

class ClassA {
	@Logger
	methodA(req: Request, res: Response) {
		Log.Info('information log') // stored in Info directory
		Log.Error('error log')      // stored in Error directory
	} 
}
```
