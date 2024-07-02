const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DoctorController = require('./doctor_controller');
console.log("Doctor routes connected");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = app => {
  app.get('/doctor/api/test', (req, res) => { res.json({ message: "the api is working" }) });
  // For Registration
  app.post('/doctor/api/signup', DoctorController.NewDoctorSignUp);

  // For LogIn
  app.get('/doctor/api/alldoctor', DoctorController.findAllDoctors);
  //Update Information Details
  app.put('/doctor/api/:id/updateDetails', DoctorController.updateDoctorDetails);
  // For Post
  app.post('/doctor/api/addpost/:id', DoctorController.addNewPostById);
  app.get('/doctor/api/finduser/:id', DoctorController.findDoctorById);
  app.get('/doctor/api/post/getallpost/:id', DoctorController.getAllPostbyId);
  app.delete('/doctor/api/post/deletepost/:id/:index', DoctorController.findPostByIdDelete);
  app.put('/doctor/api/post/updatepost/:id/:index', DoctorController.updatePostAtIndex);

  // For Appointments
  app.get('/doctor/appointments/:doctorId', DoctorController.getAllAppointments);
  app.put('/doctor/api/:uid/completeappointment', DoctorController.completeAppointment)

  // Uploading Image
  app.post('/doctor/api/:id/updateimage', upload.single('image'), DoctorController.updateDoctorImage);

  //For Prescription
  app.post('/doctor/api/createPrescription/:patientId/:appointmentId', DoctorController.createPrescription);
  app.get('/doctor/api/getPrescriptions/:doctorId', DoctorController.getPrescriptionsByDoctor);

  //Getting All Patients
  app.get('/doctor/api/getallpatients/:doctorId', DoctorController.getPatientsByDoctor);

};
