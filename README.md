# 🏆 Football Academy Admin Portal

A secure internal web application for the football academy's front desk admin to manage player registrations and monthly fee payments. Built with Node.js, Express, MongoDB, and JWT-based authentication.

---

## 🚀 Features Implemented

### 🔐 Admin Authentication

- Single admin user with secure login/logout functionality.
- Admin account is auto-created on first server run using password from `.env`.
- JWT stored in HTTP-only cookies to protect admin routes.
- Only the admin can access player management endpoints.

#### Admin Login Form (HTML example)

```html
<form method="POST" action="/admin/login">
  <label for="username">Username:</label>
  <input id="username" name="username" type="text" required />

  <label for="password">Password:</label>
  <input id="password" name="password" type="password" required />

  <button type="submit">Login</button>
</form>

👤 Player Management
Admin can add new players with fields:
playerId (unique), name, email, phone, and fees.

Players are stored in MongoDB but do NOT have login access.

Admin can view all players and their payment statuses.

Add New Player Form (HTML example)

<form method="POST" action="/admin/players">
  <label for="playerId">Player ID:</label>
  <input id="playerId" name="playerId" type="text" required />

  <label for="name">Name:</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email:</label>
  <input id="email" name="email" type="email" />

  <label for="phone">Phone:</label>
  <input id="phone" name="phone" type="text" />

  <label for="fees">Fees:</label>
  <input id="fees" name="fees" type="number" required />

  <button type="submit">Add Player</button>
</form>

💰 Monthly Payment Tracking
Each player record includes a paymentStatus object with boolean flags for each month (Jan to Dec).

Admin can update whether a player has paid for a specific month.

Useful for quick lookup of who has or hasn’t paid in any month.

Update Payment Status Form (HTML example)

<form method="PUT" action="/admin/players/{playerId}/payment">
  <label for="month">Month:</label>
  <select id="month" name="month" required>
    <option value="Jan">January</option>
    <option value="Feb">February</option>
    <option value="Mar">March</option>
    <option value="Apr">April</option>
    <option value="May">May</option>
    <option value="Jun">June</option>
    <option value="Jul">July</option>
    <option value="Aug">August</option>
    <option value="Sep">September</option>
    <option value="Oct">October</option>
    <option value="Nov">November</option>
    <option value="Dec">December</option>
  </select>

  <label for="paid">Paid:</label>
  <input id="paid" name="status" type="checkbox" value="true" />

  <button type="submit">Update Payment</button>
</form>

🧱 Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT tokens with HTTP-only cookies

Password Hashing: bcryptjs

Environment Variables: dotenv

🛠️ API Endpoints
Method	  Endpoint	                            Description
POST	    /admin/login	                        Admin login
POST	    /admin/logout	                        Admin logout
POST	    /admin/players	                      Add a new player (admin only)
GET	      /admin/players	                      Get list of all players (admin)
PUT	      /admin/players/:playerId/payment	    Update player's monthly payment status (admin)