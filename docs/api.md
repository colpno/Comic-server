<a name="readme-top"></a>

# API document

## Table of Contents

- [URLs](#urls)
  - [Prefix API endpoints](#prefix-api-endpoints)
  - [API versioning](#api-versioning)
  - [REST resources](#rest-resources)
  - [Query parameters](#query-parameters)
    - [Filter](#filter)
    - [Advanced filter](#advanced-filter)
      - [like](#like)
      - [eq](#eq)
      - [ne](#ne)
      - [exists](#exists)
      - [gt](#gt)
      - [gte](#gte)
      - [lt](#lt)
      - [lte](#lte)
      - [size](#size)
      - [all](#all)
      - [in](#in)
      - [nin](#nin)
      - [or](#or)
      - [and](#and)
    - [Pagination](#pagination)
    - [Selection](#selection)
    - [Relationships](#relationships)
- [Auth](#auth)
  - [Authentication](#authentication)
  - [Authorization](#authorization)
  - [CSRF protection](#csrf-token)
  - [3rd party authentication](#3rd-party-authentication-and-sso)
- [Response](#response)
  - [Successful payload](#successful-response-payload)
  - [Error payload](#error-response-payload)
  - [HTTP Codes](#http-codes)
- [Routes](#routes)
  - [Health check](#health-check)
  - [Auth](#auth-1)
    - [CSRF generating](#csrf)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## URLs

### Prefix API endpoints

---

Prefix API endpoints with `/api` to separate them from other URLs like static files served on the same server.

<details>
	<summary>Click to see example</summary>

    www.example.com/api

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### API versioning

---

Versioning your API allows you to make non-backwards compatible changes to your API for newer clients by introducing new versions of endpoints while not breaking existing clients.

Include `/v1` in the URL after the [api](#prefix-api-endpoints) path.

<details>
	<summary>Click to see example</summary>

    www.example.com/api/v1

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### REST resources

---

After the API prefix and the version comes the part of the URL path that identifies the resource -- the piece of data you are interested in. Refer to a type of resource with a plural noun (eg. "comics"). Directly following such a noun can be an identifier that points to a single instance.
A resource can also be nested, usually if there some sort of parent/child relationship. This can be expressed by appending another plural noun to the URL.

<details>
<summary>Click to see examples</summary>

##### Refer to a resource with a plural noun:

```js
/api/v1/comics
```

##### Use an identifier following a noun to refer to a single entity:

```js
/api/v1/comics/42
```

##### Refer to a nested resource like so:

```js
/api/v1/comics/1/comments
```

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Query parameters

---

Query parameters are like meta data to the (usually GET) URL request. They can be used when you need more control over what data should be returned. Good use cases include filters and sorting. Some things are better suited for headers, such as providing authentication and indicating the preferred encoding type.

The following parameters are possibly allowed to use in every GET request. For more details, please see the corresponding [route](#routes).

#### Filter

All the filters are started with a field and its filter.

##### Example

```js
const query = {
  year: 2020,
  title: 'hello',
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Advanced Filter

Instead of searching for a specific value, this advanced technique allows you to get more complex control to data. To use this filter, you can only use either string or object of filter [operators](#operators) for a field.

##### Example

```js
// ✅ Correct
const query = {
  title: {
    eq: 'Hello',
  },
};

// ❌ Wrong - This is for basic filter
const query = {
  title: 'Hello',
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Filter Operators

#### eq

> | Key  |       Data type       | Required? | Description                  |
> | ---- | :-------------------: | :-------: | ---------------------------- |
> | `eq` | string/number/boolean |    no     | Strictly equal to the value. |

##### Example

```js
const query = {
  title: {
    eq: 'Hello',
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### like

> | Key    | Data type | Required? | Description        |
> | ------ | :-------: | :-------: | ------------------ |
> | `like` |  string   |    no     | Contain the value. |

##### Example

```js
const query = {
  title: {
    like: 'Hello',
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### ne

> | Key  |       Data type       | Required? | Description         |
> | ---- | :-------------------: | :-------: | ------------------- |
> | `ne` | string/number/boolean |    no     | Not equal to value. |

##### Example

```js
const query = {
  title: {
    ne: 'Hello',
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### exists

> | Key      | Data type | Required? | Description                                              |
> | -------- | :-------: | :-------: | -------------------------------------------------------- |
> | `exists` |  boolean  |    no     | Determines that the field must not be null or undefined. |

##### Example

```js
const query = {
  title: {
    exists: true,
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### gt

> | Key  |   Data type   | Required? | Description                                  |
> | ---- | :-----------: | :-------: | -------------------------------------------- |
> | `gt` | string/number |    no     | Determines that the field must greater than. |

##### Examples

```js
const query = {
  title: {
    gt: 23,
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### gte

> | Key   |   Data type   | Required? | Description                                           |
> | ----- | :-----------: | :-------: | ----------------------------------------------------- |
> | `gte` | string/number |    no     | Determines that the field must greater than or equal. |

##### Examples

```js
const query = {
  title: {
    gte: 23,
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### lt

> | Key  |   Data type   | Required? | Description                                 |
> | ---- | :-----------: | :-------: | ------------------------------------------- |
> | `lt` | string/number |    no     | Determines that the field must lesser than. |

##### Examples

```js
const query = {
  title: {
    lt: 23,
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### lte

> | Key   |   Data type   | Required? | Description                                          |
> | ----- | :-----------: | :-------: | ---------------------------------------------------- |
> | `lte` | string/number |    no     | Determines that the field must lesser than or equal. |

##### Examples

```js
const query = {
  title: {
    lte: 23,
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### size

> | Key    |   Data type   | Required? | Description                                                |
> | ------ | :-----------: | :-------: | ---------------------------------------------------------- |
> | `size` | number/object |    no     | For fields that are array type, use array size to compare. |

`size` object definition:

> | Key   | Data type | Required? | Description      |
> | ----- | :-------: | :-------: | ---------------- |
> | `ne`  |  number   |    no     | See [ne](#ne).   |
> | `gt`  |  number   |    no     | See [gt](#gt).   |
> | `gte` |  number   |    no     | See [gte](#gte). |
> | `lt`  |  number   |    no     | See [lt](#lt).   |
> | `lte` |  number   |    no     | See [lte](#lte). |

##### Examples

```js
const query = {
  title: {
    size: 23,
  },
};

// Or
const query = {
  title: {
    size: {
      ne: 23,
      gt: 23,
      gte: 23,
      lt: 23,
      lte: 23,
    },
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### all

> | Key   |     Data type      | Required? | Description                                        |
> | ----- | :----------------: | :-------: | -------------------------------------------------- |
> | `all` | array of primitive |    no     | Has all specified values. The field type is array. |

##### Examples

```js
const query = {
  title: {
    all: ['Hello', 'World'],
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### in

> | Key  |     Data type      | Required? | Description                       |
> | ---- | :----------------: | :-------: | --------------------------------- |
> | `in` | array of primitive |    no     | Has at least one specified value. |

##### Examples

```js
const query = {
  title: {
    in: ['Hello', 'World'],
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### nin

> | Key   |     Data type      | Required? | Description               |
> | ----- | :----------------: | :-------: | ------------------------- |
> | `nin` | array of primitive |    no     | None of specified values. |

##### Examples

```js
const query = {
  title: {
    nin: ['Hello', 'World'],
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### or

> | Key  |    Data type     | Required? | Description                                      |
> | ---- | :--------------: | :-------: | ------------------------------------------------ |
> | `or` | array of objects |    no     | This filters or that filters, can't use or, and. |

##### Examples

```js
const query = {
  title: {
    or: [{ title: 'Hello' }, { title: 'World' }],
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### and

> | Key   |    Data type     | Required? | Description                                       |
> | ----- | :--------------: | :-------: | ------------------------------------------------- |
> | `and` | array of objects |    no     | This filters and that filters, can't use or, and. |

##### Examples

```js
const query = {
  title: {
    and: [{ title: 'Hello' }, { title: 'World' }],
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Pagination

> | Key      | Data type | Required? | Description                   |
> | -------- | :-------: | :-------: | ----------------------------- |
> | `_page`  |  number   |    no     | The page number.              |
> | `_limit` |  number   |    no     | The number of items per page. |

See the returned [payload](#pagination-1).

##### Example

```js
const query = {
  _page: 2,
  _limit: 10,
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Sort

> | Key     | Data type | Required? | Description      |
> | ------- | :-------: | :-------: | ---------------- |
> | `_sort` |  object   |    no     | To sort columns. |

The allowed values for each column are `asc` and `desc`.

#### Examples

##### Single column

```js
const query = {
  _sort: {
    title: 'asc',
  },
};
```

##### Multiple columns

```js
const query = {
  _sort: {
    title: 'asc',
    year: 'desc',
  },
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Selection

> | Key       | Data type | Required? | Description                                                                     |
> | --------- | :-------: | :-------: | ------------------------------------------------------------------------------- |
> | `_select` |  string   |    no     | To choose which fields of an item will be retrieve or remove out of the output. |

Multiple fields are separated by a space.

#### Examples

##### Return only the specified.

```js
const query = {
  _select: 'title year',
};
```

##### Return Except the specified.

```js
const query = {
  _select: '-year',
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Relationships

> | Key      |      Data type      | Required? | Description                      |
> | -------- | :-----------------: | :-------: | -------------------------------- |
> | `_embed` | string/object/array |    no     | Includes relationships of items. |

There are 3 ways to embed relationships: [string](#1-string), [object](#2-object), [array](#3-array).

#### 1. String.

##### Example

```js
const query = {
  _embed: 'chapters',
};
```

#### 2. Object.

All below keys are under `_embed` object.

> | Key        |      Data type      | Required? | Description                                                          |
> | ---------- | :-----------------: | :-------: | -------------------------------------------------------------------- |
> | `path`     |       string        |    yes    | The field which will be embedded.                                    |
> | `select`   |       string        |    no     | To include and exclude fields. See [Selection](#selection)           |
> | `match`    |       object        |    no     | The filter of the embedded.                                          |
> | `populate` | string/object/array |    no     | Embed the field in the embedded. See [Relationships](#relationships) |

##### Example

```js
const query = {
  _embed: {
    path: 'chapters',
    select: 'title createdAt',
    match: {
      title: {
        like: 'Hello',
      },
    },
    populate: 'author',
  },
};
```

#### 3. Array

An array of [object](#2-object).

```js
const query = {
  _embed: [{ path: 'chapter' }, { path: 'author' }],
};
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Auth

- **Always** use TLS-encrypted connection, when trying to authenticate an user.
- **Always** store hashed passwords/secrets hashed/encrypted. **Never** store passwords/secrets as a plain text. **Never** implement your own encryption algorithm, use time-tested solutions.
- **Never** pass sensitive information as query string parameters. It can be logged by a web server, proxy or load balancer and make a risk of data leak.
- You should return an user’s API token **only** in these cases:
  - user is **successfully created**
  - user is **successfully authenticated**
  - tokens are **successfully refreshed**

Some recommendations:

### Authentication

- Use [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) HTTP header.
- Use Bearer scheme (described in [RFC6750](https://www.rfc-editor.org/rfc/rfc6750)).
- Use JWT (described in [RFC7591](https://www.rfc-editor.org/rfc/rfc7519)) as a Bearer token.

Authorization payload should contain following data:

```json
{
  "accessToken": "<access-token>",
  "refreshToken": "<refresh-token>",
  "expiresIn": "<seconds>"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Authorization

User role packed in `accessToken` is used for authorizing and allowing which actions to be execute.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### CSRF token

In order to be able to successfully request to POST routes, you need a [X-CSRF-TOKEN](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) HTTP header to prove the user is trustworthy.

To implement CSRF protection. Request to [CSRF route](#csrf), and attach the token returned by the route into the header.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 3rd party authentication and SSO

For implementing authentication with 3rd party services (e.g. Facebook, Google, etc.) or SSO we recommend to use OAuth2.0 or/and OIDC.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Response

A few rules the response has to follow:

- Root should always be returned as an object.
- Keys should always be returned as camelCase.
- When the result is empty, the response needs to return in the following way:
  - Collection: Return empty array.
  - Empty key: Unset the key.
- Consistency of key types. e.g. always return id as a string in all endpoints.
- Date/timestamps should always be returned in ISO format.
- Content (being a single object or a collection) should be returned in a key (e.g. data).
- Pagination data should be returned in a meta key.
- Endpoints should always return a JSON payload.
  - When an endpoint doesn't have meaningful data to return (e.g. when deleting something), only a status that indicates the status of the endpoint is returned.

### Successful response payload

> | Key                                    |  Data type   | Description                      |
> | -------------------------------------- | :----------: | -------------------------------- |
> | `data`                                 | object/array | Contain response data.           |
> | [`metadata.pagination`](#pagination-1) |    object    | Available if data was paginated. |

#### Metadata

##### Pagination

> | Key              | Data type | Description                  |
> | ---------------- | :-------: | ---------------------------- |
> | `currentPage`    |  number   | The current page.            |
> | `links.next`     |  string   | A link to the next page.     |
> | `links.previous` |  string   | A link to the previous page. |
> | `perPage`        |  number   | A number of items in a page. |
> | `totalItems`     |  number   | The total of items.          |
> | `totalPages`     |  number   | The total of pages.          |

<details>
	<summary>Click to see examples</summary>

##### A single item

```json
{
  "data": {
    "id": 1,
    "name": "Shane Berry",
    "email": "shane@berry.com",
    "createdAt": "2015-03-02T12:59:02+0100",
    "updatedAt": "2015-03-04T15:50:40+0100"
  }
}
```

##### A collection of items

```json
{
  "data": [
    {
      "id": 1,
      "name": "Shane Berry",
      "email": "shane@berry.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    },
    {
      "id": 2,
      "name": "Albert Henderson",
      "email": "albert@henderson.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    },
    {
      "id": 3,
      "name": "Miguel Phillips",
      "email": "miguel@phillips.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    }
  ]
}
```

##### A paginated collection of items

```json
{
  "data": [
    {
      "id": 1,
      "name": "Shane Berry",
      "email": "shane@berry.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    },
    {
      "id": 4,
      "name": "Albert Henderson",
      "email": "albert@henderson.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    }
  ],
  "metadata": {
    "pagination": {
      "currentPage": 2,
      "links": {
        "next": "/api/users/?_page=3&_limit=20",
        "previous": "/api/users/?_page=1&_limit=20"
      },
      "perPage": 20,
      "total": 258,
      "totalPages": 13
    }
  }
}
```

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Error response payload

> | Key                       | Data type | Description                                                       |
> | ------------------------- | :-------: | ----------------------------------------------------------------- |
> | `code`                    |  number   | The HTTP code.                                                    |
> | `error`                   |  boolean  | Indicate the request is error or not.                             |
> | `reason`                  |  string   | A description of the error that occurred.                         |
> | [`metadata`](#metadata-1) |  object   | Only available on a **non-production** environment for debugging. |

##### Metadata

> | Key           | Data type | Description                                        |
> | ------------- | :-------: | -------------------------------------------------- |
> | `requestId`   |  string   | An identifier indicating the request id.           |
> | `timestamp`   |  string   | The datetime that the error occurred.              |
> | `endpoint`    |  string   | The request endpoint.                              |
> | `httpMethod`  |  string   | The HTTP method.                                   |
> | `stackTrace`  |  string   | A stringify object of error stack trace.           |
> | `userId`      |  string   | Knowing who is facing the error.                   |
> | `userRole`    |  string   | Knowing what role the user is in facing the error. |
> | `environment` |  string   | The environment of the server.                     |

<details>
	<summary>Click to see an example</summary>

```json
{
  "code": 400,
  "error": true,
  "reason": "Invalid email or password",
  "metadata": {
    "requestId": "abc123",
    "timestamp": "2023-10-01T12:34:56Z",
    "endpoint": "/api/comics",
    "httpMethod": "GET",
    "stackTrace": "Error: Something went wrong\n    at Object.<anonymous> (/path/to/file.js:10:15)\n    at Module._compile (internal/modules/cjs/loader.js:778:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n    at Module.load (internal/modules/cjs/loader.js:653:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n    at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)\n    at startup (internal/bootstrap/node.js:283:19)\n    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)",
    "userId": "user456",
    "userRole": "admin",
    "serverName": "server-1",
    "environment": "development"
  }
}
```

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Metadata

##### Pagination

> | Key              | Data type | Description                  |
> | ---------------- | :-------: | ---------------------------- |
> | `currentPage`    |  number   | The current page.            |
> | `links.next`     |  string   | A link to the next page.     |
> | `links.previous` |  string   | A link to the previous page. |
> | `perPage`        |  number   | A number of items in a page. |
> | `totalItems`     |  number   | The total of items.          |
> | `totalPages`     |  number   | The total of pages.          |

<details>
	<summary>Click to see examples</summary>

##### A single item

```json
{
  "data": {
    "id": 1,
    "name": "Shane Berry",
    "email": "shane@berry.com",
    "createdAt": "2015-03-02T12:59:02+0100",
    "updatedAt": "2015-03-04T15:50:40+0100"
  }
}
```

##### A collection of items

```json
{
  "data": [
    {
      "id": 1,
      "name": "Shane Berry",
      "email": "shane@berry.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    },
    {
      "id": 2,
      "name": "Albert Henderson",
      "email": "albert@henderson.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    },
    {
      "id": 3,
      "name": "Miguel Phillips",
      "email": "miguel@phillips.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    }
  ]
}
```

##### A paginated collection of items

```json
{
  "data": [
    {
      "id": 1,
      "name": "Shane Berry",
      "email": "shane@berry.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    },
    {
      "id": 4,
      "name": "Albert Henderson",
      "email": "albert@henderson.com",
      "createdAt": "2015-03-02T12:59:02+0100",
      "updatedAt": "2015-03-04T15:50:40+0100"
    }
  ],
  "metadata": {
    "pagination": {
      "currentPage": 2,
      "links": {
        "next": "/api/users/?_page=3&_limit=20",
        "previous": "/api/users/?_page=1&_limit=20"
      },
      "perPage": 20,
      "total": 258,
      "totalPages": 13
    }
  }
}
```

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### HTTP Codes

##### Successful

> | Code  | Title        | Description                                                                                 |
> | :---: | ------------ | ------------------------------------------------------------------------------------------- |
> | `200` | `OK`         | When a request was successfully processed (e.g. when using GET, PATCH, PUT or DELETE).      |
> | `201` | `Created`    | Every time a record has been added to the database (e.g. when creating a new user or post). |
> | `204` | `No content` | When a request returns nothing.                                                             |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### Failed

> | Code  | Title                   | Description                                                                                          |
> | :---: | ----------------------- | ---------------------------------------------------------------------------------------------------- |
> | `400` | `Bad request`           | When the request could not be understood (e.g. invalid syntax).                                      |
> | `401` | `Unauthorized`          | When authentication failed.                                                                          |
> | `403` | `Forbidden`             | When an authenticated user is trying to perform an action, which he/she does not have permission to. |
> | `404` | `Not found`             | When URL or entity is not found.                                                                     |
> | `500` | `Internal server error` | When an internal error has happened (e.g. when trying to add/update records in the database fails).  |
> | `502` | `Bad Gateway`           | When a necessary third party service is down.                                                        |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Routes

All endpoints start with the `/api/v1`.

### Health check

---

A route for checking availability of the corresponding versioning endpoint.
This route is always exist for every available versioning endpoint.

#### HTTP method

`GET`

#### Endpoint

```js
/health
```

#### Response

> | HTTP code | content-type       | response          |
> | :-------: | ------------------ | ----------------- |
> |   `200`   | `application/json` | `{"status":"ok"}` |

If the HTTP code is other than 200, then the endpoint isn't available.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Auth

---

### CSRF

#### HTTP method

`GET`

#### Endpoint

```js
/auth/csrf-token
```

#### Response

> | HTTP code | content-type       | response                       |
> | :-------: | ------------------ | ------------------------------ |
> |   `200`   | `application/json` | `{"csrfToken":"<csrf-token>"}` |

<p align="right">(<a href="#readme-top">back to top</a>)</p>
