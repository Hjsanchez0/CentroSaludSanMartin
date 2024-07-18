const app = require("./app");
require("./database");

app.listen(app.get('port'));
console.log(`Listening on http://192.168.18.9:${app.get('port')}/cs-san-martin`);
