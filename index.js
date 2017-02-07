const request = require('request')
const URL = 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/docs/instances/master?userId='
var template = undefined
var errorMsg = ""
const headers = ['modifiedDate', 'userId', 'typeId', 'active']

Object.getByStringKey = function(obj, key) {
    let array = key.split('.');
    for (let property of array) {

    	if (property in obj) { obj = obj[property] }
    	else { return; }
    }

    return obj;
}

Object.isValid = function(obj) {
	if (!obj) { return true }

	console.log(typeof obj === "string", obj);
	if (typeof obj === "string" && obj.toLowerCase()==="default") { return true }
	else if (typeof obj !== 'object' || Array.isArray(obj)) { 
		errorMsg = { 
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
			errorMsg = { 
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

class UProfile {
	constructor(){}

	static setDefault(userTemplate){
		if (!Object.isValid(userTemplate)) {
			let warningMsg = '\n' + '#'.repeat(23) + ' WARNING ' + '#'.repeat(23) + '\n'
			console.log('#'.repeat(55) + warningMsg)
			console.log(errorMsg);
			console.log(warningMsg + '#'.repeat(55) + '\n')
		}
		template = userTemplate
	}

	static get(userUID, userTemplate) {
		return new Promise((resolve,reject) => {
			try {
				let lookup = (!userTemplate) ? template : userTemplate
				if (!Object.isValid(lookup)) { return reject(errorMsg) }

				request.get({url: URL + userUID, json: true}, function(err, response, body) {
					if (err || !(response && response.statusCode == 200)) { 
						return reject({ code: response.statusCode, name: "ServerError", message: "REQUEST_ERROR", stack: err }) }
					else if (!body || !body.content || !body.content.identity_info) { 
						return reject({ code: 404, name: "ServerError", message: "ENTRY_NOT_FOUND", stack: body }) }

					let user = {}
					if (lookup && typeof lookup !== "string") {
						let uContent = Object.getByStringKey(body, 'content.identity_info')
						delete body.content
						let uHeader = body

						uContent.nameDisplay = (!uContent.nameDisplay) ? uContent.nameFull : uContent.nameDisplay

						for (let property in lookup) {
							if (headers.indexOf(lookup[property]) > 0) {
								user[property] = Object.getByStringKey(uHeader, lookup[property])
							} else {
								user[property] = Object.getByStringKey(uContent, lookup[property])
							}
						}

						resolve(user)
					} else {
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
}

module.exports = UProfile