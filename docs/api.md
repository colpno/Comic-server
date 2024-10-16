<a name="readme-top"></a>

# API document

## Table of Contents

- [URLs](#urls)
  - [Prefix API endpoints](#prefix-api-endpoints)
  - [API versioning](#api-versioning)
  - [REST resources](#rest-resources)
  - [Query parameters](#query-parameters)
- [Headers](#headers)
- [App Auth](#auth)
- [Response](#response)
  - [HTTP Codes](#http-codes)
  - [Errors](#errors)
- [Routes](#routes)
  - [Health check](#health-check)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## URLs

### Prefix API endpoints

Prefix API endpoints with `/api/` to separate them from other URLs like static files served on the same server.

<details>
	<summary>Click to see example</summary>

    www.example.com/api

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### API versioning

Versioning your API allows you to make non-backwards compatible changes to your API for newer clients by introducing new versions of endpoints while not breaking existing clients.

Include `/v1/` in the URL after the [api](#prefix-api-endpoints) path.

<details>
	<summary>Click to see example</summary>

    www.example.com/api/v1

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### REST resources

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

Query parameters are like meta data to the (usually GET) URL request. They can be used when you need more control over what data should be returned. Good use cases include filters and sorting. Some things are better suited for headers, such as providing authentication and indicating the preferred encoding type.

<details>
<summary>Click to see examples</summary>

Use query parameters for a paginated endpoint to define which page and with how many results per page you want to retrieve:

```js
/api/v1/posts?page=2&perPage=10
```

> See more query parameterse in each GET endpoint

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Headers

### Authorization

Use the `Authorization` header to consume protected endpoints. See the [App Auth](#app-auth) section for more information on how to handle authorization and authentication.

<details>
	<summary>Click to see example</summary>

```js
Authorization = 'Basic QWxhZGRpbjpPcGVuU2VzYW1l';
```

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## App Auth

- **Always** use TLS-encrypted connection, when trying to authenticate an user.
- **Always** store hashed passwords/secrets hashed/encrypted. **Never** store passwords/secrets as a plain text. **Never** implement your own encryption algorithm, use time-tested solutions.
- **Never** pass sensitive information as query string parameters. It can be logged by a web server, proxy or load balancer and make a risk of data leak.
- You should return an user’s API token **only** in these cases:
  - user is **successfully created**
  - user is **successfully authenticated**
  - tokens are **successfully refreshed**

Some recommendations:

### User authentication

- Use [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) HTTP header.
- Use Bearer scheme (described in [RFC6750](https://www.rfc-editor.org/rfc/rfc6750)).
- Use JWT (described in [RFC7591](https://www.rfc-editor.org/rfc/rfc7519)) as a Bearer token.
- Avoid implementing authorization flow by yourself, use well-known libraries and frameworks instead.

### Token payload

Token payload should contain following data:

```json
{
    "access_token": "<access_token>",
    "refresh_token": "<refresh_token>",
    "expires_in": <seconds>
}
```

### 3rd party authentication and SSO

For implementing authentication with 3rd party services (e.g. Facebook, Google, etc.) or SSO we recommend to use OAuth2.0 or/and OIDC. Client may demand using their IdP such as KeyCloak or Azure Active Directory, but as soon as all these providers implement standard protocols (OAuth2.0, OIDC), the choice of a specific provider does not make any significant changes in implementation of API.

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

### Data

> | Key                   | Data type            | Description                                     |
> | --------------------- | -------------------- | ----------------------------------------------- |
> | `data`                | `object`/`array`     | Contain response data.                          |
> | `metadata.pagination` | `object`/`undefined` | Pagination data. See [pagination](#pagination). |

#### Metadata

##### Pagination

> | Key              | Data type | Description                  |
> | ---------------- | --------- | ---------------------------- |
> | `currentPage`    | `number`  | The current page.            |
> | `links.next`     | `string`  | A link to the next page.     |
> | `links.previous` | `string`  | A link to the previous page. |
> | `perPage`        | `number`  | A number of items in a page. |
> | `totalItems`     | `number`  | The total of items.          |
> | `totalPages`     | `number`  | The total of pages.          |

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

### HTTP Codes

##### Successful

> | Code  | Title        | Description                                                                                 |
> | ----- | ------------ | ------------------------------------------------------------------------------------------- |
> | `200` | `OK`         | When a request was successfully processed (e.g. when using GET, PATCH, PUT or DELETE).      |
> | `201` | `Created`    | Every time a record has been added to the database (e.g. when creating a new user or post). |
> | `204` | `No content` | When a request returns nothing.                                                             |

##### Failed

> | Code  | Title                   | Description                                                                                          |
> | ----- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
> | `400` | `Bad request`           | When the request could not be understood (e.g. invalid syntax).                                      |
> | `401` | `Unauthorized`          | When authentication failed.                                                                          |
> | `403` | `Forbidden`             | When an authenticated user is trying to perform an action, which he/she does not have permission to. |
> | `404` | `Not found`             | When URL or entity is not found.                                                                     |
> | `500` | `Internal server error` | When an internal error has happened (e.g. when trying to add/update records in the database fails).  |
> | `502` | `Bad Gateway`           | When a necessary third party service is down.                                                        |

### Errors

> | Key        | Data type | Description                                                                     |
> | ---------- | --------- | ------------------------------------------------------------------------------- |
> | `code`     | `number`  | The HTTP code.                                                                  |
> | `error`    | `boolean` | A boolean confirming an error occurred.                                         |
> | `reason`   | `string`  | A description of the error that occurred.                                       |
> | `metadata` | `object`  | A [metadata](#metadata) object. Only available on a non-production environment. |

##### Metadata

> | Key           | Data type | Description                                        |
> | ------------- | --------- | -------------------------------------------------- |
> | `requestId`   | `string`  | An identifier indicating the request id.           |
> | `timestamp`   | `string`  | The datetime that the error occurred.              |
> | `endpoint`    | `string`  | The request endpoint.                              |
> | `httpMethod`  | `string`  | The HTTP method.                                   |
> | `stackTrace`  | `string`  | A stringify object of error stack trace.           |
> | `userId`      | `string`  | Knowing who is facing the error.                   |
> | `userRole`    | `string`  | Knowing what role the user is in facing the error. |
> | `environment` | `string`  | The environment of the server.                     |

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

## Routes

### Health check

---

A route for checking availability of the corresponding versioning endpoint.
This route is always exist for every available versioning endpoint.

##### HTTP method

`GET`

##### Endpoint

```js
/api/v1/health
```

##### Responses

> | HTTP code | content-type       | response          |
> | --------- | ------------------ | ----------------- |
> | `200`     | `application/json` | `{"status":"ok"}` |

If the HTTP code is other than 200, then the endpoint isn't available.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
