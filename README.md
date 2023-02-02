# postharvest-app-backend

## Project Summary

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
#### /auth
#### /auth
#### /auth

## Middleware
- 

 ## Data model
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

## Back-end Schema
![Screenshot](Postharvest-App-Schema.png)


