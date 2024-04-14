# Серверная часть авторизации на Nest.js

## Возможности

- Вход и регистрация через почту и пароль
- Подтверждение почты
- Вход через гугл
- Аунтефикация на основе jwt refresh и access токенов
- Кастомизация профиля
- Защищенный доступ к роутам

---

### Авторизация через гугл

- Логин: делаем ссылку на `auth/google/login`
- После этого нас редиректит на колбэк урл с токеном в параметрах
- Создаем на клиенте поинт, который будет получать информацию о пользователе с этим токеном

---

### Конфиг .env

```js
DATABASE_URL = 'Урл базы данных';
PORT = порт;
MAIL_TRANSPORT = 'Траспорт почты';
MAIL_HOST = 'хост почты (гугл)';
MAIL_USER = 'почтовый клиент';
MAIL_PASS = 'пароль почтового клиента';
JWT_EXP = 'время действия access';
JWT_SECRET = 'Секретный ключ';
SERVER_URL = 'сервер';
CLIET_URL = 'клиент';
EMAIL_VERIFY_REDIRECT_URL = 'Куда редиректить после подтверждения почты';
GOOGLE_CLIENT = 'Клиент гугла';
GOOGLE_SECRET = 'Секретный ключ гугла';
GOOGLE_CALLBACK_CLIENT = 'Редирект после авторизации через гугл';
YANDEX_CLOUD_KEY_ID = 'Id яндекса';
YANDEX_CLOUD_KEY_SECRET = 'Секретный ключ яндекса';
```

## Документация api доступна на `api/docs`
