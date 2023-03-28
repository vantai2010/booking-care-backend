const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const doctorController = require('../controllers/doctorController')
const patientController = require('../controllers/patientController')
const specialtyController = require('../controllers/specialtyController')
const clinicController = require('../controllers/clinicController')

router.post('/auth/login', userController.handleLogin)
router.post('/auth/register', userController.handleRegister)

router.get('/get-all-users/:id', userController.handleGetAllUsers)
router.post('/create-new-user', userController.handleCreateNewUser)
router.put('/update-user', userController.handleUpdateUser)
router.delete('/delete-user', userController.handleDeleteUser)
router.get('/allcode', userController.getAllCode)


router.get('/top-doctor-home', doctorController.getTopDoctorHome)
router.get('/get-all-doctors', doctorController.getAllDoctors)
router.post('/save-infor-doctor', doctorController.postInforDoctor)
router.get('/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
router.post('/bulk-create-schedule', doctorController.bulkCreateSchedule)
router.get('/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate)
router.get('/get-infor-doctor-by-id', doctorController.getInforDoctorById)
router.get('/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
router.get('/get-list-patient', doctorController.getListPatient)
router.post('/send-remedy', doctorController.sendRemedy)

router.post('/patient-book-appoinment', patientController.postBookAppointment)
router.post('/verify-book-appoinment', patientController.confirmBookAppointment)

router.post('/create-new-specialty', specialtyController.createNewSpecialty)
router.get('/get-all-specialty', specialtyController.getAllSpecialty)
router.get('/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

router.post('/create-new-clinic', clinicController.createNewClinic)
router.get('/get-all-clinic', clinicController.getAllClinic)
router.get('/get-detail-by-id-clinic', clinicController.getDetailClinicById)

module.exports = router