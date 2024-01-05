// // Import express.js
// const express = require("express");

// // Create express app
// var app = express();

// // Add static files location
// app.use(express.static("static"));

// // Get the functions in the db.js file to use
// const db = require('./services/db');

// // Create a route for root - /
// app.get("/", function(req, res) {
//     res.send("hello");
// });

// // Create a route for testing the db
// app.get("/db_test", function(req, res) {
//     // Assumes a table called test_table exists in your database
//     sql = 'select * from tasks';
//     db.query(sql).then(results => {
//         console.log(results);
//         res.send(results)
//     });
// });

// // Create a route for /goodbye
// // Responds to a 'GET' request
// app.get("/goodbye", function(req, res) {
//     res.send("Goodbye world!");
// });

// // Create a dynamic route for /hello/<name>, where name is any value provided by user
// // At the end of the URL
// // Responds to a 'GET' request
// app.get("/hello/:name", function(req, res) {
//     // req.params contains any parameters in the request
//     // We can examine it in the console for debugging purposes
//     console.log(req.params);
//     //  Retrieve the 'name' parameter and use it in a dynamically generated page
//     res.send("Hello " + req.params.name);
// });

// // Start server on port 3000
// app.listen(3000,function(){
//     console.log(`Server running at http://127.0.0.1:3000/`);
// });

// Import express.js
// Import express.js
// Import express.js
const express = require("express");


// Create express app
let userCredentials = {};

const app = express();


// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for /tasks
app.get("/tasks", function(req, res) {
    // Assumes a table called db_test exists in your database
    const { username, password } = userCredentials;
    const sql = 'SELECT tasks.user_id, user_names.user_name, tasks.task_start_date, tasks.task_name, tasks.monday, tasks.tuesday, tasks.wednesday, tasks.thursday, tasks.friday, tasks.saturday, tasks.sunday FROM tasks JOIN user_names ON tasks.user_id = user_names.user_id WHERE user_names.user_name = ?';

    db.query(sql ,[username]).then(results => {
        // Render the 'tasks.pug' view and pass the results as data
        res.render('tasks', { title: 'Tasks Table', results: results });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error: ' + error.message);
    });
});


app.get("/meetings", function(req, res) {
    // Assumes a table called db_test exists in your database
    const { username, password } = userCredentials;
    const sql = 'SELECT meetings.user_id, user_names.user_name, meetings.meeting_name, meetings.meeting_time FROM meetings JOIN user_names ON meetings.user_id = user_names.user_id where user_names.user_name = ?';

    db.query(sql,[username]).then(results => {
        // Render the 'tasks.pug' view and pass the results as data
        res.render('meetings', { title: 'Meetings Table', results: results });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error: ' + error.message);
    });
});

app.get("/home", function(req, res) {
    res.render('home', { title: 'Habit Tracker' });
});

app.get("/", function(req, res) {
    res.render('login', { title: 'Habit Tracker' });
});

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     // Here, you can add any authentication logic or directly render the page with the entered credentials
//     res.render('loggedin', { username, password });
// });

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Store credentials in the global variable
    userCredentials = { username, password };

    // Render the proceed.pug template
    const sql = 'SELECT * FROM login_table WHERE user_name = ? AND password = ?';

    db.query(sql, [username, password]).then(results => {
    // Check the number of rows in the results
    const numRows = results.length;

    if (numRows === 1) {
        // Render the 'home.pug' view if there is one row
        res.render('home', { title: 'Home Page', user: results[0] });
    } else {
        // Render the 'login.pug' view again if there are zero or multiple rows
        res.render('login', { error: 'Invalid username or password' });
    }
}).catch(error => {
    console.error(error);
    res.status(500).send('Internal Server Error: ' + error.message);
});
});

app.get('/proceed', (req, res) => {
    // Access the stored credentials from the global variable
    const { username, password } = userCredentials;

    // Render the proceed.pug template with the stored credentials
    res.render('proceed', { username });
});

app.get('/results', (req, res) => {
    // Access the stored username from the global variable
    const { username, password } = userCredentials;

    // Run the SQL query to fetch data from the login_table with a parameterized query
    const sql = 'SELECT * FROM login_table WHERE user_name = ? and password = ?';

    db.query(sql, [username,password]).then(results => {
    // Render the 'results.pug' view and pass the results as data
    res.render('meetings', { title: 'Results Table', results: results });
    }).catch(error => {
    console.error(error);
    res.status(500).send('Internal Server Error: ' + error.message);
});

});

app.get('/addTask', (req, res) => {
    // Access the stored credentials from the global variable
    const { username, password } = userCredentials;

    // Render the proceed.pug template with the stored credentials
    res.render('addTask');
});

app.post('/addTask', async (req, res) => {
    try {
      const { task_name, task_start_date, user_id ,monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body;

      // Run the SQL query to insert the new task into the tasks table
      const sql = 'INSERT INTO tasks (task_name, task_start_date, user_id,monday, tuesday, wednesday, thursday, friday, saturday, sunday) VALUES (?, ?, ?,?,?,?,?,?,?,?)';
      await db.query(sql, [task_name, task_start_date, user_id,,monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

      res.redirect('/tasks'); // Redirect to a page showing all tasks or any other desired page
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
  });


  app.get('/removeTask', (req, res) => {
    // Access the stored credentials from the global variable
    const { username, password } = userCredentials;

    // Render the proceed.pug template with the stored credentials
    res.render('removeTask');
});

app.post('/removeTask', async (req, res) => {
    try {
      const { task_name, task_start_date, user_id } = req.body;

      // Run the SQL query to insert the new task into the tasks table
      const sql = 'DELETE  FROM tasks WHERE task_name = ? and task_start_date = ? and user_id = ? ';
      await db.query(sql, [task_name, task_start_date, user_id]);

      res.redirect('/tasks'); // Redirect to a page showing all tasks or any other desired page
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
  });

  app.get("/profile", function(req, res) {
    // Assumes a table called db_test exists in your database
    const { username, password } = userCredentials;
    const sql = 'SELECT * FROM profile where Name = ?'
    db.query(sql ,[username]).then(results => {
        // Render the 'tasks.pug' view and pass the results as data
        res.render('profile', { title: 'Profile Details', results: results });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error: ' + error.message);
    });
});











// ... (other routes)

// Start server on port 3000
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
