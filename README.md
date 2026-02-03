# ImageCraft Server

The backend API server for ImageCraft - an AI-powered image generation platform built with Express.js and MongoDB.

## 🏗️ Architecture

The server follows a modular architecture with clear separation of concerns:

```
server/
├── routes/          # API endpoint definitions
├── controllers/     # Business logic and request handling
├── models/         # MongoDB data schemas
├── middlewares/    # Authentication and utility functions
├── config/         # Database configuration
└── server.js       # Main application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Environment variables configured

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file**
   ```env
   PORT=5000
   MONGODB_URL=mongodb://localhost:27017/imagecraft
   JWT_SECRET=your_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CLIPDROP_API=your_clipdrop_api_key
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.1.0 | Web framework |
| mongoose | ^8.18.3 | MongoDB ODM |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcrypt | ^6.0.0 | Password hashing |
| axios | ^1.12.2 | HTTP client |
| cors | ^2.8.5 | CORS middleware |
| dotenv | ^17.2.3 | Environment variables |
| cookie-parser | ^1.4.7 | Cookie parsing |
| form-data | ^4.0.4 | Multipart form data |
| razorpay | ^2.9.6 | Payment processing |
| nodemon | dev | Auto-reload during development |

## 📋 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### User Routes (`/user`)

#### Register User
```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "name": "John Doe"
  }
}
```

#### Login User
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "name": "John Doe"
  }
}
```

#### Get User Credits
```http
GET /user/credits
Headers:
  token: jwt_token_here
```
**Response:**
```json
{
  "success": true,
  "credit": 5,
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Image Routes (`/image`)

#### Generate Image
```http
POST /image/generate-image
Content-Type: application/json
Headers:
  token: jwt_token_here

{
  "prompt": "A beautiful sunset over the ocean"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Image generated successfully",
  "resultImage": "data:image/png;base64,..."
}
```

## 🔐 Authentication

The server uses **JWT (JSON Web Tokens)** for authentication:

- Tokens are issued during registration and login
- Tokens are passed in request headers as `token`
- Protected routes require valid JWT tokens
- Tokens are verified using the `userAuth` middleware
- JWT_SECRET is stored in environment variables

### Protected Routes
- `GET /api/user/credits` - Requires valid JWT
- `POST /api/image/generate-image` - Requires valid JWT

## 💾 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  creditBalance: Number (default: 5)
}
```

**Features:**
- Password stored as bcrypt hash
- Unique email constraint
- New users start with 5 credits

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `CLIPDROP_API` | ClipDrop API key for image generation |

## 🎨 Image Generation

Images are generated using the **ClipDrop API**:

- **Service:** ClipDrop Text-to-Image API
- **Cost:** 1 credit per image
- **Input:** Text prompt
- **Output:** Base64 encoded PNG image
- **Endpoint:** `https://clipdrop-api.co/text-to-image/v1`

**Credit Deduction:**
- Each successful image generation deducts 1 credit from user's balance
- User cannot generate images with 0 or negative credits

## 🛡️ Middleware

### Authentication Middleware (`auth.js`)
- Validates JWT tokens from request headers
- Extracts user ID and attaches to request object
- Returns 400 error if token is invalid or missing

## 🚨 Error Handling

The server implements comprehensive error handling:

- **400 Bad Request:** Missing details, validation errors
- **400 Unauthorized:** Invalid credentials, missing token
- **500 Internal Server Error:** Server-side errors

All responses include a `success` flag and `message` for clarity.

## 🔄 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛠️ Development

### Run in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-reload on file changes.

### Project Structure Benefits
- **Separation of Concerns:** Controllers handle logic, routes handle endpoints
- **Reusable Middleware:** Auth middleware used across protected routes
- **Schema Validation:** Mongoose ensures data integrity
- **Error Handling:** Centralized error responses

## 📝 Code Examples

### Example: Protected Route Usage
```javascript
// In a controller
const userAuth = (req, res, next) => {
  const { token } = req.headers;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  next();
};

// Apply to routes
imageRouter.post('/generate-image', userAuth, generateImage);
```

### Example: Database Query
```javascript
// Find user by ID
const user = await userModel.findById(userId);

// Update credit balance
await userModel.findByIdAndUpdate(
  userId, 
  { creditBalance: user.creditBalance - 1 },
  { new: true }
);
```

## 🚀 Deployment

Before deploying to production:

1. Set all environment variables in production environment
2. Use strong JWT_SECRET
3. Enable CORS with specific origins
4. Use MongoDB Atlas for cloud database
5. Set NODE_ENV=production
6. Use a process manager like PM2

## 🤝 Contributing

1. Create a feature branch
2. Make changes following existing patterns
3. Test all endpoints
4. Submit a pull request

## 📄 License

ISC License - See LICENSE file for details

## 🆘 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URL` is correct
- Ensure MongoDB service is running
- Check network connectivity

### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Verify token is passed in request headers
- Check token hasn't expired

### Image Generation Fails
- Verify `CLIPDROP_API` key is valid
- Check user has sufficient credits
- Ensure prompt is not empty

## 📞 Support

For issues or questions, please open an issue in the repository.
