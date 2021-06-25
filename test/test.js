const UProfile = require(`${__dirname}/../index`)(true)

class TestController {
	constructor() {}

	async index(req, res) {
		let uid = req.params.uid
		let headers = req.query.headers == 'true'

		try {
			const response = await UProfile.info(uid, { headers, break_on_404: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async skills(req, res) {
		let uid = req.params.uid
		let headers = req.query.headers == 'true'

		try {
			const response = await UProfile.skills(uid, { headers, break_on_404: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async team(req, res) {
		let uid = req.params.uid
		let headers = req.query.headers == 'true'

		try {
			const response = await UProfile.team(uid, { headers, break_on_404: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async all(req, res) {
		let uid = req.params.uid
		let headers = req.query.headers == 'true'

		try {
			const response = await UProfile.all(uid, { headers, break_on_404: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async users(req, res) {
		let uids = req.body
		let headers = req.query.headers == 'true'

		try {
			const response = await UProfile.info(uids, { headers, break_on_404: false })
			res.status(200).json(response)
		} catch (err) {
			res.status(500).json(err)
		}
	}
}

module.exports = TestController;