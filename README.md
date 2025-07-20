<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 🛒 E-Commerce API – NestJS

A powerful and modular **E-commerce REST API** built with **NestJS**, featuring user authentication, address handling, order management, product catalog, reviews, file uploads, and email support.

## 🚀 Features

- 👤 **User Registration, Login, and Role Management**
- 📦 **Product Management**
- 🛍️ **Order Processing**
- 📝 **Product Reviews**
- 🗺️ **Address Management**
- 📧 **Email Notifications (Mail Module)**
- 🖼️ **File Uploads (e.g., Cloudinary)**
- 🔐 **JWT Authentication**
- 📖 **Interactive Swagger API Docs**

## 🛠️ Tech Stack

- **Node.js**, **NestJS**
- **PostgreSQL**
- **Prisma**
- **JWT Authentication**
- **Cloudinary** for File Uploads
- **Swagger** for API Documentation

## 📂 Project Structure

```bash
src/
├── address/        # Address CRUD and user address linking
├── auth/           # Authentication logic (JWT, login, register)
├── file/           # File upload logic (e.g., Cloudinary integration)
├── mail/           # Sending transactional emails
├── order/          # Order and payment handling
├── product/        # Product CRUD operations
├── review/         # Customer reviews and ratings
└── user/           # User profile and role handling
```
## 🧪 Running the Project
```bash
# Clone the repo
git clone https://github.com/Nanret123/quixcart_backend.git
cd quixcart_backend

# Install dependencies
npm install

# Set up your environment variables

# Start the app in development mode
npm run start:dev
```
## 📖 API Documentation
After running the server, visit:

**http://localhost:3000/api**

to explore the API with Swagger UI.
