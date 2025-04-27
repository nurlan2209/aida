Инструкция
1. Настройка базы данных PostgreSQL

Установите PostgreSQL, если он еще не установлен.
Запустите PgAdmin и подключитесь к серверу PostgreSQL.
Создайте новую базу данных sport_booking.
Настройте пользователя и пароль (по умолчанию используется postgres/postgres).

2. Установка и запуск Backend (Django)

Создайте и перейдите в директорию проекта:
mkdir sport-booking
cd sport-booking
mkdir backend
cd backend

Создайте виртуальное окружение Python и активируйте его:
python -m venv venv
На Windows:
venv\Scripts\activate
На Linux/Mac:
source venv/bin/activate

Установите необходимые зависимости:
pip install -r requirements.txt

Создайте структуру проекта Django согласно коду, представленному выше.
Примените миграции и создайте суперпользователя:
python manage.py makemigrations users
python manage.py makemigrations bookings
python manage.py makemigrations payments
python manage.py migrate
python manage.py createsuperuser

Запустите сервер разработки:
python manage.py runserver

Бэкенд будет доступен по адресу: http://localhost:8000/

3. Установка и запуск Frontend (React + Vite)

Перейдите в корневую директорию проекта и создайте папку для фронтенда:
cd ..
mkdir frontend
cd frontend

Инициализируйте проект React с помощью Vite:
npm create vite@latest . -- --template react

Установите зависимости:
npm install
npm install axios react-router-dom react-datepicker jwt-decode

Создайте структуру проекта и файлы согласно коду, представленному выше.
Запустите сервер разработки:
npm run dev

Фронтенд будет доступен по адресу: http://localhost:5173/

4. Интеграция и тестирование

Создайте несколько тестовых спортивных залов, услуг и расписаний через админ-панель Django (http://localhost:8000/admin/).
Проверьте работу API с помощью таких инструментов, как Postman или через браузер.
Протестируйте функционал бронирования через React-приложение.
