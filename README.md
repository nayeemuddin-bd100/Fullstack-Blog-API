# ✨ WordCrafters-FullStack-BlogApp Backend

**WordCrafters** API is a user-friendly backend for a blog application, built with Node.js, Express, and MongoDB. It offers essential features such as user authentication, authorization, post management, comment handling, category support, email verification, user management etc. Security is ensured through JWT Token and bcrypt used for password hashing.

## 🚀 Live Demo

Explore the API using Swagger documentation at [Swagger API Documentation](https://wordcrafters.onrender.com/api-docs/).

## ✨ Features

### 🧑‍💻 User Management:

Effortlessly manage users with a comprehensive set of features:

### Registration and Authentication:

- **User Registration:** Simple and secure user registration process.
- **User Login:** Easy login with authentication credentials.

### User Information:

- **Fetch All Users:** Retrieve a list of all users.
- **User Details:** Access detailed information about a specific user.
- **User Profile:** View and manage user profiles.

### User Interaction:

- **Update User Profile:** Modify and enhance user details.
- **Follow/Unfollow Users:** Establish and manage social connections.
- **Block/Unblock Users:** Control interactions with other users.

### Security and Authorization:

- **Token Verification with SendGrid:** Verify user accounts using email tokens with SendGrid integration.
- **Forget, Update, Reset Password:** Streamlined process for password management.

### 📝 Post Operations:

### Posts handle:

- **Create Post:** Compose and publish new posts.
- **Edit Post:** Modify the content of existing posts.
- **Delete Post:** Remove posts with a simple click.

### Retrieve Post Information:

- **Get Single Post:** Retrieve detailed information about a specific post.
- **Get All Posts:** Fetch a list of all published posts.

### Interact with Posts:

- **Like/Dislike Post:** Express your sentiment by liking or disliking posts.

## 💬 Comment Management

### Comments handle:

- **Create Comment:** Share thoughts by adding comments to posts.
- **Update Comment:** Edit and refine comment.
- **Delete Comment:** Remove comments that are no longer needed.

### Retrieve Comment Information:

- **Fetch All Comments:** Access a list of all comments for comprehensive insights.
- **Fetch Single Comment:** Retrieve detailed information about a specific comment.

## 📬 Message Management

### Send Messages:

- **Send Message:** Users can initiate communication by sending messages using sendgrid.

## 🗂️ Category Management

### Categories handle:

- **Create Category:** Seamlessly add new categories to organize content.
- **Update Category:** Modify and enhance category details.
- **Delete Category:** Remove categories as needed.

### Retrieve Category Information:

- **Fetch All Categories:** Access a comprehensive list of all available categories.
- **Fetch Single Category:** Retrieve detailed information about a specific category.

## 💻 Technologies Used

- **Node.js:** Server-side JavaScript runtime
- **Express:** Web framework for Node.js
- **MongoDB:** NoSQL database for data storage
- **Mongoose:** MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens):** Secure and compact way of representing claims
- **bcryptjs:** Library for secure password hashing
- **SendGrid:** Cloud-based email service for reliable message delivery
- **cloudinary:** For storing Image.
- **multer:** Middleware for enabling efficient file uploads
