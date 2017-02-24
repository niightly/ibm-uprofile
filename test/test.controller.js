const UProfile = require(`${__dirname}/../index`)()

class TestController {
	constructor() {}

	index(req, res) {
		let uid = req.params.uid

		UProfile(uid)
		.then(result => res.status(200).json(result))
		.catch(err => res.status(500).json(err))
	}
}

module.exports = TestController;