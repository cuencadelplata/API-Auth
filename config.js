var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'rootapi',
  password : 'rootuser',
  database : 'chatucp_test'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected, port 3306");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection;
