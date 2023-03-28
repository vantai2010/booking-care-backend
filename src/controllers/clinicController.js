const clinicService = require('../services/clinicService.js')


let createNewClinic = async (req, res) => {
    try {
        let { name, imageBase64, descriptionHTML, descriptionMarkdown, address } = req.body
        if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown || !address) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền lên !!!"
            })
        }

        let response = await clinicService.createNewClinic(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'Error from to server !!!',
            messageVI: 'Lỗi từ phía máy chủ !!!'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinic()
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'Error from to server !!!',
            messageVI: 'Lỗi từ phía máy chủ !!!'
        })
    }
}


let getDetailClinicById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền lên !!!"
            })
        }
        let response = await clinicService.getDetailClinicById(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'Error from to server !!!',
            messageVI: 'Lỗi từ phía máy chủ !!!'
        })
    }
}

module.exports = {
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
}