major libraries/frameworks used:-

Express: Express is a popular Node.js web application framework that provides a robust set
of features for web and mobile applications. It is used to handle routing, middleware, and
other server-side functionality.

MySQL: MySQL is a popular open-source relational database management system (RDBMS) that is
used to store and retrieve data. It is commonly used with Node.js applications due to its 
ease of use and support for multiple programming languages.

Multer: Multer is a middleware that is used to handle file uploads in Node.js. It allows you
to easily handle the process of accepting file uploads from users, including handling 
file validation and storage.

Body-parser: Body-parser is a middleware that is used to parse the incoming request body
and make it available as a JavaScript object. It is commonly used to handle JSON and 
URL-encoded form data in Express applications.

API ENDPOINTS:-

POST /patient: This endpoint is used to register a new patient. 
It accepts a multipart/form-data request with the following fields:
name, address, email, phone, password, psychiatrist_id, and photo.
It validates the email and phone number and returns an error if they are invalid.
If all the fields are valid, it stores the patient's information in the MySQL database
and returns a success message.

GET /psychiatrists/:hospitalId: This endpoint is used to retrieve a list of psychiatrists and patient
count for a given hospital id. It accepts a hospital id as a path parameter and returns the 
hospital name, total number of psychiatrists and total number of patients, a list of psychiatrists 
with their name and total number of patients they have. It returns a 404 error if no data found 
for the given hospital id.