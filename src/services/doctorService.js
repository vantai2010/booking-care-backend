
const db = require('../models/index')
const { isIdExist } = require('./userService.js')
const emailService = require('./emailService.js')
const _ = require('lodash')
require('dotenv').config()
const moment = require('moment')
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

const getTopDoctorHome = (limit, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            if (!users) {
                resolve({
                    errCode: 1,
                    messageEN: "No users found !!!",
                    messageVI: "Không tìm thấy người dùng nào !!!"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get list user successfully !!!",
                    messageVI: "Lấy danh sách người dùng thành công !!!",
                    users
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            if (!doctors || doctors.length === 0) {
                resolve({
                    errCode: 1,
                    messageEN: "Not found doctor !!!",
                    messageVI: "Không tìm thấy bác sĩ nào !!!"
                })
            }

            resolve({
                errCode: 0,
                messageEN: "Select list doctors successfully !!!",
                messageVI: "Lấy danh sách bác sĩ thành công !!!",
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

const postInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // upsert to markdown table
            if (data.action === 'ADD') {
                let response = await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId
                })
                if (!response) {
                    resolve({
                        errCode: 1,
                        messageEN: "Add doctor's information  failure !!!",
                        messageVI: "Thêm thông tin bác sĩ thất bại !!!"
                    })
                }
                resolve({
                    errCode: 0,
                    messageEN: "Add doctor's infromation successfully !!!",
                    messageVI: "Thêm thông tin bác sĩ thành công !!!"
                })
            } else if (data.action === 'EDIT') {
                let doctor = await db.Markdown.findOne({
                    where: { doctorId: +data.doctorId }
                })
                if (doctor) {
                    doctor.contentHTML = data.contentHTML
                    doctor.contentMarkdown = data.contentMarkdown
                    doctor.description = data.description
                    let check = await doctor.save()
                    if (check) {
                        resolve({
                            errCode: 0,
                            messageEN: "Update information successfully !!!",
                            messageVI: "Cập nhật thông tin người dùng thành công !!!"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Update information failure !!!",
                            messageVI: "Cập nhật thông tin thất bại !!!"
                        })
                    }
                }
            }

            //upsert to doctor_infor table
            let doctorInfor = await db.Doctor_Infor.findOne({
                where: { doctorId: +data.doctorId }
            })
            if (doctorInfor) {
                //update
                doctorInfor.priceId = data.selectedPrice
                doctorInfor.paymentId = data.selectedPayment
                doctorInfor.provinceId = data.selectedProvince
                doctorInfor.nameClinic = data.nameClinic
                doctorInfor.addressClinic = data.addressClinic
                doctorInfor.note = data.note
                doctorInfor.specialtyId = data.selectedSpecialty
                doctorInfor.clinicId = data.selectedClinic
                await doctorInfor.save()
            } else {
                //create
                await db.Doctor_Infor.create({
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    paymentId: data.selectedPayment,
                    provinceId: data.selectedProvince,
                    nameClinic: data.nameClinic,
                    addressClinic: data.addressClinic,
                    note: data.note,
                    specialtyId: data.selectedSpecialty
                })
            }


        } catch (error) {
            reject(error)
        }
    })
}

const getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await isIdExist(id)
            if (!check) {
                resolve({
                    errCode: 1,
                    messageEN: "ID doctor isn't exist !!!",
                    messageVI: "Bác sĩ này không tồn tại !!!"
                })
            } else {

                let doctor = await db.User.findOne({
                    where: { id: +id },
                    attributes: { exclude: ['password', 'roleId', 'gender', 'positionId'] },
                    include: [
                        { model: db.Markdown, as: 'markdownData', attributes: ['contentHTML', "contentMarkdown", "description"] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueVi', "valueEn"] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', "valueEn"] },
                        { model: db.Allcode, as: 'roleData', attributes: ['valueVi', "valueEn"] },
                        {
                            model: db.Doctor_Infor, as: 'doctorInforData', attributes: { exclude: ['id', "doctorId", "createdAt", "updatedAt"] },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueVi', "valueEn"] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', "valueEn"] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', "valueEn"] }
                            ]
                        }
                    ],
                    nest: true
                })
                if (!doctor) {
                    resolve({
                        errCode: 1,
                        messageEN: "Get doctor's information failure !!!",
                        messageVI: "Lấy thông tin bác sĩ thất bại !!!",
                        data: {}
                    })
                }

                if (doctor && doctor.image) {
                    doctor.image = new Buffer(doctor.image, "base64").toString('binary')
                }
                resolve({
                    errCode: 0,
                    messageEN: "Get doctor's information successfully !!!",
                    messageVI: "Lấy thông tin bác sĩ thành công !!!",
                    data: doctor
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    messageEN: "Missing required param !!!",
                    messageVI: "Thiếu trường thông tin !!!"
                })
            }
            let schedule = data.arrSchedule

            if (schedule && schedule.length > 0) {
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE
                    return item
                })
            }

            let existing = await db.Schedule.findAll({
                where: { doctorId: +data.doctorId, date: data.date },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
            })

            //check different to get item unique from to request
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date
            })

            //create data
            if (toCreate && toCreate.length > 0) {
                let check = await db.Schedule.bulkCreate(toCreate)
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Send schedule successfully !!!",
                        messageVI: "Thêm lịch khám thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Send schedule failure !!!",
                        messageVI: "Thêm lịch khám thất bại !!!"
                    })
                }
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Send schedule successfully !!!",
                    messageVI: "Thêm lịch khám thành công"
                })
            }




        } catch (error) {
            reject(error)
        }
    })
}

const getScheduleDoctorByDate = ({ doctorId, date }) => {
    return new Promise(async (resolve, reject) => {
        try {

            date = moment(+date).format('YYYY-MM-DD')
            console.log(date)
            let data = await db.Schedule.findAll({
                where: { doctorId: +doctorId, date: date },
                include: [
                    { model: db.Allcode, as: 'timeTypeData', attributies: ['valueEn', 'valueVi'] },
                    { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                ]
            })
            if (!data) {
                data = []
            }
            resolve({
                errCode: 0,
                data: data
            })

        } catch (error) {
            reject()
        }
    })
}

const getInforDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Doctor_Infor.findOne({
                where: { doctorId: +id },
                attributes: { exclude: ['id', 'doctorId'] },
                include: [
                    { model: db.Allcode, as: 'priceData', attributes: ['valueVi', "valueEn"] },
                    { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', "valueEn"] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', "valueEn"] }
                ]
            })
            if (!data) {
                resolve({
                    errCode: 1,
                    messageEN: "Get data form db failure !!!",
                    messageVI: 'Lấy data thất bại !!!',
                    data: {}
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get data form db successfully !!!",
                    messageVI: 'Lấy data thành công !!!',
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

const getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: +doctorId },
                attributes: { exclude: ['password', 'roleId', 'gender', 'positionId'] },
                include: [
                    { model: db.Markdown, as: 'markdownData', attributes: ["description"] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueVi', "valueEn"] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', "valueEn"] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueVi', "valueEn"] },
                    {
                        model: db.Doctor_Infor, as: 'doctorInforData', attributes: { exclude: ['id', "doctorId", "createdAt", "updatedAt"] },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueVi', "valueEn"] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', "valueEn"] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', "valueEn"] }
                        ]
                    }
                ],
                nest: true
            })
            if (!doctor) {
                resolve({
                    errCode: 1,
                    messageEN: "Get doctor's information failure !!!",
                    messageVI: "Lấy thông tin bác sĩ thất bại !!!",
                    data: {}
                })
            }

            if (doctor && doctor.image) {
                doctor.image = new Buffer(doctor.image, "base64").toString('binary')
            }
            resolve({
                errCode: 0,
                messageEN: "Get doctor's information successfully !!!",
                messageVI: "Lấy thông tin bác sĩ thành công !!!",
                data: doctor
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getListPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.Booking.findAll({
                where: { doctorId: +data.doctorId, date: data.date, statusId: 'S2' },
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ["email", 'firstName', 'lastName', 'address', 'phoneNumber'],
                        include: [{ model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }]
                    },
                    { model: db.Allcode, as: 'timeData', attributes: ['valueEn', 'valueVi'] }
                ],
                nest: true
            })
            if (patient) {
                resolve({
                    errCode: 0,
                    messageEN: "Get list Patient successfully !!!",
                    message: "Lấy thông tin bênh nhân thành công !!!",
                    data: patient
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get list Patient failure !!!",
                    message: "Lấy thông tin bênh nhân thất bại !!!",
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let appoinment = await db.Booking.findOne({
                where: {
                    doctorId: +data.doctorId,
                    patientId: +data.patientId,
                    timeType: data.timeType,
                    statusId: 'S2'
                }
            })
            if (appoinment) {
                appoinment.statusId = 'S3'
                await appoinment.save()
                resolve({
                    errCode: 0,
                    messageEN: "Send Remedy successfully !!!",
                    messageVI: "Gửi hóa đơn thành công !!!"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Send Remedy successfully !!!",
                    messageVI: "Gửi hóa đơn thất bại !!!"
                })
            }

            await emailService.sendAttachment(data)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getInforDoctorById,
    getProfileDoctorById,
    getListPatient,
    sendRemedy,
}