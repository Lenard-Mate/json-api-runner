# json-api-runner
---

## Installation

### Prerequisites:
Ensure the following are installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Steps:

1. Clone the Project Repository:
   ```bash
   git clone <repository-url>
   cd json-api-runner
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Run the Server:
   ```bash
   node server.js
   ```

4. Access the Application:
   Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

---

## Usage

### API Endpoints
1. **Get Fibonacci**:  
   **GET** `/api/getFibonacci?n=<non-negative integer>`  
   **Response**:
   ```json
   {
     "fibonacci": 21
   }
   ```

2. **Get User Profile**:  
   **GET** `/api/getUserProfile?email=<email>`  
   **Response**:
   ```json
   {
     "email": "john.doe@example.com",
     "name": "John Doe",
     "age": 30
   }
   ```

3. **Get Image by Name**:  
   **GET** `/api/getImageByName?name=<image_name>`  
   **Response**:
   ```json
   {
     "image": "<base64_image_string>",
     "contentType": "image/png"
   }
   ```

4. **Multiply Matrices**:  
   **POST** `/api/multiplyMatrices`  
   **Request**:
   ```json
   {
     "matrixA": [[1, 2], [3, 4]],
     "matrixB": [[5, 6], [7, 8]]
   }
   ```
   **Response**:
   ```json
   {
     "result": [[19, 22], [43, 50]]
   }
   ```

5. **Dispatch Tasks**:  
   **POST** `/api/dispatcher`  
   **Request** (example):
   ```json
   {
     "fibonacci": {"n": 8},
     "multiplyMatrices": {
       "matrixA": [[1, 2], [3, 4]],
       "matrixB": [[5, 6], [7, 8]]
     },
     "imageByName": {"name": "Snow"},
     "userProfile": {"email": "john.doe@example.com"}
   }
   ```
   **Response**:
   ```json
   {
     "fibonacci": 21,
     "matrix": [[19, 22], [43, 50]],
     "user": {"email": "john.doe@example.com", "name": "John Doe", "age": 30},
     "imageToReturn": "data:image/png;base64,<base64_image_string>"
   }
   ```

---

## Frontend Guide

1. Navigate to `http://localhost:3000/` in your browser.
2. Select the API you want to test from the dropdown.
3. Modify or use the provided JSON data in the text area.
4. Click **Run** to get the response.

### Additional Features
- **Theme Toggle**: Switch between dark and light themes.
- **Align Controls**: Adjust control alignment on the UI.

---

## Testing

Run unit tests for backend services and dispatcher:
