const request = require('request')
var self

class UProfile {
	constructor(){
		this.URL = 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/docs/instances/master?userId='
		this.queryURL = 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/search/user?searchConfig=optimized_search&timeout=20000&threshold=0&rows=1&query='
		this.headers = ['modifiedDate', 'userId', 'typeId', 'active']
		this.template = undefined
		this.errorMsg = ""
		this.debug = false
		self = this //to keep reference of the instantiated class and still dont need to call methods
	}

	setDefault(userTemplate, debug = false){
		if (debug) { this.debug = debug }

		if (!this._isValid(userTemplate)) {
			let warningMsg = '\n' + '#'.repeat(23) + ' WARNING ' + '#'.repeat(23) + '\n'
			console.log('#'.repeat(55) + warningMsg)
			console.log(this.errorMsg);
			console.log(warningMsg + '#'.repeat(55) + '\n')
			throw new Error(this.errorMsg)
		}
		this.template = userTemplate
	}

	get(userUID, userTemplate) {
		return new Promise((resolve,reject) => {
			try {
				let lookup = (!userTemplate) ? self.template : userTemplate
				if (!self._isValid(lookup)) { return reject(self.errorMsg) }

				let tmpURL = (userUID.includes("@")) ? self.queryURL : self.URL

				if (self.debug) { console.log('QUERY', tmpURL ) }

				request.get({url:tmpURL + userUID, json: true}, function(err, response, body) {
					if (self.debug) { 
						console.log('Request executed')
						console.log('STATUS: ', response.statusCode)
					}

					if (err || !(response && response.statusCode == 200)) {
						if (self.debug) {
							console.log('ERROR: ', response.statusCode)
							console.log(err)
							console.log('------------------')
						}

						if (response && response.statusCode) {
							return reject({ code: response.statusCode, name: "ServerError", message: "REQUEST_ERROR", stack: err })
						} else {
							let message = "REQUEST_ERROR"
							if (err.code === "ENOTFOUND") { message = "NOT_IN_THE_VPN" }
							return reject({ code: 500, name: "ServerError", message: message, stack: err })
						}
					} else if (!body || !body.content || !body.content.identity_info) { 
						if (self.debug) { console.log('ERROR BODY') }
						return reject({ code: 404, name: "ServerError", message: "ENTRY_NOT_FOUND", stack: JSON.stringify(body) }) }

					let user = {}
					if (lookup && typeof lookup !== "string") {
						let uContent = self._getByStringKey(body, 'content.identity_info')
						delete body.content
						let uHeader = body

						uContent.nameDisplay = (!uContent.nameDisplay) ? uContent.nameFull : uContent.nameDisplay

						for (let property in lookup) {
							if (self.headers.indexOf(lookup[property]) > 0) {
								user[property] = self._getByStringKey(uHeader, lookup[property])
							} else {
								user[property] = self._getByStringKey(uContent, lookup[property])
							}
						}

						if (self.debug) { console.log('Success') }
						resolve(user)
					} else {

						if (self.debug) { console.log('Success, but lookup is string') }
						resolve(body)
					}
				})
			} catch (e) {
				reject({
					code: 500,
					name: "Unknown",
					message: "SOMENTHING_WENT_WRONG",
					stack: e.stack 
				})
			}
		})
	}

	_getByStringKey(obj, key) {
		let array = key.split('.');
		for (let property of array) {

			if (property in obj) { obj = obj[property] }
			else { return; }
		}

		return obj;
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
const instance = new UProfile()
function instantiate(attributes, debug) {
  instance.setDefault(attributes, debug)
  return instance.get
}

module.exports = instantiate