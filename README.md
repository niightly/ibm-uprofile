# IBM - Unified Profile

This module Allow the user to retrieve information from the IBM unified profile program

## Getting Started

To use this module you just need to import it to your project and have a running server with access to the blue network.

### Installing

Run `npm i ibm-uprofile --save`

### Test
To run the test suite, first install the dependencies, run npm test, then in another tap of your terminal access the APIs

```javascript
npm install
npm test
curl <API>
```

##### API List
Below follow the list of samples for testing
* GET `http://localhost:3000/:uid`
* GET `http://localhost:3000/samples/:uid`
* GET `http://localhost:3000/samples/cn/:uid`
* GET `http://localhost:3000/samples/default/:uid`


### How to Use
Check the examples below to get a better understanding of the module and see what fits you better.

###### Example 1 - Default
Here I will show you how to get all properties from the unified profile

```javascript
const UProfile = require('ibm-uprofile')(undefined, debug) // you can use debug if you want to see prints on terminal

class TestScript {
  index(req, res) {
    UProfile("000000000000000")
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json(err))
  }
}

```

###### Example 2 - Setting a different default template
Here I will show how to set a new template and use it as default

```javascript
const UProfile = require('ibm-uprofile')({
  uid: "userId",
  name: "nameDisplay",
  country: "address.business.country",
  email: "mail.0"
}, debug)

class TestScript {
  index(req, res) {
    UProfile("000000000000000")
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json(err))
  }
}

```

###### Example 3 - Setting a template on the request
Here I will show how to set a new template only when you execute the search

```javascript
const UProfile = require('ibm-uprofile')()

class TestScript {
  index(req, res) {
    let customTemplate = {
      uid: "userId",
      name: "nameDisplay",
    }

    UProfile("000000000000000", customTemplate)
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json(err))
  }
}

```

###### Example 4 - Setting a template on the request and using a default template
Here I will show how to set a new template as default and make 2 search with different templates
```javascript
const UProfile = require('ibm-uprofile')({
  uid: "userId",
  name: "nameDisplay",
  country: "address.business.country",
  email: "mail.0"
})

class TestScript {
  index(req, res) {
    let customTemplate = {
      uid: "userId",
      name: "nameDisplay",
    }

    var promises = [
      UProfile("000000000000000")
      UProfile("000000000000000", customTemplate)
    ]

    Promise.all(promises)
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json(err))
  }
}

```

###### Example 4 - Force to ignore a custom default template
Here I will show how to ignore a custom template previously specified
```javascript
const UProfile = require('ibm-uprofile')({
  uid: "userId",
  name: "nameDisplay",
  country: "address.business.country",
  email: "mail.0"
})

class TestScript {
  index(req, res) {
    UProfile("000000000000000", "default")
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json(err))
  }
}

```

## Custom Templates
Basically there is no restriction about the properties you choose (besides javascript restrictions of course). The restriction is related with the values of these properties, bellow follows the list of the allowed values:

Properties  | Type
--- | ---
modifiedDate  |  Number
userId  |  String
typeId  |  String
active  |  Boolean
address | Object
address.business  | Object
address.business.zip  |  String
address.business.locality |  String
address.business.state  |  String
address.business.country  |  String
address.business.address  |  Array
address.business.location |  String
address.business.stateCo  |  String
c |  String
dn  |  String
callupName  |  String
co  |  String
cn  |  Array
costCenter  |  String
courtesyTitle |  String
dept  | Object
dept.code |  String
div |  String
employeeCountryCode |  String
notesMailDomain |  String
employeeType  | Object
employeeType.code |  String
employeeType.isManager  |  Boolean
employeeType.isEmployee |  Boolean
employeeType.title  |  String
glTeamLead  |  String
hrActive  |  String
hrOrganizationCode  |  String
legalEntity | Object
legalEntity.code  |  String
legalEntity.name  |  String
legalEntity.groupCode |  String
legalEntity.groupId |  String
mail  |  Array
manager |  String
managerPSC  |  String
name. | Object
name.first  |  String
name.last |  String
nameFull  |  String
notesEmail  |  String
notesShortName  |  String
org.  | Object
org.code  |  String
org.group |  String
org.unit  |  String
org.title |  String
preferredIdentity |  String
psc |  String
role  |  String
serial  |  String
telephone | Object
telephone.office  |  String
telephone.mobile  |  String
telephone.tieline |  String
telephone.itn |  String
telephone.alternate |  String
timeZone  |  String
timeZoneCode  |  String
uid |  String
workLocation  | Object
workLocation.code |  String
workLocation.building |  String
workLocation.floor  |  String
workLocation.office |  String
imt |  String
iot |  String
languages |  Array
preferredContactMethod  |  String
nameDisplay |  String
alternateLastName |  String

> **Importante:** All properties of type `Array` allow you to define the position you want to return, to do that you just need to add `.Index` at the end. *(e.g.: `mail.0` to retrieve the position 0 of the array)* <br />
**PS:** it won't add any value if the index does not exist.

## About IBM-Unified-Profile API
I'm didn't found any documentation about the unified profile, so here is what I have so far:<br /><br />

**URL:** https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/docs/instances/master?userId= `userUID`<br />
**Response**<br />
```javascript
{
    "modifiedDate": <Number>,
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

| Code    | Name            | Message                             | Description
| ------  | --------------- | ----------------------------------- | ---
| 400     | InvalidTemplate | INVALID_TEMPLATE_TYPE               | Template is not Object / Array / String `"Default"`
| 400     | InvalidTemplate | INVALID_PROPERTY_ `PROPERTY_NAME`   | A property invalid characters (allowed only Alphanumeric and dots)
| `<500>` | ServerError     | REQUEST_ERROR                       | For some reason the http request could not be completed
| 500     | ServerError     | NOT_IN_THE_VPN                      | You are trying to reach the bluepages server but you aren't in the VPN
| 404     | ServerError     | USER_NOT_FOUND                      | The UID used to search on the API was not found
| 500     | Unknown         | SOMETHING_WENT_WRONG                | I have no clue... Check the stack and if needed open an issue.


## Authors

* **Night** - [Niightly](https://github.com/niightly)

## License

This project is licensed under the MIT License (whatever it means hahahah) [PS: just kidding, thanks Massachusetts Institute of Technology for this wonderful license]