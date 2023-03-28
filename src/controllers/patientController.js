const patientService = require('../services/patientService.js')


let postBookAppointment = async (req, res) => {
    try {

        let { email, doctorId, timeType, date, firstName, lastName, gender, phoneNumber, address, reason, nameDoctor, time, language } = req.body
        if (!email || !doctorId || !timeType || !date || !firstName || !lastName || !gender || !phoneNumber || !address || !reason || !time || !nameDoctor || !language) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền lên !!!"
            })
        }
        let response = await patientService.postBookAppointment(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            messageEN: "Error from to server !!!",
            messageVI: "Có lỗi từ phía server !!! "
        })
    }
}

let confirmBookAppointment = async (req, res) => {
    try {
        let { token, doctorId } = req.body
        if (!token || !doctorId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền lên !!!"
            })
        }
        let response = await patientService.confirmBookAppointment(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            messageEN: "Error from to server !!!",
            messageVI: "Có lỗi từ phía server !!! "
        })
    }
}

module.exports = {
    postBookAppointment,
    confirmBookAppointment,
}