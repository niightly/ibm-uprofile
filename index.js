const axios = require('axios')
var self

class UProfile {
	constructor(debug = false) {
		this.urls = {
			team: 'https://unified-profile-api.us-south-k8s.intranet.ibm.com/v3/profiles/{USER}/teamResolved',
			extended: 'https://unified-profile-api.us-south-k8s.intranet.ibm.com/v3/profiles/{USER}/profile_extended',
			profile: 'https://unified-profile-api.us-south-k8s.intranet.ibm.com/v3/profiles/{USER}/profile',
			profiles: 'https://unified-profile-api.us-south-k8s.intranet.ibm.com/v3/profiles/{USER}',
			all: 'https://unified-profile-api.us-south-k8s.intranet.ibm.com/v3/profiles/{USER}/profile_combined',
		}

		this.options = {}
		this.debug = debug
	}

	setDebug(debug) {
		this.debug = debug
		if (!this.debug) { console.log('BLUEPAGES UPROFILE - ENABLED'); }
	}

	setOptions(options) {
		let default_options = { headers: false, break_on_404: false }
		if (Object.keys(options).length === 0) { return }
		this.options = { ...default_options, ...options }
	}

	_uri(type, query) {
		if (type === 'profiles') {
			if (!Array.isArray(query)) { query = [query] }
			query = query.join(',')
		}

		return this.urls[type].replace('{USER}', query)
	}

	_display_template_error() {
		if (!this.debug) { return }

		let warningMsg = '\n' + '#'.repeat(23) + ' WARNING ' + '#'.repeat(23) + '\n'

		console.log('#'.repeat(55) + warningMsg)
		console.log(this.errorMsg);
		console.log(warningMsg + '#'.repeat(55) + '\n')
	}

	_display_response_error(type, users, response) {
		if (!this.debug) { return }

		'\n' + '#'.repeat(23) + ' REQUEST DEBUG ' + '#'.repeat(23) + '\n'

		console.log('QUERY', this._uri(type, users))
		console.log('STATUS: ', response.status)
		console.log('STATUSTEXT: ', response.statusText)
		if (response.status !== 200) { console.log('BODY: ', response.data) }

		'\n' + '#'.repeat(23) + ' REQUEST DEBUG ' + '#'.repeat(23) + '\n'
	}

	_response(users, response) {
		if (users.includes(',')) { return response || [] }
		return response
	}

	async team(user, options = {}) {
		if (Array.isArray(user)) { throw new Error('The user cannot be an array, it can only have 1 user per query') }
		if (user.includes("@")) { throw new Error('The user must be an employee serial number') }
		this.setOptions(options)

		try {
			const body = await this._fetch('team', user)

			if (this.options.headers) { return body }
			return body.content || { error: `User not found for ${user}` }
		} catch (err) {
			throw err
		}
	}

	async skills(user, options = {}) {
		if (Array.isArray(user)) { throw new Error('The user cannot be an array, it can only have 1 user per query') }
		if (user.includes("@")) { throw new Error('The user must be an employee serial number') }
		this.setOptions(options)

		try {
			const body = await this._fetch('extended', user)

			if (this.options.headers) { return body }
			return body.content || { error: `User not found for ${user}` }
		} catch (err) {
			throw err
		}
	}

	async all(user, options = {}) {
		if (Array.isArray(user)) { throw new Error('The user cannot be an array, it can only have 1 user per query') }
		if (user.includes("@")) { throw new Error('The user must be an employee serial number') }
		this.setOptions(options)

		try {
			const body = await this._fetch('all', user)

			if (this.options.headers) { return body }
			return body.content || { error: `User not found for ${user}` }
		} catch (err) {
			throw err
		}
	}

	async info(user, options = {}) {
		this.setOptions(options)

		try {
			let body
			if (this.debug) { console.log('QUERY TOTAL (chars):', encodeURI(this._uri('profile', user)).length) }
			if (Array.isArray(user) && encodeURI(this._uri('profile', user)).length > 6000) {
				body = await this._multi_fetch(user)
			} else {
				body = await this._fetch('profile', user)
			}

			return this._transpile_body(this.options.headers, body, user)
		} catch (err) {
			throw err
		}
	}

	_chunks(users) {
		let chunks = [[]]
		users.forEach((u, i) => {
			chunks[chunks.length-1].push([u])
			if (encodeURI(this._uri('profile', chunks[chunks.length-1])).length > 5000) {
				chunks.push([])
			}
		});

		return chunks
	}

	_transpile_body(headers, body, user) {
		if (!Array.isArray(user)) { return (headers) ? body : body.content }

		if (Array.isArray(body)) {
			return body.reduce((array, item) => this.retrieve_body_profiles(headers, item.profiles, array), [])
		} else {
			return this.retrieve_body_profiles(headers, body.profiles, [])
		}
	}

	retrieve_body_profiles(headers, profiles, array) {
		if (!Array.isArray(profiles)) {
			const value = (headers) ? profiles : profiles.content
			array.push(value)
		} else {
			profiles.map(p => (headers) ? array.push(p) : array.push(p.content))
		}

		return array
	}

	async _multi_fetch(users) {
		try {
			let response = await Promise.allSettled(this._chunks(users).map((chunk, i) => {
				if (this.debug) { console.log(`CHUNK ${i + 1} TOTAL (chars):`, encodeURI(this._uri('profiles', chunk)).length) }
				return axios.get(this._uri('profiles', chunk), { validateStatus: (status) => status < 500 })
			}))

			response = response.map(r => r.value.data)
			response = [].concat.apply([], response)

			return this._response(users, response)
		} catch (err) {
			console.log(err);
			throw err
		}
	}

	async _fetch(type, users) {
		try {
			const response = await axios.get(this._uri(type, users), { validateStatus: (status) => (this.options.break_on_404) ? false : status < 500 })
			this._display_response_error(type, users, response)

			if (response.status === 404 && this.options.break_on_404) { return }
			return this._response(users, response.data)
		} catch (err) {
			throw err
		}
	}

	_isValid(obj) {
		if (!obj) { return true }

		if (typeof obj === "string" && obj.toLowerCase()==="default") { return true }
		else if (typeof obj !== 'object' || Array.isArray(obj)) {
			this.errorMsg = {
				code: 400,
				name: "InvalidTemplate",
				message: "INVALID_TEMPLATE_TYPE",
				stack: (Array.isArray(obj)) ? "array" : typeof obj
			}

			return false
		}

		let isInvalid = new RegExp(/[^a-zA-Z0-9\.]/)
		for (let key in obj) {
			if (isInvalid.test(obj[key])) {
				this.errorMsg = {
					code: 400,
					name: "InvalidTemplate",
					message: "INVALID_PROPERTY_" + key.toUpperCase(),
					stack: "Please use only Alphanumeric characters or dots. Invalid entry: " + obj[key]
				}

				return false
			}
		}
		return true
	}
}

/**
 * Allow to return the module instantiated without using new when require the module.
 */


function instantiate(attributes, debug = false) {
  // instance.setDefault(attributes, debug)
	instance.setDebug(debug)
  return instance.get
}

module.exports = (debug = false) => new UProfile(debug)