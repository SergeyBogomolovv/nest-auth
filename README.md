# Features

- Acces + Refresh tokens
- Login / Registration via credentials
- Role based acces
- Email verification
- OAuth
- Customizing profile

### Google auth

- Login: go the auth/google/login
- It will be redirect you on google callback url from .env with token in query
- create handler which will make request with this token in query to auth/google/get-user and it will return all info

### Документация api доступна на api/docs
