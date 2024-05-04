# graduate-work
Шимолина Полина ВКР

Сегментация объектов на спутниковх снимках

my-app - front на реакте

mysite - back на джанго

после запуска swagger доступен по ссылке http://127.0.0.1:8000/swagger/

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
