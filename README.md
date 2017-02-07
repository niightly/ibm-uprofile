# IBM - Unified Profile

This module Allow the user to retrieve information from the IBM unified profile program

## Getting Started

To use this module you just need to import it to your project and have a running server with access to the blue network.

### Installing

Run `npm i ibm-uprofile --save`

### Documentation
Below follows the details about methods available in this module

#### UProfile.setDefault(template)
This method sets a default template to be used across everytime you need to retrieve the information from the unified profile.

| Params     | Type   | Description |
| --------   | ------ | -----------
| `template` | Object | **Required:** Template to be used when retrieve the results from ibm unified profile API


#### UProfile.get(userUID, template)
This method will retrieve the profile information from an specific user.

| Params       | Type   | Description |
| ------------ | ------ | ---
| `userUID`    | String | **Required:** the user UID
| `template`   | Object/String | *Optional:* Template to be used when retrieve the results from ibm unified profile API<br />*You can also use the string __"Default"__ to force the module to ignore a default template if it exists.*

>**PS:** The "Default" can be in any case, since the module for it to be on lowercase.<br />(e.g.: DEFAULT, Default, default, DeFAuLT, etc..)


### How to Use
Check the example below to get a better understanding of the module
```javascript
const UProfile = apprequire('helpers/test.helper')
const userTemplate = {
	uid: "userId",
	name: "nameDisplay",
	location: "address.business.address"
}

UProfile.setDefault(userTemplate)

class TestScript {
	index(req, res) {
		let tmpTemplate1 = {
			name: "nameDisplay"
		}
		let tmpTemplate2 = {
			name: "nameDisplay",
			location: "address.business"
		}

		//The numbers were changed to 0 to protect the IBM's employees
    //Also these are just examples so you can see the usability in different ways
		let promises = [
			UProfile.get("000000000000"),
			UProfile.get("000000000000", "Default"),
			UProfile.get("000000000000", tmpTemplate1),
			UProfile.get("000000000000", tmpTemplate2),
		]

		Promise.all(promises)
		.then(results => res.status(200).json(results))
		.catch(err => res.status(500).json(err))
	}
}

```

As you see below this will be the result:
```javascript
[
  {
  	"uid": <String>,
    "name": <String>,
    "location": [
      <String>,
      <String>
    ]
  },
  {
    "modifiedDate": 1481803153699,
    "userId": <String>,
    "typeId": <String>,
    "active": <Boolean>,
    .
    .
    . //her will be alot of more properties, check section About IBM-Unified-Profile API\Response
  },
  {
    "name": <String>
  },
  {
    "name": <String>,
    "location": {
      "zip": <String>,
      "locality": <String>,
      "state": <String>,
      "country": <String>,
      "address": [
        <String>,
        <String>
      ],
      "location": <String>,
      "stateCo": <String>
    }
  }
]
```

## About IBM-Unified-Profile API
I'm didn't found any documentation about the unified profile, so here is what I have so far:<br /><br />

**URL:** https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/docs/instances/master?userId= `userUID`<br />
**Response**<br />
```javascript
{
    "modifiedDate": 1481803153699,
    "userId": <String>,
    "typeId": <String>,
    "active": <Boolean>,
    "content": {
      "identity_info": {
        "address": {
          "business": {
            "zip": <String>,
            "locality": <String>,
            "state": <String>,
            "country": <String>,
            "address": [<String>],
            "location": <String>,
            "stateCo": <String>
          }
        },
        "c": <String>,
        "dn": <String>,
        "callupName": <String>,
        "co": <String>,
        "cn": [<String>],
        "costCenter": <String>,
        "courtesyTitle": <String>,
        "dept": {
          "code": <String>
        },
        "div": <String>,
        "employeeCountryCode": <String>,
        "notesMailDomain": <String>,
        "employeeType": {
          "code": <String>,
          "isManager": <Boolean>,
          "isEmployee": <Boolean>,
          "title": <String>
        },
        "glTeamLead": <String>,
        "hrActive": <String>,
        "hrOrganizationCode": <String>,
        "legalEntity": {
          "code": <String>,
          "name": <String>,
          "groupCode": <String>,
          "groupId": <String>
        },
        "mail": [<String>],
        "manager": <String>,
        "managerPSC": <String>,
        "name": {
          "first": <String>,
          "last": <String>
        },
        "nameFull": <String>,
        "notesEmail": <String>,
        "notesShortName": <String>,
        "org": {
          "code": <String>,
          "group": <String>,
          "unit": <String>,
          "title": <String>
        },
        "preferredIdentity": <String>,
        "psc": <String>,
        "role": <String>,
        "serial": <String>,
        "telephone": {
          "office": <String>,
          "mobile": <String>,
          "tieline": <String>,
          "itn": <String>,
          "alternate": <String>
        },
        "timeZone": <String>,
        "timeZoneCode": <String>,
        "uid": <String>,
        "workLocation": {
          "code": <String>,
          "building": <String>,
          "floor": <String>,
          "office": <String>
        },
        "imt": <String>,
        "iot": <String>,
        "languages": [<String>],
        "preferredContactMethod": <String>,
        "nameDisplay": <String>,
        "alternateLastName": <String>
      }
    }
  }
```

>**PS:** Some properties may or may not appear, it depends from the user information on bluepages.

## Errors
Follow the list of errors that should be present if something went wrong. For all error the module will return an object as below:
```javascript
{
	code: <Number>,
	name: <String>,
	message: <String>,
	stack: <Whatever comes from the error, mostly will be an Object>
}

```

| Code   | Name            | Message                             | Description
| ------ | --------------- | ----------------------------------- | ---
| 400    | InvalidTemplate | INVALID_TEMPLATE_TYPE               | Template is not Object / Array / String `"Default"`
| 400    | InvalidTemplate | INVALID_PROPERTY_ `PROPERTY_NAME`   | A property invalid characters (allowed only Alphanumeric and dots)
| `<500>` | ServerError     | REQUEST_ERROR                       | For some reason the http request could not be completed
| 404    | ServerError     | USER_NOT_FOUND                      | The UID used to search on the API was not found
| 500    | Unknown         | SOMETHING_WENT_WRONG                | I have no clue... Check the stack and if needed open an issue.


## Authors

* **Night** - [Niightly](https://github.com/niightly)

## License

This project is licensed under the MIT License (whatever it means hahahah) [PS: just kidding, thanks Massachusetts Institute of Technology for this wonderful license]