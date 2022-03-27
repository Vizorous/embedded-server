var mysql = require("mysql2/promise");

async function connection(sql, ...params) {
	const con = await mysql.createConnection({
		host: "localhost",
		user: "user",
		password: "Password123",
		database: "test",
	});
	const [rows, fields] = await con.execute(sql, params);
	return [rows, fields];
}

async function getURL() {
	const [rows, fields] = await connection("SELECT * FROM `server`");
	const respObj = rows[0];
	console.log(respObj);
	return respObj;
}
getURL();
const axiosConfig = (status, lon, lat, direction) => ({
	method: "post",
	url: "http://192.168.1.2",
	data: {
		status: status,

		lon: lon,
		lat: lat,
		direction: direction,
	},
});

module.exports = { connection, axiosConfig };
