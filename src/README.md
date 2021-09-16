# myBank
#### Applications for storing information on deposits of bank clients.
### How to run?
##### 1. Set environment variables:
 - **PORT** - on this port will started the http server;
 - **COURSES_PATH** - url for getting current exchange rates;
 Locally i used the `.env` file in the root folder.

##### 2-1. Locally:
- `npm i`
- `npm run start`

##### 2-2. Docker container:
- open command prompt
- go to the root directory
- `docker build -t mybank .`
- `docker run -it -p 8080:8080 mybank`

##### 3. How to use endpoints?
- Just see the **Postman collection** in the **Postman** folder.