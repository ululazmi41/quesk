<p align="center"><img src="public/next.svg" width="300"></p> 

<p align="center">
  <img src="https://img.shields.io/badge/License-GPL-blue.svg" />
</p>

# Quesk

This repository is created as a learning project, using Next.js for both the frontend and backend development, TailwindCSS to style the web interface, and Supabase as a database for user data and tasks.

Visit: [https://quesk.vercel.app/](https://quesk.vercel.app/)

## Features

- User authentication.
- Update user data.
- Create/update/delete task.
- Mark task as completed.
- Search tasks.
- Light and dark mode.
- Multilingual support: English, Bahasa Indonesia.

## Highlight

- `Responsive design` for mobile screen.
- Encoded email and password on `authentication`.
- Utilizes JSON Web Token for `authorization`.
- Encoded old password and new password when trying to `change password`.
- The Password is `hashed` before being stored on the database.
- Handled status code: `400: Bad Request`, `401: Unauthorized`, `403: Forbidden`, `404: Not Found`, and `409: Conflict`.
- Created multilingual support without using any library written on the `i18n/intl.ts` file.
- Show `loading` indicator when client attempt to fetch data on the server.

## Technologies Used

- Eslint.
- Next.js.
- React.js.
- Supabase.
- Typescript.
- Tailwind CSS.
- JSON Web Token.

## Supabase Setup

- Login or create an account on Supabase.
- Create a new project and database.
- Create 2 table with these schema:

**Users Table**

![users schema](public/schema_users.jpeg)

**Tasks Table**

![tasks schema](public/schema_tasks.jpeg)

- Rename `.env.local.sample` to `.env.local`.
- Copy the Supabase credentials into `.env.local`.

## Installation

- Clone the repository.
- Install the dependencies with `npm install`.
- Setup Supabase environment variable.
- Run the application with `npm run dev`.
- Open your browser.
- Visit [http://localhost:3000](http://localhost:3000).
