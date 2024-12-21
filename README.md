# authentication-template

npm init -y
npm install express express-session pg passport passport-local ejs
npm install bcryptjs

1) change the database name in pool.js (line-4)
2) change the database name in populatedb.js
3) check to make sure my table & columns in database match what im using in POSTsign-up controller
4) " " same as step 3 but with passport.js
5) 

prisma 
1) npm install prisma @prisma/client
2) npx prisma init
3) npx prisma migrate dev --name init

multer middleware (uploading files)
1) npm install multer