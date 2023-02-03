# postharvest-app-backend

## Project Summary
This Postharvest appallows a user to look up information on various fruit and vegetable commodities. The user will be able to log in, search for commodities by name and filter by parameters such as climacteric, respiration class, and temperature category. Admins will have the ability to add and edit commodities. This app is designed for Windham Packaging, LLC, a company that provides specialized packaging for fresh produce. The admins will be myself and the owner, Dr. Elizabeth Marston. This is an evenly-focused full stack application.  


## User Flow
### Routes
#### /auth
 - **POST /auth/token**: Takes username and password from req.body when user tries to log in. Authenticates username and password using Usr.authenicate and returns a JWT token. Authorization required: none
 - **GET /auth/login**: Takes token generated from /token and verifies it. Throws 401 error if there is an error. Otherwise allows user to proceed. Authorization required: none
 - **POST /auth/register**: Takes { username, password, firstName, lastName, email } from req.body. Returns JWT token which can be used to authenticate further requests. Authorization required: none

#### /users
- **POST /users**: { user }  => { user, token }. Adds a new user. This returns the newly created user and an authentication token for them: {user: { username, firstName, lastName, email, isAdmin }, token }. Authorization required: none
- **GET /users**: { users: [ {username, firstName, lastName, email, jobTitle }, ... ] }. Returns list of all users. Authorization required: admin
- **GET /users/:username**: /[username] => { user }. Returns { username, firstName, lastName, isAdmin, jobTitle }.  Authorization required: admin or same user-as-:username
- **PATCH /users/:username**: /[username] {user} => { user }. Data can include: { firstName, lastName, password, email }. Returns { username, firstName, lastName, isAdmin, jobTitle }.  Authorization required: admin or same user-as-:username. 
- **DELETE /users/:username**: /[username]  =>  { deleted: username }. Authorization required: admin or same user-as-:username. 
#### /commodities
#### /ethylene
#### /shelfLife
#### /respiration
#### /temperature
#### /refs
#### /studies

### Middleware
- Uses *morgan*, HTTP request logger middleware for node.js
- Uses *jsonwebtoken* to verify tokens
- **authenticateJWT**: If a token was provided, verify it, and, if valid, store the token payload on res.locals (this will include the username and isAdmin field.). Does not throw error if no token was provided or if the token is not valid.
- **ensureLoggedIn**:  Middleware to use when user must be logged in. If not, raises Unauthorized error
- **ensureAdmin**: Middleware to use when they be logged in as an admin user. If not, raises Unauthorized error
- **ensureCorrectUserOrAdmin**:  Middleware to use when they must provide a valid token & be user matching username provided as route param. If not, raises Unauthorized error.

 ## Data model
 ### Schema
![Screenshot](Postharvest-App-Schema.png)
 #### User
 - **authenticate**: authenticate user with username, password. Returns { username, first_name, last_name, email, is_admin }. Throws UnauthorizedError is user not found or wrong password.
 - **register**: Register user with data { username, firstName, lastName, email, jobTitle, isAdmin=false }. Returns { username, firstName, lastName, email, isAdmin }.Throws BadRequestError on duplicates.
 - **findAll**: Find all users. Returns [{ username, first_name, last_name, email, is_admin }, ...]. 
 - **get**: Given a username, return data about user. Returns { username, first_name, last_name, is_admin, jobTitle, email }. Throws NotFoundError if user not found.
 - **update**:  Update user data with `data`. This is a "partial update" --- it's fine if data doesn't contain all the fields; this only changes provided ones. Data can include: { firstName, lastName, password, email, isAdmin, jobTitle }. Returns { username, firstName, lastName, email, jobTitle, isAdmin } *WARNING: this function can set a new password or make a user an admin.*
 - **remove**: Delete given user from database; returns undefined.

## API
- I made my own API using the research I have done as a Postharvest Specialist as well as the UC Davis Postharvest Database and USDA Handbook 66.
- https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/
- https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf



## Tech Stack
- Node.js
- PostgresQL
- Express

## Testing
- Jest
- 



