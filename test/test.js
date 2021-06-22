const UProfile = require(`${__dirname}/../index`)(true)

class TestController {
	constructor() {}

	async index(req, res) {
		let uid = req.params.uid

		try {
			const response = await UProfile.info(uid, { ignore_404_error: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async skills(req, res) {
		let uid = req.params.uid

		try {
			const response = await UProfile.skills(uid, { ignore_404_error: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async team(req, res) {
		let uid = req.params.uid

		try {
			const response = await UProfile.team(uid, { ignore_404_error: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async all(req, res) {
		let uid = req.params.uid

		try {
			const response = await UProfile.all(uid, { ignore_404_error: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async users(req, res) {
		let uids = req.body

		try {
			const response = await UProfile.info(uids, { headers: false, ignore_404_error: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}
}

module.exports = TestController;