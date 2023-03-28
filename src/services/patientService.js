const db = require('../models/index')
const emailService = require('./emailService')
require('dotenv').config()
const { v4 } = require('uuid')


let buildUlrEmail = (token, doctorId) => {
    let result = ''
    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let token = v4()
            let [user, notExist] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender
                }
            })
            if (user) {
                let check = await db.Booking.findOrCreate({
                    where: { patientId: +user.id },
                    defaults: {
                        statusId: 'S1',
                        patientId: user.id,
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType,
                        reason: data.reason,
                        token: token
                    }

                })
                if (check[1] === false) {
                    resolve({
                        errCode: 1,
                        messageEN: 'Each email can only book once at a time, if you want to register an appointment on this email, you can edit the old registration information of this email',
                        messaegVI: "mỗi email chỉ có thể đặt khám một lần tại một thời điểm, nếu muốn đăng ký lịch khám trên email này bạn có thể sửa thông tin đăng ký cũ của email này"
                    })
                } else {
                    await emailService.sendSimpleEmail({
                        reciverEmail: data.email,
                        patientName: data.lastName + data.firstName,
                        time: data.time,
                        doctorName: data.nameDoctor,
                        reason: data.reason,
                        language: data.language,
                        redirectLink: buildUlrEmail(token, data.doctorId)
                    })
                }
            }

            resolve({
                errCode: 0,
                messageEN: "Appointment information has been sent to your email, please check your email and confirm !!!",
                messageVI: 'Thông tin lịch hẹn đã được gửi lên email của bạn, vui lòng kiểm tra email và xác nhận !!!'
            })
        } catch (error) {
            reject(error)
        }
    })
}

let confirmBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let appoinment = await db.Booking.findOne({
                where: {
                    doctorId: +data.doctorId,
                    token: data.token,
                    statusId: 'S1'
                }
            })
            if (!appoinment) {
                resolve({
                    errCode: 1,
                    messageEN: 'This appointment information no longer exists!!!',
                    messageVI: "Thông tin lịch hẹn này không còn tồn tại !!!"
                })
            } else {
                appoinment.statusId = 'S2'
                await appoinment.save()

                resolve({
                    errCode: 0,
                    messageEN: 'Appointment added successfully, please remember the information and arrive on time !!!',
                    messageVI: 'Thêm lịch hẹn thành công, vui lòng ghi nhớ thông tin và đến đúng hẹn !!!'
                })

            }

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

module.exports = {
    postBookAppointment,
    confirmBookAppointment,
}