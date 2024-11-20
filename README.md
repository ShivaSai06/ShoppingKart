# Smart Shopping Cart Web Application

This repository contains the code for the Smart Shopping Cart system, designed to provide a seamless shopping experience with RFID-based item scanning and real-time billing. The project includes both frontend and backend components.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** and **npm** (for managing dependencies).
- **Express.js** (backend framework).

---

## Project Structure

```plaintext
shopping-cart/
│
├── public/
│   └── index.html      # Frontend user interface
│
├── server.js           # Backend server logic
├── package.json        # Node.js dependencies
└── README.md           # Project documentation
```

---

## Setup Instructions

### 1. Clone the Repository

To get started, clone the repository to your local system:

```bash
git clone https://github.com/ShivaSai06/shoppingCart_
cd shoppingCart_
```

---

### 2. Install Dependencies

Run the following command to install the required Node.js dependencies:

```bash
npm install
```

---

### 3. Start the Server

Start the backend server with:

```bash
node server.js
```

This will run the application on `http://localhost:3000`. You can access the frontend in your browser at this address.

---

## Frontend

The frontend, located in the `public/index.html` file, provides the user interface for interacting with the Smart Shopping Cart. Key features include:

- Display of cart items and total price.
- Buttons for adding and removing items.
- Session end functionality to finalize and display the bill.

---

## Backend

The backend, implemented in `server.js`, is built using **Express.js** and provides routes for cart operations:

- **GET /**: Serves the frontend interface.
- **POST /addItem**: Adds an item to the cart.
- **POST /remItem**: Removes an item from the cart.
- **POST /settleBill**: Finalizes the shopping session and displays the total.

---

## Usage

1. Start the backend server as described above.
2. Access the application in a web browser at `http://localhost:3000`.
3. Use the UI to:
   - Add items to the cart.
   - Remove items from the cart.
   - Finalize the session by clicking "End Session."

---

## Notes

- The frontend communicates with the backend through HTTP POST requests.
- Ensure the server is running before testing the frontend.

---

## Future Enhancements

- Integrate RFID hardware for real-time item detection.
- Add database support for cart and order management.
- Implement user authentication for secure sessions.

---

## License

This project is open-source and distributed under the [MIT License](LICENSE).

--- 

Feel free to modify the content as required!
