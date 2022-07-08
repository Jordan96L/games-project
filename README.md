# Games API

## Link to hosted API

https://my-games-app1.herokuapp.com/api

## Project summary

This API has been created to supply a front-end application with data regarding games and their sub information such as reviews and comments.
To try out the API just click the link under "Link to hosted API" and here you can find details for each available endpoint.

## Local setup instructions

1. ### Clone the repo
   ```
   git clone https://github.com/Jordan96L/games-project.git
   ```
2. ### Install npm packages
   ```
   npm install
   ```
3. ### Setup local postgres databases

   ```
   npm run setup-dbs
   ```

4. ### Seed the databases
   ```
   npm run seed
   ```
5. ### Run tests with
   ```
   npm test
   ```

## Adding Environment Variables

You must create your own development.env and test.env files and inside each file you must add PGDATABASE=<database_name_here>.

## Minimum versions of software

Node.JS: 17.1.0 PostgreSQL: 14.2

Not tested on earlier versions
