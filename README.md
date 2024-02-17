# Boxlist Task Scheduler

Welcome to the Boxlist Task Scheduler, your go-to solution for efficient task management! This intuitive to-do list application empowers users to seamlessly organize their daily activities with a user-friendly interface. Whether you're a meticulous planner or a spontaneous taskmaster, the Boxlist Task Scheduler has you covered.

## Features

- **User Authentication:** Securely log in and manage your tasks with confidence using our robust user authentication system.
- **Dynamic Task Creation:** Easily add tasks with or without specific time constraints, tailoring your schedule to your unique preferences.
- **Database Storage:** Save your task lists effortlessly to our MongoDB database, ensuring your important plans are accessible and secure.
- **Date and Name Tagging:** Categorize your tasks by specifying a date and giving each list a meaningful name for quick and convenient retrieval.
- **Effortless Editing:** Update, modify, or enhance your tasks at any stage, granting you the flexibility to adapt to changing priorities.
- **Intuitive User Interface:** Navigate through tasks seamlessly, with a user interface designed for maximum simplicity and convenience.
- **Edit, Add, Delete, Read:** Perform essential operations with ease, enabling you to manage your tasks effortlessly at any given moment.

## Tools and Technologies

### Client-Side Libraries

- **React.js:** A JavaScript library for building user interfaces.
- **Redux.js:** A predictable state container for JavaScript apps.
- **TailwindCSS:** A utility-first CSS framework for rapidly building custom designs.
- **Ant Design:** A design system for enterprise-level products.

**HTTP Client:**

- **Axios:** A promise-based HTTP client for making requests to APIs. Axios is used to interact with the server-side API.

### Server-Side Technologies

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **MongoDB (Mongoose):** A NoSQL database used to store and retrieve data.
- **JWT Token:** JSON Web Token for user authentication.

## Access the live project

The live project can be accessed at [https://boxlist.vercel.app](https://boxlist.vercel.app)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mhdafs/boxlist-scheduler.git
   ```

2. **Set up environment variables:**

    Create a `.env` file in the root directory or rename the current `.env.sample` file and configure necessary variables for client and server sides.

    **Client ENV**

   ```bash
   VITE_GOOGLE_ID = google-auth-id
   VITE_USER_URL = user-backend-url
   ```

    **Server ENV**

   ```bash
   MONGO_URL =  mongo-atlas-url
   JWT_SECRET = jwt-secret-code
   GMAIL_USER = smtp-gmail-email
   GMAIL_PASS = smtp-gmail-password
   ```

3. **Navigate to the client directory:**

    Open a terminal in Visual Studio Code and split it into two terminals. In the first terminal, navigate to the client directory:

    ```bash
    cd client
    ```

4. **Install client side dependencies:**

    ```bash
    npm install
    ```

5. **Start the client-side application:**

    ```bash
    npm start
    ```

6. **Start the client-side application:**

    ```bash
    npm start
    ```

    The client-side application will be running on [http://localhost:3000](http://localhost:3000)

7. **Navigate to the server directory:**

    In the second terminal, navigate to the server directory:

    ```bash
    cd server
    ```

8. **Install server side dependencies:**

    ```bash
    npm install
    ```

9. **Start the server:**

    ```bash
    npm start
    ```

    The server will be running on [http://localhost:5000](http://localhost:5000)

## API Documentation

Detailed API documentation can be found in the [Boxlist_API_Documentation.docx](https://docs.google.com/document/d/1nzRpx4PR1GwI0gRXVfB1jVrEdJIdeiIcbiveIp85Adk/edit?usp=sharing)

## Database Design

The database design can be viewed in [Boxlist_DB_Design.pdf](https://drive.google.com/file/d/174SKFT73G0HnlmhA0bX2Z9ao6AWAmOQV/view?usp=sharing)

## Figma Prototype Design

The Figma prototype design can be viewed [Boxlist_UI](https://www.figma.com/file/ILMxaQQtPixsABdngyfzNz/Boxlist_UI?type=design&node-id=0%3A1&mode=design&t=lz72ENLrzeATpjbq-1)

## Module List

The list of modules can be found in the [Boxlist_Modules.docx](https://docs.google.com/document/d/11DLIOvIYOaqL1Zl9RlKR1q0X3qDpsAmhBFzd20VDYr8/edit?usp=sharing)

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.
