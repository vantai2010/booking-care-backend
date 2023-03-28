const db = require('../models/index')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

const isEmailExsit = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await db.User.findOne({
                where: { email }
            })
            if (check) {
                resolve(check)
            } else {
                resolve(false)
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })


}

const isIdExist = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await db.User.findOne({
                where: { id: +id }
            })
            if (check) {
                resolve(check)
            } else {
                resolve(false)
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })
}

const getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    messageEN: 'Missing required parameter !',
                    messageVI: 'Yêu cầu chưa có đủ thông tin để thực hiện !!!'
                })
            } else {
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                resolve({
                    errCode: 0,
                    messageEN: "Get data successfully",
                    messageVI: "Lấy dữ liệu thành công",
                    data: allCode
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userId === 'All') {
                users = await db.User.findAll({
                    include: [
                        { model: db.Allcode, as: 'genderData', attribute: ['valueVi', 'valueEn'] }
                    ]
                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({ where: { id: +userId } })
            }
            resolve(users)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await isEmailExsit(data.email)
            if (check === false) {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                let check = await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.genderId,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.image,
                })
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: 'Create New User successfully !!!',
                        messageVI: 'Tạo người dùng mới thành công !!!'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: 'Create New User failed !!!',
                        messageVI: 'Tạo người dùng mới thất bại !!!'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: 'Your email is already in use, Plz try another email !!!',
                    messageVI: "Email của bạn đã được sử dụng, vui lòng dùng email khác !!!"
                })
            }

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await isEmailExsit(data.email)
            if (!user) {
                resolve({
                    errCode: 1,
                    messageEN: "Update failure, this account isn't exist",
                    messageVI: 'Cập nhật thất bại, tài khoản này đã không còn tồn tại'
                })
            } {
                user.firstName = data.firstName,
                    user.lastName = data.lastName,
                    user.address = data.address,
                    user.phoneNumber = data.phoneNumber,
                    user.positionId = data.positionId,
                    user.gender = data.genderId,
                    user.roleId = data.roleId,
                    user.image = data.image

                await user.save();
                resolve({
                    errCode: 0,
                    messageEN: 'Update information successfully !!!',
                    messageVI: 'Cập nhật thông tin thành công !!!'
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: +id }
            })
            if (user) {
                const checkDeleted = await user.destroy()
                if (checkDeleted) {
                    resolve({
                        errCode: 0,
                        messageVI: 'Xóa thành công !!!',
                        messageEN: 'Delete user successfully !!!'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageVI: 'Xóa không thành công !!!',
                        messageEN: 'Delete user failure !!!'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    messageVI: 'Xóa thất bại !!! Tài khoản này không còn tồn tại',
                    messageEN: "delete failure !!! This account isn't exist"
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

module.exports = {
    getAllCodeService,
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    isEmailExsit,
    isIdExist,
}