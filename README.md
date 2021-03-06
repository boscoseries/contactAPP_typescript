[![CircleCI](https://circleci.com/gh/boscoseries/contactAPP_typescript.svg?style=svg)](https://circleci.com/gh/boscoseries/contactAPP_typescript)[![Build Status](https://travis-ci.com/boscoseries/contactAPP_typescript.svg?branch=master)](https://travis-ci.com/boscoseries/contactAPP_typescript)[![Coverage Status](https://coveralls.io/repos/github/boscoseries/contactAPP_typescript/badge.svg?branch=master)](https://coveralls.io/github/boscoseries/contactAPP_typescript?branch=master)

To get all contacts

```
GET /contacts
```

returns an array of all contacts

```[
  {
    contact 1
  },
  {
    contact 2
  },
  ...

]
```

To get a single contacts
GET /contacts/id

returns the contact with id of id

```[
  {
    contact 1
  },
  {
    contact 2
  },
  ...

]
```

`POST /api/contacts`

The request body should contain

```ts
interface contact {
  firstname?: string;
  surname?: string;
  mobile?: string; // primary contact number of the useruser
  phone?: string; // secondary contact number of the user in international format e.g +2348083467335
  address?: string;
  website?: string;
  email?: string;
}
```

for example

```.json
  firstname: "John",
  surname: "Doe",
  mobile: "+234704537834"
  phone: "+234809535835"
  address: "9 Adeola street, Victoria Island"
  website: "www.johndoe.com"
  email: "johndoe@gmail.com"
```

Expected Responses

PATCH /contacts/\${id}
