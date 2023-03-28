const db = require('../models/index')

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await db.Clinic.create({
                name: data.name,
                address: data.address,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.imageBase64
            })
            if (check) {
                resolve({
                    errCode: 0,
                    messageEN: 'ADD new clinic successfully !!!',
                    messageVI: "Thêm phòng khám mới thành công !!!"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: 'ADD new clinic failure !!!',
                    messageVI: "Thêm phòng khám mới thất bại !!!"
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}


let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "GET information's clinic successfully !!!",
                    messageVI: "Lấy thông tin phòng khám thành công !!!",
                    data: data
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "GET information's clinic failure !!!",
                    messageVI: "Lấy thông tin phòng khám thất bại !!!"
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}


let getDetailClinicById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: +data.id }
            })

            if (!clinic) {
                resolve({
                    errCode: 1,
                    messageEN: "Not found Clinic !!!",
                    messageVI: 'Không tìm thấy phòng khám này !!!'
                })
            } else {
                let doctor = []

                doctor = await db.Doctor_Infor.findAll({
                    where: { clinicId: +data.id },
                    attibutes: ['doctorId']
                })

                clinic.image = new Buffer(clinic.image, 'base64').toString('binary')
                resolve({
                    errCode: 0,
                    messageEN: "Find clinic successfully !!!",
                    messageVI: "Lấy thông tin phòng khám thành công !!!",
                    data: { clinic, doctor }
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewClinic,
    getAllClinic,
    getDetailClinicById
}