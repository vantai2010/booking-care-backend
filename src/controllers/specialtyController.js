const specialtyService = require('../services/specialtyService.js')

let createNewSpecialty = async (req, res) => {
    try {
        let { name, imageBase64, descriptionHTML, descriptionMarkdown } = req.body
        if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền lên !!!"
            })
        }

        let response = await specialtyService.createNewSpecialty(req.body)
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

let getAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialty()
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

let getDetailSpecialtyById = async (req, res) => {
    try {
        if (!req.query.id || !req.query.location) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information !!!",
                messageVI: "Thiếu thông tin chuyền lên !!!"
            })
        }
        let response = await specialtyService.getDetailSpecialtyById(req.query)
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
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
}