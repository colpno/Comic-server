<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Overview

An API server uses [MVC pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). Its ability is to serve comics, related stuffs from [MangaDex](), and several data from database.

## Built With

- <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=61DAFB" alt="Facebook" style="vertical-align: middle;"></a>
- <a href="https://nodejs.org/en"><img src="https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=61DAFB" alt="NodeJS" style="vertical-align: middle;"></a>
- <a href="https://expressjs.com"><img src="https://img.shields.io/badge/ExpressJS-000000?style=for-the-badge&logo=express&logoColor=61DAFB" alt="ExpressJS" style="vertical-align: middle;"></a>
- <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=61DAFB" alt="MongoDB" style="vertical-align: middle;"></a>
- <a href="https://jwt.io"><img src="https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=61DAFB" alt="JWT" style="vertical-align: middle;"></a>
- <a href="https://joi.dev">Joi</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- Fetch comics from [MangaDex](https://api.mangadex.org/docs/), process the data, and return it to the client-side.
- Users, user followings are saved in [database](https://www.mongodb.com).
- Protect the server with [CORS](https://expressjs.com/en/resources/middleware/cors.html), [Rate limiting](https://github.com/express-rate-limit/express-rate-limit).
- Prevent/Reduce attacks via [CSRF](https://github.com/expressjs/csurf), [XSS](https://owasp.org/www-community/attacks/xss/).
- Authenicate with [JWT](https://jwt.io), [JWS](https://www.rfc-editor.org/rfc/rfc7515.html), [JWE](https://datatracker.ietf.org/doc/html/rfc7516).
- Validate user input with [Joi](https://joi.dev).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- git
- npm

### Installation

```sh
git clone https://github.com/colpno/Comic-server.git
cd Comic-server && npm i
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Duplicate `.env.example`, rename it to `.env`, and fill in with yours.

API routes start with default `/api/v1`.

```sh
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Tạ Gia Vinh

- <img src="https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=61DAFB" alt="Gmail" style="vertical-align: middle;"> : gvinhh@gmail.com
- <img src="https://img.shields.io/badge/Zalo-0068FF?style=for-the-badge&logo=zalo&logoColor=61DAFB" alt="Zalo" style="vertical-align: middle;"> (Phone): 034-523-4854

<p align="right">(<a href="#readme-top">back to top</a>)</p>
