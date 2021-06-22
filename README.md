# IBM - Unified Profile

This module Allow the user to retrieve information from the IBM unified profile program.

## Getting Started

To use this module you just need to import it to your project and have a running server with access to the blue network.

### Installing

Run `npm i ibm-uprofile --save`

### Testing

To run the test suite, first install the dependencies, run npm test, then in another tap of your terminal access the APIs

```javascript
npm install
npm test
curl <API>
```

#### API List

Below follow the list of samples for testing
* GET `http://localhost:3000/:uid/info`
* GET `http://localhost:3000/:uid/skill`
* GET `http://localhost:3000/:uid/team`
* GET `http://localhost:3000/:uid/all`
* POST `http://localhost:3000/users`

##### Body UIDs

```js
[
  "000000631",
  "111111631",
  "222222631"
]
```

##### Body Emails

```js
[
  "email@ibm.com",
  "email1@br.ibm.com",
  "email2@ibm.com"
]
```

> **PS:** You can use one or another but you can't search by CNUM and EMAIL at the same time.
> The API will search the type it begin with, the other will be ignored.

## Methods

Here is the list of the available methods for this module

### UProfile.team(CNUM[,options])

Fetch the information regarding the user team. It will fetch the international and local hierarchical tree.

#### Usage

```js
const UProfile = require('ibm-uprofile')(debug) // debug [true/false] will log more stuff to the stdout

// Await / Async
try {
  const user = await UProfile.team("000000631")
  console.log(user)
} catch (err) {
  console.log(err)
}

// Traditional Promise
UProfile.team("000000631")
  .then(user => console.log(user))
  .catch(err => console.log(err))
```

#### Response Schema - UserTeamObject

```js
{
  "uid": String,
  "functional": {
    "leadership": [
      {
        "uid": String,
        "preferredIdentity": String,
        "name": {
          "last": String,
          "first": String
        },
        "nameFull": String,
        "role": String,
        "dept": {
          "code": String
        },
        "isEmployee": Boolean,
        "isManager": Boolean,
        "employeeType": {
          "isEmployee": Boolean,
          "isManager": Boolean,
          "title": String,
          "code": String
        },
        "legalEntity": {
          "groupCode": String,
          "groupId": String,
          "name": String,
          "code": String
        },
        "address": {
          "business": {
            "country": String,
            "locality": String,
            "state": String,
            "zip": String,
            "location": String,
            "stateCo": String,
            "address": [
              String
            ]
          }
        },
        "telephone": {
          "itn": String,
          "mobile": String,
          "office": String,
          "tieline": String
        },
        "notesEmail": String,
        "sAMAccountName": String,
        "preferredSlackId": String,
        "preferredSlackUsername": String,
        "conferenceUrl": String
      }
    ]
    "peers": [{ ... }]
  },
  "incountry": {
    "leadership": [{ ... }],
    "peers": [{ ... }]
  }
}

//PS: [{ ... }] Means the object is the same as before.
```

### Uprofile.skills(CNUM[,options])

Fetch the skillset of the user it also retrieve the badges and other stuff related with the user skills.

#### Usage

```js
const UProfile = require('ibm-uprofile')(debug) // debug [true/false] will log more stuff to the stdout

// Await / Async
try {
  const user = await UProfile.skills("000000631")
  console.log(user)
} catch (err) {
  console.log(err)
}

// Traditional Promise
UProfile.skills("000000631")
  .then(user => console.log(user))
  .catch(err => console.log(err))
```

#### Response Schema - UserSkillsObject

```js
{
  "jobRoles": [
    {
      "JR_ID": String,
      "jobRole": String,
      "primary": Boolean,
      "skillSets": [
        {
          "JRSS_ID": String,
          "skillSet": String,
          "primary": Boolean
        },
        {
          "JRSS_ID": String,
          "skillSet": String
        },
        {
          "JRSS_ID": String,
          "skillSet": String
        },
        {
          "JRSS_ID": String,
          "skillSet": String
        },
        {
          "JRSS_ID": String,
          "skillSet": String
        },
        {
          "JRSS_ID": String,
          "skillSet": String
        }
      ]
    },
    {
      "JR_ID": String,
      "jobRole": String,
      "skillSets": [
        {
          "JRSS_ID": String,
          "skillSet": String
        }
      ]
    }
  ],
  "expertiseSummary": String,
  "primaryJobCategory": {
    "id": String,
    "name": String
  },
  "secondaryJobCategory": {
    "id": String,
    "name": String
  },
  "certifications": {
    "badges": [
      {
        "badgeId": String,
        "badgeName": String,
        "badgeDescription": String,
        "badgeImageUrl": String,
        "issueId": String,
        "issueDate": String,
        "badgeUrl": String,
        "publicUrl": String
      },
      {
        "badgeId": String,
        "badgeName": String,
        "badgeDescription": String,
        "badgeImageUrl": String,
        "issueId": String,
        "issueDate": String,
        "badgeUrl": String,
        "publicUrl": String
      }
    ]
  },
  "linkedIn": {
    "memberToken": String,
    "url": String,
    "enabled": Boolean
  },
  "uid": String
}

// PS: Not all the information above may be available since it depends on the user update.
```

### Uprofile.info(CNUM[,options])

Fetch the user profile from the bluepages.

#### Usage

Can consult one or more than one user.

__IMPORTANT__

You can only search one type [CNUM/EMAIL] at time, if you try put both type in the same list will will return only the results from the first item of the list.


##### Single Search

```js
const UProfile = require('ibm-uprofile')(debug) // debug [true/false] will log more stuff to the stdout

// Await / Async
try {
  const user = await UProfile.info("000000631")
  console.log(user)
} catch (err) {
  console.log(err)
}

// Traditional Promise
UProfile.info("000000631")
  .then(user => console.log(user))
  .catch(err => console.log(err))
```

###### Response Schema - UserInfoObject

```js
{
  "address": {
    "business": {
      "country": String,
      "locality": String,
      "state": String,
      "zip": String,
      "location": String,
      "stateCo": String,
      "address": [
        String
      ]
    }
  },
  "backup": {
    "backupCountryCode": String,
    "backupSerialNumber": String,
    "uid": String
  },
  "dept": {
    "code": String
  },
  "employeeType": {
    "isEmployee: Boolean,
    "isManager: Boolean,
    "title": String,
    "code": String
  },
  "legalEntity": {
    "groupCode": String,
    "groupId": String,
    "name": String,
    "code": String
  },
  "name": {
    "first": String,
    "last": String
  },
  "oooSettings": {
    "message: Boolean,
    "date: Boolean
  },
  "org": {
    "group": String,
    "title": String,
    "unit": String,
    "code": String
  },
  "telephone": {
    "itn": String,
    "mobile": String,
    "office": String,
    "tieline": String
  },
  "workLocation": {
    "building": String,
    "code": String,
    "campusID": String
  },
  "cn": [
    String
  ],
  "languages": [
    String
  ],
  "mail": [
    String
  ],
  "alternateLastName": String,
  "c": String,
  "callupName": String,
  "co": String,
  "costCenter": String,
  "courtesyTitle": String,
  "createdDate": String,
  "div": String,
  "dn": String,
  "employeeCountryCode": String,
  "entryType": String,
  "functionalManagerUid": String,
  "hrActive": String,
  "hrOrganizationCode": String,
  "importantContactInfo": String,
  "imt": String,
  "inCountryManagerUid": String,
  "iot": String,
  "manager": String,
  "managerPSC": String,
  "nameDisplay": String,
  "nameFull": String,
  "notesEmail": String,
  "notesMailDomain": String,
  "notesMailFile": String,
  "notesMailServer": String,
  "notesShortName": String,
  "preferredContactMethod": String,
  "preferredIdentity": String,
  "preferredLanguage": String,
  "preferredSlackId": String,
  "preferredSlackUsername": String,
  "profileLastUpdated": String,
  "pronunciation": String,
  "psc": String,
  "role": String,
  "sAMAccountName": String,
  "serial": String,
  "startDate": String,
  "timeZone": String,
  "timeZoneCode": String,
  "uid": String,
  "workdayWorkerID": String,
  "workerId": String,
  "workplaceIndicator": String,
  "conferenceUrl": String
}
```

##### Multiple Search

This module allow the application to query large amount of data, although the UnifiedProfile API currently has a limitation of 7873 characters in the url. IT won't happen here.

To create a way around it I will calculate the quantity of chars in the URL after the encode and perform several chunks below the cap running asynchronously multiple query into the UnifiedProfile.

This way, the limitation is transparent when using this module even if it still there.
![image](https://camo.githubusercontent.com/5c9a73c63b19286025f4d72a50690af51966f6ff535783c23aa3746a3a5c9447/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f58524231756632463962474f412f67697068792e676966)

Below follow the example about how to use it:

```js
const UProfile = require('ibm-uprofile')(debug) // debug [true/false] will log more stuff to the stdout

// Await / Async
try {
  const user = await UProfile.info(["000000631", "111111631", "222222631"])
  console.log(user)
} catch (err) {
  console.log(err)
}

// Traditional Promise
UProfile.info(["000000631", "111111631", "222222631" ])
  .then(user => console.log(user))
  .catch(err => console.log(err))
```

###### Response Schema - `[UserInfoObject]`

```js
[
  { ... },
  { ... }
]

```
The objects within the array is the same as `UserInfoObject`


### Uprofile.all(CNUM[,options])

Basically put together the result of the 3 APIs before into a single object.

#### Usage

```js
const UProfile = require('ibm-uprofile')(debug) // debug [true/false] will log more stuff to the stdout

// Await / Async
try {
  const user = await UProfile.all("000000631")
  console.log(user)
} catch (err) {
  console.log(err)
}

// Traditional Promise
UProfile.all("000000631")
  .then(user => console.log(user))
  .catch(err => console.log(err))
```

#### Response Schema - all (Object)

```js
{
  "identity_info": UserInfoObject
  "team_info": UserTeamObject
  "profile_extended": UserSkillsObject
}
```

### Options

Currently there are a small set of options, but will help you to customize a little bit the API:

| attribute    | Purpose                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| break_on_404 | If true, will throw an error 404 error if the user do not match. **Default: false**<br>This option is ignored when you are searching more than one user |
| headers      | If true, will bring the headers from the Unified Profile. **Default: false**                                                                            |

## About IBM-Unified-Profile API

I coun't find any detailed information regarding the APIs, like limitation and stuff like that.

Here is the link regarding all APIs => https://w3.ibm.com/w3publisher/bluepages-ui-support/unified-profile-apis

This module is not related with the APIs, it only uses the URLs from there and provide a transparent way to query users from it.

## Authors

* **Night** - [Niightly](https://github.com/niightly)

## Special Thanks

I would like to express here my gratitude to [Matt Funk](https://w3.ibm.com/bluepages/profile.html?email=mfunk@us.ibm.com) (Product Owner for BluePages & User Profile) for the patience to listen to the results of my tests and problems I have faced regarding the new version of the APIs.

## License

This project is licensed under the MIT License (whatever it means hahahah)

>PS: just kidding, thanks Massachusetts Institute of Technology for this wonderful license.