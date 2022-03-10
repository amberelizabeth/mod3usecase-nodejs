const express = require('express');
//const morgan = require('morgan');
const app = express();

app.use(express.urlencoded({extended: false})); 
app.use(express.json()); 
//app.use(morgan(':method :url :status - :response-time ms'));

let students = [
    {id: 1001, name: "Billy Bob", section: "2A", gpa: 4.0, nationality: "Canadian"},   
    {id: 1002, name: "Jane Doe", section: "2B", gpa: 3.0, nationality: "Australian"},
    {id: 1003, name: "Billy Bob", section: "1A", gpa: 4.0, nationality: "Chinese"}
];

const routeTracker = function(req, res, next){
    // switch( req.method ){
    //     case "GET":
    //         if(req.body.id !== undefined){
    //             app.locals.getStudentsID += 1;
    //         }
    //         if(req.body.section !== undefined){
    //             app.locals.getStudentsSection += 1;
    //         }
    //         if(!req.body.id && !req.body.section){
    //             app.locals.getStudents += 1;
    //         }
    //         break;
    //     case "POST":
    //         app.locals.postStudent += 1;
    //         break;
    //     case "PATCH":
    //         app.locals.updateStudent += 1;
    //         break;
    //     case "DELETE":
    //         app.locals.deleteStudent += 1;
    //         break;
    //     default:
    //         console.log("NONE");
    // }

    // console.log(`\nGET:            ${app.locals.getStudents}`);
    // console.log(`GET by ID:      ${app.locals.getStudentsID}`);
    // console.log(`GET by Section: ${app.locals.getStudentsSection}`);
    // console.log(`POST:           ${app.locals.postStudent}`);
    // console.log(`UPDATE:         ${app.locals.updateStudent}`);
    // console.log(`DELETE:         ${app.locals.deleteStudent}`);
    next();
}

// GET all students
app.get('/', routeTracker, (req,res)=>{
    res.status(200).send(students);
});


// GET student by student id parameter
app.get('/find-id/:student_id', routeTracker, (req,res)=>{
    let studentId = parseInt(req.params.student_id);

    if(studentId){
        //identify a student by getting their array index
        let studentIndex = students.findIndex((s)=>{
            return s.id === studentId;
        });

        console.log(studentId);
        console.log(studentIndex);

        if(studentIndex >= 0){
            res.status(200).send(students[studentIndex]);
        }else {
            res.status(404).send("No student exists with this id.");
        }
    }else {
        res.status(400).send("Invalid student id parameter");
    }
});


// GET student by section parameter
app.get('/find-section/:section', routeTracker, (req,res)=>{
    let studentSection = req.params.section;

    if(studentSection){
        const currentStudent = students.find((element)=>{
            if(element.section === req.params.section){
                return true;
            }
        });
        if(currentStudent){
            res.status(200).send(currentStudent);
        }else{
            res.status(404).send('No student exists in this section.');
        }
    }else {
        res.status(404).send('Invalid student section parameter.')
    }    
});


// UPDATE student by student ID parameter
app.patch('/:student_id', routeTracker, (req,res)=>{
    //get the student id from the url
    let studentId = parseInt(req.params.student_id);

    //identify a student by getting their array index
    let studentIndex = students.findIndex(function(s){
        return s.id === studentId;
    });

    let newName = req.body.name;
    students[studentIndex].name = newName; //Updating the name property

    res.status(200).send('/'); //Redirect to the GET route
});


// DELETE student by student ID parameter
app.delete('/:student_id', routeTracker, (req,res)=>{
    //get the student id from the url
    let studentId = parseInt(req.params.student_id);

    //identify a student by getting their array index
    let studentIndex = students.findIndex((s)=>{
        return s.id === studentId;
    });
    
    students.splice(studentIndex, 1); //Deleting record

    res.status(200).send(students); //send new list
});


// ADD student
app.post('/', routeTracker, (req,res)=>{
    let nextID = parseInt(students[students.length-1]['id']) + 1;
    const student = {
        id: nextID,
        name: req.body.name,
        gpa: req.body.gpa,
        section: req.body.section,
        nationality: req.body.nationality
    }
    students.push(student);
    res.status(200).send(student);
});

app.listen(3000, ()=>{
    app.locals.getStudents = 0;
    app.locals.getStudentsID = 0;
    app.locals.getStudentsSection = 0;
    app.locals.postStudent = 0;
    app.locals.updateStudent = 0;
    app.locals.deleteStudent = 0;
    console.log('Server listening on port 3000....');
});
