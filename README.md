# postharvest-app-backend

## Project Summary

## User Flow
### Routes
user must include { username, password, firstName, lastName, email }
 - POST /auth/token: Takes username and password from req.body when user tries to log in. Authenticates username and password using Usr.authenicate and returns a JWT token. Authorization required: none
 - GET /auth/login: Takes token generated from /token and verifies it. Throws 401 error if there is an error. Otherwise allows user to proceed. Authorization required: none
 - POST /auth/register: Takes { username, password, firstName, lastName, email } from req.body. Returns JWT token which can be used to authenticate further requests. Authorization required: none

#### /auth
#### /auth
#### /auth
#### /auth

## Middleware
- 

 ## Data model
 #### User
 - **authenticate**

## API
- I made my own API using the research I have done as a Postharvest Specialist as well as the UC Davis Postharvest Database and USDA Handbook 66.
- https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/
- https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf

## Back-end Schema
![Screenshot](Postharvest-App-Schema.png)


