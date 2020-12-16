# wazzup test task: backend

Simple Notes application with user registration and notes sharing.

# Requirements

- Node.js >=14 (LTS)
- PostgreSQL
- Redis

# Installation and Running

Create Postgres db.
Create `.env` file in project's root. See `.env.sample` for details.

1. `npm run initdb` - Initialize DB migrations and seeds.
2. `npm start` - starting backend in dev mode.


# Pros and Cons

- no framework in use (like Nest), only 'low-level' express
- no passportjs auth, low-level token manipulation (use of JWT)
- no high-level ORM and no low-level API's to DB calling raw queries. Instead, used query builder
- so created kind of 'models' in services for dealing with DB
- MVC-simplified pattern
- no email confirmation, user delete, password change for simplicity (and not mandatory as of task description)
- typescript 
- express middleware and route handlers use promises instead callbacks
- No SSL
- Redis connection is unprotected
- Postgres connection is unprotected
- JWT claims are not used for simplicity; redis is for blacklisted tokens
- Redis is not used for saving shared link info