# postharvest-app-backend

## Project Summary
This Postharvest appallows a user to look up information on various fruit and vegetable commodities. The user will be able to log in, search for commodities by name and filter by parameters such as climacteric, respiration class, and temperature category. Admins will have the ability to add and edit commodities. This app is designed for Windham Packaging, LLC, a company that provides specialized packaging for fresh produce. The admins will be myself and the owner, Dr. Elizabeth Marston. This is an evenly-focused full stack application.  


## User Flow
### Routes
#### /auth
 - **POST /auth/token**: Takes username and password from req.body when user tries to log in. Authenticates username and password using User.authenicate and returns a JWT token. Authorization required: none
 - **GET /auth/login**: Takes token generated from /token and verifies it. Throws 401 error if there is an error. Otherwise allows user to proceed. Authorization required: none
 - **POST /auth/register**: Takes { username, password, firstName, lastName, email } from req.body. Returns JWT token which can be used to authenticate further requests. Authorization required: none

#### /users
- **POST /users**: { user }  => { user, token }. Adds a new user. This returns the newly created user and an authentication token for them: {user: { username, firstName, lastName, email, isAdmin }, token }. Authorization required: none
- **GET /users**: { users: [ {username, firstName, lastName, email, jobTitle }, ... ] }. Returns list of all users. Authorization required: admin. (Not implemented currently. Will be used in the future to make a list of users. Admin will be able to patch users, i.e. change user to admin or change password if user is locked out)
- **GET /users/:username**: /[username] => { user }. Returns { username, firstName, lastName, isAdmin, jobTitle }.  Authorization required: admin or same user-as-:username
- **PATCH /users/:username**: /[username] {user} => { user }. Data can include: { firstName, lastName, password, email }. Returns { username, firstName, lastName, isAdmin, jobTitle }.  Authorization required: admin or same user-as-:username. 
- **DELETE /users/:username**: /[username]  =>  { deleted: username }. Authorization required: admin or same user-as-:username. 


#### /commodities
- **POST /commodities**: POST / { commodity }  => { commodity: {id, commodityName, variety, scientificName, coolingMethod, climacteric } Adds a new commodity. This returns the newly created commodity. Authorization required: admin
- **GET /commodities**: GET / => { commodities: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] } Returns list of all commodities. Authorization required: none. 
- **GET /commodities/:id**: GET /[id] => { commodity } Returns { commodity: [ {commodityName, variety, scientificName, coolingMethod, climacteric, ethyleneSensitivity, respirationRate, shelfLife, references, studies, temperatureRecommendations }, ... ] }  
- **PATCH /commodities/:id**:PATCH /[id] { commodity } => { commodity } Data can include: { commodityName, variety, scientificName, coolingMethod, climacteric } Returns { id, commodityName, variety, scientificName, coolingMethod, climacteric }
- **DELETE /commodities/:id**: DELETE /[id]  =>  { deleted: id } Authorization required: admin 


#### /ethylene
- **POST /ethylene**: POST / { commodity }  => { commodity: {id, commodityName, variety, scientificName, coolingMethod, climacteric } Adds a new commodity. This returns the newly created commodity. Authorization required: admin
- **GET /ethylene**: GET /[ethyleneId] => {ethylene} Pass in ethylene id in req.params. Returns  {ethylene: {id: int, commodityId: str, temperature: str, c2h4Production: str, c2h4Class: str}}. Authorization required: none
- **GET /ethylene/commodity/:id**:  GET ethylene/commodity/[commodityId] => [...{ ethylene }]. Returns{
ethylene: [{id: int,commodityId: str,temperature: str,c2h4Production: str,c2h4Class: str}]}. Authorization required: none
- **PATCH /ethylene/:id**:PATCH /[id] { ethylene } => { ethylene } Data can include: { temperature: str,  c2h4Production: str, c2h4Class: str } Returns  { ethylene: { id: int, commodityId: str, temperature: str, c2h4Production: str, c2h4Class: str}} Authorization required: admin
- **DELETE /ethylene/:id**: DELETE /[id]  =>  { deleted: id } Authorization required: admin 

#### /shelfLife
- **POST /shelf-life**: POST / { commodity }  => { commodity: {id, commodityName, variety, scientificName, coolingMethod, climacteric } Adds a new commodity. This returns the newly created commodity. Authorization required: admin
- **GET /shelf-life**: GET / => { commodities: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] } Returns list of all commodities. Authorization required: none. 
- **GET /shelf-life/:id**: GET /[id] => { commodity } Returns { commodity: [ {commodityName, variety, scientificName, coolingMethod, climacteric, ethyleneSensitivity, respirationRate, shelfLife, references, studies, temperatureRecommendations }, ... ] }  
- **PATCH /shelf-life/:id**:PATCH /[id] { commodity } => { commodity } Data can include: { commodityName, variety, scientificName, coolingMethod, climacteric } Returns { id, commodityName, variety, scientificName, coolingMethod, climacteric }
- **DELETE /shelf-life/:id**: DELETE /[id]  =>  { deleted: id } Authorization required: admin 


#### /respiration
- **POST /respiration**: POST / { commodity }  => { commodity: {id, commodityName, variety, scientificName, coolingMethod, climacteric } Adds a new commodity. This returns the newly created commodity. Authorization required: admin
- **GET /respiration**: GET / => { commodities: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] } Returns list of all commodities. Authorization required: none. 
- **GET /respiration/:id**: GET /[id] => { commodity } Returns { commodity: [ {commodityName, variety, scientificName, coolingMethod, climacteric, ethyleneSensitivity, respirationRate, shelfLife, references, studies, temperatureRecommendations }, ... ] }  
- **PATCH /respiration/:id**:PATCH /[id] { commodity } => { commodity } Data can include: { commodityName, variety, scientificName, coolingMethod, climacteric } Returns { id, commodityName, variety, scientificName, coolingMethod, climacteric }
- **DELETE /respiration/:id**: DELETE /[id]  =>  { deleted: id } Authorization required: admin 


#### /temperature
- **POST /temperature**: POST / { commodity }  => { commodity: {id, commodityName, variety, scientificName, coolingMethod, climacteric } Adds a new commodity. This returns the newly created commodity. Authorization required: admin
- **GET /temperature**: GET / => { commodities: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] } Returns list of all commodities. Authorization required: none. 
- **GET /temperature/:id**: GET /[id] => { commodity } Returns { commodity: [ {commodityName, variety, scientificName, coolingMethod, climacteric, ethyleneSensitivity, respirationRate, shelfLife, references, studies, temperatureRecommendations }, ... ] }  
- **PATCH /temperature/:id**:PATCH /[id] { commodity } => { commodity } Data can include: { commodityName, variety, scientificName, coolingMethod, climacteric } Returns { id, commodityName, variety, scientificName, coolingMethod, climacteric }
- **DELETE /temperature/:id**: DELETE /[id]  =>  { deleted: id } Authorization required: admin 


#### /refs
- **POST /ref**: POST / { reference }  => { reference }. Adds a new reference object. This returns the newly created reference data {reference: { commodityId, source} } Authorization required: admin
- **GET /ref**:  GET /[commodityId] => [...{ reference }]. Returns{reference: [{commodityId, source}]} Authorization required: none. 
- **GET /ref/:id**: GET /[commodityId] => [...{ reference }] Returns{reference: [{commodityId, source}]} Authorization required: none. 
- **DELETE /ref/:id**: DELETE /[id]  =>  { deleted: id } Authorization required: admin 


#### /studies
- **DELETE /studies/study**: /[studyId] Delete all entries with studyId from windham_studies_commodities. Authorization required: admin

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

#### Commodity
- **create**: Create a commodity (from data), update db, return new commodity data. Data should be {id, commodityName, variety, scientificName, coolingMethod, climacteric} Returns {id, commodityName, variety, scientificName, coolingMethod, climacteric }
- **findAll**: Find all commodities and filter by commodity_name. Returns [{ commodityName, variety, scientificName, coolingMethod, climacteric }, ...]
- **get** Given a commodity id, return data about commodity. Returns { commodityName, variety, scientificName, coolingMethod, climacteric }
    where ethyleneSensitivity is [...{ id, commodityId, c2h4Productiom, c2h4Class, temperature  }]
    where respirationRate is [...{id, commodityId, rrRate, rrClass, temperature}]
    where shelfLife is [...{id, commodityId, temperature, shelfLife, packaging, descrpiption}]
    where temperatureRecommendations is [...{id, commodityId, minTemp, optimumTemp, description, rh}]
    where studies is [...{id, title, date, source, objective}]
    where refs is [...{commodityId, source}]
Throws NotFoundError if commodity not found.
- **update**: Given an id and data, updates a commodity
- **delete**: removes commodity by id

#### Ethylene
- **create**: Create ethylene sensitivity information (from data), update db, return new ethylene sensitivity data. Data should be {commodityId, temperature, c2h4Production, c2h4Class}. Returns {commodityId, temperature, c2h4Production, c2h4Class}
- **getById** Given an id, return ethylene sensitivity data.  Returns { commodityId, temperature, c2h4Production, c2h4Class, id } Throws NotFoundError if commodity not found.
- **getByCommodity**: Given a commodity id, return all ethylene sensitivty data about commodity. Returns [...{ commodityId, temperature, c2h4Production, c2h4Class, id }] Throws NotFoundError if commodity not found.
- **update**: Given an id, update ethylene sensitivity data. Returns { commodityId, temperature, c2h4Production, c2h4Class, id }
- **delete**: removes ethylene data by id. Returns "deleted" message

#### Respiration
- **create**: Create respiration rate information (from data), update db, return new respiration rate data. Data should be {commodityId, temperature, rrRate, rrClass}. Returns {id, commodityId, temperature, rrRate, rrClass}. Respiration rate is in units mm x kg x hr. Temperature is in celsius
- **getById**  Given an id, return respiration rate data. Returns {id, commodityId, temperature, rrRate, rrClass} Throws NotFoundError if commodity not found.
- **getByCommodity**: Given a commodity id, return all respiration rate data about commodity. Returns [...{ id, commodityId, temperature, rrRate, rrClass }] Throws NotFoundError if commodity not found.
- **update**: Given an id, return new respiration rate data. Data should be {commodityId, temperature, rrRate, rrClass} Returns {id, commodityId, temperature, rrRate, rrClass}	Respiration rate is in units mm * kg * hr Temperature is in celsius**/
- **delete**: removes respiration data by id. Returns "deleted" message

#### References
- **create**: Create reference information (from data), update db, return new reference data. Data should be {commodityId, source}. Returns {commodityId, source}

- **getByCommodity**: Given a commodity id, return all reference data about commodity. Returns [...{ commodityId, source }] Throws NotFoundError if commodity not found.

- **remove**: Given a commodityId and a source, removes reference.





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



