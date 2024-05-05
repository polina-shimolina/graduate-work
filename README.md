# graduate-work
Шимолина Полина ВКР

Сегментация объектов на спутниковх снимках

my-app - front на реакте

mysite - back на джанго

После запуска swagger доступен по ссылке http://127.0.0.1:8000/swagger/

# Структура проекта

```
graduate-work/
│
├── notebook/
├── документация/  (React приложение)
├── mysite/  (Django приложение)
│   ├── manage.py
│   ├── mysite/ (API приложение)
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │
│   ├── myapi/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   ├── views.py
│   │
│   ├── media/
│   ├── db.sqlite3
│   ├── requirements.txt
│
├── my-app/  (React приложение)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── style/
│   │   │   ├── About.js
│   │   │   ├── Account.js
│   │   │   ├── Footer.js
│   │   │   ├── Header_Authorised.js
│   │   │   ├── Header_UnAuthorised.js
│   │   │   ├── Header.js
│   │   │   ├── LoginForm.js
│   │   │   ├── Logout.js
│   │   │   ├── Main.js
│   │   │   ├── NoTeamPage.js
│   │   │   ├── Photos.js
│   │   │   ├── RegistrationForm.js
│   │   │   ├── Team.js
│   │   │   ├── UserTeamPage.js
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │
│   ├── package.json
│   ├── .gitignore
│   ├── README.md
│
├── package.json
├── README.md
```

- notebook/: Папка с jupyter-ноутбуком, который содержит обучение модели сегментации.
- документация/: Папка с ТЗ, ПМИ, НИР и прочей документацией.
- mysite/: Директория с Django приложением.
  - manage.py: Основной скрипт управления Django проектом.
  - mysite/: Основное Django приложение проекта.
  - myapi/: Django приложение для API.
  - media/: Директория для медиа файлов.
  - db.sqlite3: Файл базы данных SQLite.
  - requirements.txt: Файл с зависимостями Python.
- my-app/: Директория с React приложением.
  - public/: Папка для статических файлов React приложения.
  - src/: Исходный код React приложения.
   - components/: Компоненты React-приложения
      - About.js: Компонент, отображающий информацию о проекте
      - Account.js: Компонент, отвечающий за страницу пользователя, редактирование личных данных.
      - Footer.js: Компонент, содержащий информацию в подвале страницы - ссылку на репозиторий проекта.
      - Header_Authorised.js и Header_UnAuthorised.js: Компоненты заголовка страницы, отображаемые для авторизованных и неавторизованных пользователей соответственно.
      - LoginForm.js: Компонент формы входа, позволяющий пользователям аутентифицироваться в системе.
      - Main.js: Главная страница.
      - RegistrationForm.js: Компонент формы регистрации нового пользователя.
      - Team.js, UserTeamPage.js, NoTeamPage.js: Компоненты, отображающий информацию о команде, изображения, добавленные участниками команды, или, если у пользовтеля нет команды - предложение создать новую команду.

- package.json: Файл с зависимостями Node.js для проекта.
- README.md: Общее описание проекта.

# Запуск проекта

Этот проект состоит из бэкенд части на Django и фронтенд части на Node.js. Ниже приведены инструкции для запуска проекта локально.


## Бэкенд (Django)

1. Установите Python, если он не установлен.
2. Перейдите в директорию бэкенда:
   ```
   cd mysite
   ```
3. Проведите миграции базы данных:
   ```
   python manage.py migrate
   ```
4. Запустите сервер Django:
   ```
   python manage.py runserver
   ```

## Фронтенд (Node.js)

1. Установите Node.js, если он не установлен.
2. Перейдите в директорию фронтенда:
   ```
   cd my-app
   ```
4. Установите зависимости, выполнив команду:
   ```
   npm install
   ```
5. Запустите сервер разработки фронтенда:
   ```
   npm start
   ```

После выполнения этих шагов бэкенд будет запущен на порту, указанном в настройках Django (обычно 8000), а фронтенд будет доступен по адресу http://localhost:3000/.
