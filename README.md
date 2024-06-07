<p align="center"><img src="public/next.svg" width="300"></p> 

<p align="center">
  <img src="https://img.shields.io/badge/License-GPL-blue.svg" />
</p>

# Quesk

This repository is created as a learning project that utilizes Next.js for both the frontend and backend development, TailwindCSS to style the web interface, and Supabase as a database that stores user data and tasks.

Visit website: `link`

Also, check out the `mobile app repository`

## Features

- User authentication.
- Create/update/delete task.
- Mark task as completed.
- Search tasks.

## Highlight

- Encoded email and password on authentication.
- User password is hashed before being stored on the database.
- Utilizes JSON Web Token for authorization.
- Server wil return the error of `not found` and `unauthorized` when user is accessing certain tasks.
- User won't be able to access unauthorized task through `\tasks\:id`.

## Technologies Used

- Next.js
- JSON Web Token
- Typescript
- React.js
- Tailwind CSS
- Supabase

## Supabase Setup

- Login or create an account on Supabase.
- Create a new project and database.
- Create tables with these schema:

**Users Table**

![users schema](public/schema_users.jpeg)

**Tasks Table**

![tasks schema](public/schema_tasks.jpeg)

- Rename `.env.local.sample` to `.env.local`.
- Copy the Supabase credentials and paste them to environment variables in the `.env.local` file.

## Installation

- Clone the repository.
- Install the dependencies with `npm install`.
- Setup Supabase environment variable.
- Run the application with `npm run dev`.
- Open your browser.
- Visit [http://localhost:3000](http://localhost:3000).
