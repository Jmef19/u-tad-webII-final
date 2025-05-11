# Web II Final Assignment

Work in progress — due to limited time, the implementation isn't as refined as intended.

### By Juan Manuel Escudero

## Overview

This project is a backend application built using [Node.js](https://nodejs.org/en), [Express](https://expressjs.com/) and [MySql](https://www.mysql.com/), implementing a user management API. The API supports registration, authentication, email validation, profile updates and additional functionalities like password recovery.

## Project organization (NOT UPDATED)

I focused on maintaining a clean architecture and structured organization.

- src/
  - config/
    - mysql/
      - mysqlconfig.js
      - index.js
  - domain/
    - user/
    - \_\_tests\_\_/
      - entities/
        - user.js
        - index.js
      - useCases/
        - userRegistration.js
        - validateEmails.js
        - userLogin.js
        - updateProfileImage.js
        - userByJWT.js
        - dbInfo.js
        - recoverPassword.js
        - requestPasswordReset.js
        - onboardingUser.js
        - deleteUser.js
        - index.js
    - company/
      - \_\_tests\_\_/
      - entities/
        - company.js
        - index.js
      - useCases/
        - \_\_tests\_\_/
        - onboardingCompany.js
        - index.js
    - client/
      - \_\_tests\_\_/
      - entities/
        - client.js
        - index.js
      - useCases/
    - errors/
      - AlreadyExistsError.js
      - DatabaseConnectionError.js
      - DatabaseQueryError.js
      - ValidationError.js
      - JWTError.js
      - UserNotValidatedError.js
      - UserNotFoundError.js
      - index.js
  - infrastructure/
    - persistence/
      - mysql/
        - baseDAO.js
        - user/
          - userDAO.js
        - company/
          - companyDAO.js
    - web/
      - express/
        - index.js
        - routes/
          - user/
            - index.js
          - company/
            - index.js
          - index.js
        - middlewares/
          - index.js
        - public/
    - services/
      - bcryptService.js
      - jwtService.js
      - validationCodeGeneratorService.js
      - uploadService.js
      - createUserDeleteService.js
      - createUserDataGetService.js
      - index.js
  - resources/
    - uploads/
      - profile_pictures/
  - index.js
- .env
- package-log.json
- package.json
- README.md

## Features

View the [Swagger Documentation](https://jmef19.github.io/u-tad-webII-final/)

## Technology Stack

- Node.js
- Express
- MySQL

## Dependencies

- `dotenv`
- `express`
- `mysql2`
- `jsonwebtoken`
- `bcrypt`
- `express-fileupload`

## Challenges Faced

After working on the project during Easter holidays, I lost the entire codebase due to an unexpected GitHub failure on Sunday, 20th April. I spent the following two days rebuilding the entire project from scratch to meet the submission deadline on Tuesday, 22nd April.

## Possible Improvements

- Better organization of code in `domain/` folder.
- Refactor and structure the `services/` folder more clearly.
- Implement reusable middleware functions to handle common logic (e.g., auth, error handling).
- Maintain consistent formatting across entities, use cases, DAOs, and routes.
- Implement more and better tests to ensure the app runs correctly and remains stable.
- Will need refactoring for sure
- Check the Swagger documentation to ensure it is correct
