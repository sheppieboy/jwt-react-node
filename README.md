This project creates an api for logging a user in and deleting a user, etc. It uses json web tokens to verify a user and has expiring access tokens that are replaced by refresh tokens for extrea security. It uses react on the client side to create a simple form that allows a user to login, the user has already been added ina fake database in the form of fake data.

Once logged in the user can delete only the appropriate user (itself, unless an admin). The project was used to practice making an api with express and using jwt for authentication purposes + sending and recieving jwt tokens from the back and frontend.

The project used

- javascript
- Node
- express
- jwt
- axios
