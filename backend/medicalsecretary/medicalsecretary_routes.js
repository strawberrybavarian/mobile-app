const MSController = require ('./medicalsecretary_controller');
// const { validationResult } = require('express-validator');
console.log("Medical Secretary routes connected");
module.exports = app => { 
    app.get('/medsecretary/api/test',(req,res)=>{res.json({message:"the api is working"})});
    //For Registration
    app.post('/medsecretary/api/signup', MSController.NewMedicalSecretaryignUp);
 
    // //For LogIn
    // app.get('/doctor/api/alldoctor', MSController.findAllDoctors);

    // //For Post
    // app.post('/doctor/api/addpost/:id', MSController.addNewPostById);
    // app.get('/doctor/api/finduser/:id', MSController.findDoctorById);
    // app.get('/doctor/api/post/getallpost/:id', MSController.getAllPostbyId);
    // app.delete('/doctor/api/post/deletepost/:id/:index', MSController.findPostByIdDelete);
    // app.put('/doctor/api/post/updatepost/:id/:index', MSController.updatePostAtIndex);
}
