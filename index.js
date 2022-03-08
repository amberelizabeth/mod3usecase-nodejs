'use strict';

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.urlencoded({extended: false})); 
app.use(express.json()); 
app.use(morgan(':method :url :status - :response-time ms'));

let students = [
    {id: 1001, name: "Billy Bob", section: "Computer Science", gpa: 4.0, nationality: "Canadian"},   
    {id: 1002, name: "Jane Doe", section: "Business", gpa: 3.0, nationality: "Australian"},
    {id: 1003, name: "Billy Bob", section: "Arts", gpa: 4.0, nationality: "Chinese"}
];


app.get('/', function(req,res){
    console.log(`Test num: ${res.app.locals.testNum}`);
    res.send(students);
});

app.get('/:student_id', function(req,res){
    let studentId = parseInt(req.params.student_id);

    //identify a student by getting their array index
    let studentIndex = students.findIndex(function(s){
        return s.id === studentId;
    });

    let updatedStudent = req.body;
    students[studentIndex] = updatedStudent; 
    res.send(students);
});

app.put('/:student_id', function(req,res){

    let studentId = parseInt(req.params.student_id);

    //identify a student by getting their array index
    let studentIndex = students.findIndex(function(s){
        return s.id === studentId;
    });

    let updatedStudent = req.body;
    students[studentIndex] = updatedStudent; 

    res.redirect('/'); //Redirect to the GET route
});

app.patch('/:student_id', function(req,res){
    //get the student id from the url
    let studentId = parseInt(req.params.student_id);

    //identify a student by getting their array index
    let studentIndex = students.findIndex(function(s){
        return s.id === studentId;
    });

    let newName = req.body.name;
    students[studentIndex].name = newName; //Updating the name property

    res.redirect('/'); //Redirect to the GET route
});

app.delete('/:student_id', function(req,res){
    //get the student id from the url
    let studentId = parseInt(req.params.student_id);

    //identify a student by getting their array index
    let studentIndex = students.findIndex(function(s){
        return s.id === studentId;
    });
    
    students.splice(studentIndex, 1); //Deleting record

    res.redirect('/'); //Redirect to the GET route
});

app.post('/', function(req,res){
    let newStudent = req.body;
    students.push(newStudent);
    res.redirect('/'); //redirect to the GET route
});

app.listen(3000, function(){
    app.locals.testNum = 0;
    console.log('Server listening on port 3000....');
});
