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
  firstname?: string,
  surname?: string,
  email?: string,
  phone?: string, // primary contact number of the user
  mobile?: string,// This should be a valid phone number in international format e.g +2348083467335
  company?: string,
  website?: string
}
```

for example
```.json
  firstname: "John",
  surname: "Doe",
  email: "johndoe@gmail.com"
  phone: "+234704537834"
  company: "JohnD Enterprise"
  website: "www.jdoe.com"
```


PATCH /contacts/${id}
