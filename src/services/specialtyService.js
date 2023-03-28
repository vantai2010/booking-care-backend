const db = require('../models/index')

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await db.Specialty.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.imageBase64
            })
            if (check) {
                resolve({
                    errCode: 0,
                    messageEN: 'ADD new specialty successfully !!!',
                    messageVI: "Thêm chuyên khoa mới thành công !!!"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: 'ADD new specialty failure !!!',
                    messageVI: "Thêm chuyên khoa mới thất bại !!!"
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}


let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "GET information's specialty successfully !!!",
                    messageVI: "Lấy thông tin chuyên khoa thành công !!!",
                    data: data
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "GET information's specialty failure !!!",
                    messageVI: "Lấy thông tin chuyên khoa thất bại !!!"
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let getDetailSpecialtyById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: { id: +data.id }
            })

            if (!specialty) {
                resolve({
                    errCode: 1,
                    messageEN: "Not found Specialty !!!",
                    messageVI: 'Không tìm thấy chuyên khoa này !!!'
                })
            } else {
                let doctor = []
                if (data.location === 'ALL') {
                    doctor = await db.Doctor_Infor.findAll({
                        where: { specialtyId: +data.id },
                        attibutes: ['doctorId', 'provinceId']
                    })
                } else {
                    doctor = await db.Doctor_Infor.findAll({
                        where: { specialtyId: +data.id, provinceId: data.location },
                        attributes: ['doctorId', 'provinceId']
                    })
                }
                specialty.image = new Buffer(specialty.image, 'base64').toString('binary')
                resolve({
                    errCode: 0,
                    messageEN: "Find specialty successfully !!!",
                    messageVI: "Lấy thông tin chuyên khoa thành công !!!",
                    data: { specialty, doctor }
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
}