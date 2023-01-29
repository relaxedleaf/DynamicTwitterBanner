# Description

This project allows you to update your Twitter banner dynamically on an interval of your choice! This project is basically a fork with some modifications from [iamspruce/twitter-banner](https://github.com/iamspruce/twitter-banner) who also wrote an article on [freecodecamp.org](https://www.freecodecamp.org/news/create-a-dynamic-twitter-header/)

<br>

# Getting Started

## Installation

-   `yarn install` - To install all the dependencies

-   Create `.env` file and copy the keys from `.env.example` over

-   Get the secrets from [Twitter API](https://developer.twitter.com/en/docs/twitter-api) and make sure that you requested `elevated access`

<br>

## Commands

| Command        | Description                       |
| -------------- | --------------------------------- |
| `yarn install` | Install dependencies              |
| `yarn dev`     | Start dev server                  |
| `yarn start`   | Start production server           |
| `yarn build`   | Remove existing build and rebuild |

<br>

## Dependencies

| Command          | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `axios`          | To make HTTP requests                                   |
| `dotenv`         | To manage environment variables                         |
| `twitter-api-v2` | A handy Twitter API client that supports v1 and v2 APIs |
| `sharp`          | High performance Node.js image processing               |

<br>

## Dev Dependencies

| Command        | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `typescript`   | To access TypeScript CLI using `tsc` command                                           |
| `@types/node`  | Get type safety and auto-completion on Node APIs such as `file`, `path`, and `process` |
| `ts-node`      | Execuate TypeScript code directly without having to wait for it be compiled            |
| `rimraf`       | A cross-flatform tools that acts like `rm -rf`                                         |
| `nodemon`      | Watch for changes and automatically restart the server when a file is changed          |
| `@types/sharp` | Types for sharp library                                                                |
