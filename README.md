# Web II Final Assignment

**Work in Progress**: Due to time constraints, some implementations are not as refined as intended.

### By Juan Manuel Escudero
[GitHub](https://github.com/Jmef19/u-tad-webII-final)

## Overview

This project is a backend application built using [Node.js](https://nodejs.org/en), [Express](https://expressjs.com/) and [MySql](https://www.mysql.com/), implementing a user management API. The API supports registration, authentication, email validation, profile updates and additional functionalities like password recovery, profile updates and PDF generation.

## Objectives

Emphasis was placed on clean architecture and modular organization to promote maintainability and scalability.

## Features

You can preview the API documentation by pasting the contents of `docs/openapi.yml` into [Swagger Editor](https://editor.swagger.io/).

## Technology Stack

- Node.js
- Express
- MySQL

## Dependencies

- `bcrypt`
- `dotenv`
- `express`
- `express-fileupload`
- `jest`
- `jsonwebtoken`
- `mysql2`
- `nodemailer`
- `pdfkit`
- `smtp-server`
- `supertest`

## Challenges Faced

During the Easter holidays, I lost the entire codebase due to an unexpected GitHub issue on Sunday, April 20th April. I spent the following two days rebuilding the entire project from scratch to meet the submission deadline on Tuesday, 22nd April.

## Possible Improvements

- Improve organization of the `domain/` folder.
- Refactor the `services/` folder for clearer structure.
- Implement reusable middleware (e.g., for authentication and error handling).
- Ensure consistent formatting across entities, use cases, DAOs, and routes.
- Write more comprehensive tests to improve reliability.
- Refactor large components for better maintainability.
- Review and finalize Swagger documentation for accuracy.
