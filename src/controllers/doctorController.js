const doctorService = require('../services/doctorService.js')

const getTopDoctorHome = async (req, res) => {
    // let {limit, role} = req.query
    let limit = req.query.limit
    // let role = req.query.role
    if (!limit) {
        limit = 10
    }
    // if(!role){
    //     return res.status(200).json({
    //         errCode: 1,
    //         messageEN: 'Missing Information !!!',
    //         messageVI: 'Yêu cầu gửi đi thiếu thông tin !!!'
    //     })
    // }
    try {
        const response = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: "Error from server !!!",
            messageVI: "Server đã gặp sự cố !!!"
        })
    }
}

const getAllDoctors = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctors()
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'Error from server !!!',
            messageVI: 'Có lỗi ở phía server !!!'
        })
    }
}

const postInforDoctor = async (req, res) => {
    try {

        let { doctorId, contentHTML, contentMarkdown, action, selectedPrice, selectedPayment, selectedProvince, nameClinic, addressClinic, selectedSpecialty, selectedClinic } = req.body
        if (!doctorId || !contentHTML || !contentMarkdown || !action || !selectedPrice || !selectedPayment || !selectedProvince || !nameClinic || !addressClinic || !selectedSpecialty || !selectedClinic) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing infromation !!!",
                messageVI: "Vui lòng gửi đầy đủ thông tin !!!"
            })
        }

        let response = await doctorService.postInforDoctor(req.body)
        return res.status(200).json(response)

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: "ERROR from server !!!",
            messageVI: "Đã có lỗi ở phía server !!!"
        })
    }
}

const getDetailDoctorById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền đi !!!"
            })
        }
        let response = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: "ERROR from server !!!",
            messageVI: "Lỗi từ phía server !!!"
        })
    }
}

const bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: "ERROR from server !!!",
            messageVI: "Lỗi từ phía server !!!"
        })
    }
}

const getScheduleDoctorByDate = async (req, res) => {
    try {
        if (!req.query.doctorId || !req.query.date) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền đi !!!"
            })
        }
        let response = await doctorService.getScheduleDoctorByDate(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server !!!',
            messageVI: "Có lỗi từ phía server !!!"
        })
    }
}

const getInforDoctorById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền đi !!!"
            })
        }
        let response = await doctorService.getInforDoctorById(req.query.id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server !!!',
            messageVI: "Có lỗi từ phía server !!!"
        })
    }
}

const getProfileDoctorById = async (req, res) => {
    try {

        if (!req.query.id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền đi !!!"
            })
        }
        let response = await doctorService.getProfileDoctorById(req.query.id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server !!!',
            messageVI: "Có lỗi từ phía server !!!"
        })
    }
}

let getListPatient = async (req, res) => {
    try {
        if (!req.query.doctorId || !req.query.date) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền đi !!!"
            })
        }
        let response = await doctorService.getListPatient(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server !!!',
            messageVI: "Có lỗi từ phía server !!!"
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let { image, email, doctorId, patientId, timeType } = req.body
        if (!image || !email || !doctorId || !patientId || !timeType) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền đi !!!"
            })
        }
        let response = await doctorService.sendRemedy(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server !!!',
            messageVI: "Có lỗi từ phía server !!!"
        })
    }
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