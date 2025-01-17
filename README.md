Django Admin Credentials (Once the super user is created)

1.	Username – admin
2.	Password – 1239812398Ab


Setup Instructions

1.	Clone the Repository

Repository link: git@github.com:Kausika19/language-app.git (Branch name: complete)

2. Setting up the Frontend (React)

a. Install Dependencies

Navigate to the frontend directory and install the dependencies:

cd language-app
npm install

b. Configure Environment Variables

Create a .env file in the frontend directory if it doesn't already exist. Configure the following variables (if applicable):

REACT_APP_BACKEND_URL=http://localhost:8000/api  # URL to connect the React frontend to Django backend

c. Start the React Development Server

Once the dependencies are installed, start the React development server:

npm start

3. Setting up the Backend (Django)

a. Create and Activate a Virtual Environment

From the project root directory, create and activate a Python virtual environment (using Pipenv or virtualenv)


For Pipenv:

pipenv install
pipenv shell

For virtualenv:

python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate  # Windows

b. Install Backend Dependencies

With the virtual environment activated, install the dependencies:

pip install -r requirements.txt

c. Configure Django Environment Variables

Create a .env file in the Django project root (where manage.py is located). Set up the following environment variables for database configuration, secret key, and more:
Bash

SECRET_KEY = "django-insecure-0&p$jr*42y3@bwpjv5x6to*$kth69m30x4d+sk&fx==w9r&x%2"
DEBUG=True  # For development, set to False in production
ALLOWED_HOSTS=localhost,127.0.0.1


d. Apply Migrations

Make sure the Django database is set up and ready. Run the following commands to apply the migrations:

python manage.py makemigrations
python manage.py migrate

e. Create a Superuser

Create a superuser to access the Django Admin dashboard:

python manage.py createsuperuser


f. Start the Django Development Server

Finally, start the Django backend server:

python manage.py runserver
This will run the Django backend at http://localhost:8000.

4. Django and React Authentication

The project is integrated with Django's authentication system. Once you log in through the Django backend (using the admin panel or API), you'll be authenticated in the React frontend as well. Make sure the correct endpoints for login, registration, and other authentication features are properly connected between Django and React.

5. Building the Frontend/ Editing the frontend

When you're ready to deploy, build the React app (Make sure once an edit has been done the following command is executed, for the changes to be reflected in the server):

npm run build


