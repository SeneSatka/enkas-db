## Imports

```js
import { DB, ArrayDB, useArrayDb, useDb } from "@enkas/db";
// or
const { DB, ArrayDB, useArrayDb, useDb } = require("@enkas/db");
```

## Usage

```js
const db = new DB();
db.set("users.111", { name: "SeneSatka", id: "111" });
/**
{"users":{"111":{"name":"SeneSatka","id":"111"}}}
 */
db.push("users.111.inventory", { name: "Sword", damage: 10, level: 1 });
/**....
"inventory":[{ name: "Sword", damage: 10, level: 1 }]
....*/
db.push("users.111.inventory", { name: "bow", damage: 20, level: 4 });
/**....
"inventory":[
{ name: "Sword", damage: 10, level: 1 },
{ name: "bow", damage: 20, level: 4 }
]
....*/
db.pull("users.111.inventory", { name: "Sword", damage: 10, level: 1 });
/**....
"inventory":[
{ name: "bow", damage: 20, level: 4 }
]
....*/
db.delete("users.111.inventory");

db.all();
// [ { id: 'users', data: { '111':{"name":"SeneSatka","id":"111" }}} ]
db.deleteAll();
//{}
```

## Emitter

```js
/** database.json
 {
    "name":"SeneSatka"
 }
 */
db.on("set", (data) => {
  console.log(data);
});
db.set("name", "Testt");
/** set listener output
 { key: 'name', oldValue: 'SeneSatka', newValue: 'Testt' }
  */
```
