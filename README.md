<h1>Features Implemented</h1>
<ul>
  <li><strong>Single Admin User Authentication</strong>
    <ul>
      <li>Admin login and logout using JWT tokens stored in HTTP-only cookies.</li>
      <li>Auto-creation of default admin account on server startup using environment variable password.</li>
      <li>Admin-only access to protected routes.</li>
    </ul>
  </li>
  <li><strong>Player Management</strong>
    <ul>
      <li>Admin can add new players with player ID, name, email, phone number, and fees.</li>
      <li>Player data stored in MongoDB.</li>
      <li>Players do not have login access; managed solely by admin.</li>
    </ul>
  </li>
  <li><strong>Monthly Payment Tracking</strong>
    <ul>
      <li>Each player has payment status for every month (Jan to Dec).</li>
      <li>Admin can update and track monthly fee payments.</li>
      <li>Retrieve all players with their payment status.</li>
    </ul>
  </li>
  <li><strong>Backend Setup</strong>
    <ul>
      <li>Node.js and Express backend with MongoDB connection.</li>
      <li>Code organized with models, controllers, routes, and middleware.</li>
      <li>Secure password hashing with bcrypt.</li>
      <li>Error handling via async middleware wrappers.</li>
    </ul>
  </li>
</ul>
