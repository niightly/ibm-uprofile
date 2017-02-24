const UProfile = require(`${__dirname}/../index`)({
  uid: "userId",
  name: "nameDisplay",
  country: "address.business.country",
  email: "mail.4"
})

class SamplesController {
	constructor() {}

	index(req, res) {
		let uid = req.params.uid

		UProfile(uid)
		.then(result => res.status(200).json(result))
		.catch(err => res.status(500).json(err))
	}

	getCN(req, res) {
		let uid = req.params.uid

		UProfile(uid, {name: "cn.1"})
		.then(result => res.status(200).json(result))
		.catch(err => res.status(500).json(err))
	}

	getDefault(req, res) {
		let uid = req.params.uid

		UProfile(uid, "default")
		.then(result => res.status(200).json(result))
		.catch(err => res.status(500).json(err))
	}
}

module.exports = SamplesController