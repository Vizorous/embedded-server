var express = require("express");
const { connection, axiosConfig } = require("../features/common/connection");
var router = express.Router();
const axios = require("axios");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/", async function (req, res, next) {
	const { route_id, stop_id, activation_type, status } = req.body;
	let sql = "";
	if (activation_type === "train") {
		sql =
			"UPDATE `route_stop_table` SET `train_status` = ? WHERE `route_stop_table`.`route_id` = ? AND `route_stop_table`.`stop_id` = ?";
	} else {
		sql =
			"UPDATE `route_stop_table` SET `relay_status` = ? WHERE `route_stop_table`.`route_id` = ? AND `route_stop_table`.`stop_id` = ?";
	}
	try {
		const setStatusThingy = await connection(sql, status, route_id, stop_id);
		if (status !== 1) {
			const response = await axios(await axiosConfig(0));
			console.log(response.data);
			return res.sendStatus(200);
		}
		const [rows, fields] = await connection(
			"SELECT `lon`,`lat`,`route_id`,`stop_id` from `route_stop_table`  WHERE `route_stop_table`.`route_id` = ? AND `route_stop_table`.`stop_id` = ?",
			route_id,
			stop_id + 1
		);
		if (rows[0] === undefined) {
			const [secondRow, secondField] = await connection(
				"SELECT `lon`,`lat`,`route_id`,`stop_id` from `route_stop_table`  WHERE `route_stop_table`.`route_id` = ? AND `route_stop_table`.`stop_id` = ?",
				1000,
				1000
			);
			const respObj = secondRow[0];
			return res.json(respObj);
		}
		const [secondRow, secondField] = await connection(
			"SELECT `lon`,`lat`,`direction` from `route_stop_table`  WHERE `route_stop_table`.`route_id` = ? AND `route_stop_table`.`stop_id` = ?",
			route_id,
			stop_id
		);
		const response = await axios(await axiosConfig(1, secondRow[0].lon, secondRow[0].lat, secondRow[0].direction));
		console.log(response.data);
		const respObj = rows[0];
		return res.json(respObj);
	} catch (e) {
		console.log(e);
		return res.sendStatus(500);
	}
});
module.exports = router;
