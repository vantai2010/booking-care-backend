const db = require('../models/index')
const userService = require('../services/userService')
const bcryptjs = require('bcryptjs')

const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({
            success: false,
            messageEN: "please enter full information ",
            messageVI: "vui lòng nhập đầy đủ email, password"
        })
    }
    if (email) {
        const user = await db.User.findOne({ where: { email: email }, raw: true })
        if (!user) {
            return res.json({
                success: false,
                messageEN: "This account isn't exist",
                messageVI: "Tài khoản này không tồn tại !!!"
            })
        }
        let check = await bcryptjs.compareSync(password, user.password)
        if (!check) {
            return res.json({
                success: false,
                messageEN: "Please re-enter the correct email and password",
                messageVI: "Vui lòng nhập đúng lại email và password"
            })
        } else {
            delete user.password
            return res.json({
                success: true,
                messageEN: "Already logged in",
                messageVI: "Đăng nhập thành công",
                user: user
            })

        }
    }

}

const handleRegister = async (req, res) => {
    const { email, password, repassword } = req.body
    if (!email || !password || !repassword) {
        return res.json({
            success: false,
            messageEN: "please enter full information ",
            messageVI: "vui lòng nhập đầy đủ email, password và repassword"
        })
    }
    if (password !== repassword) {
        return res.json({
            success: false,
            messageEN: 'Repassword is wrong',
            messageVI: "mật khẩu nhập lại không khớp vui lòng nhập lại"
        })
    }
    if (email) {
        const user = await db.User.findOne({ where: { email: email } })
        if (user) {
            return res.json({
                success: false,
                messageEN: 'This email is exist',
                messageVI: "Email đã tồn tại"
            })
        }
        const newUser = await db.User.create({ email: email, password: password })
        return res.json({
            success: true,
            messageEN: 'Create account successfully',
            messageVI: "Tạo tài khoản thành công",
            user: newUser
        })
    }
}

const getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data)
    } catch (e) {
        console.log('get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            messageVI: 'Đã xảy ra lỗi từ phía server !!!',
            messageEN: 'Error from server'
        })
    }
}

const handleGetAllUsers = async (req, res) => {
    let id = req.params.id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            messageEN: 'Missing Information !!!',
            messageVI: 'Yêu cầu chưa có đủ thông tin để thực hiện !!!',
            users: []
        })
    }
    let users = await userService.getAllUsers(id)

    return res.status(200).json({
        errCode: 0,
        messageEN: 'OK',
        messageVI: 'OK',
        users
    })
}

const handleCreateNewUser = async (req, res) => {
    let { email, password, firstName, lastName, address, phoneNumber, genderId, roleId, positionId } = req.body
    if (!email || !password || !firstName || !lastName || !address || !phoneNumber || !genderId || !roleId || !positionId) {
        return res.status(200).json({
            errCode: -1,
            messageEN: 'Missing Information !!!',
            messageVI: 'Yêu cầu chưa có đủ thông tin để thực hiện !!!'
        })
    } else {
        const response = await userService.createNewUser(req.body)
        return res.status(200).json(response)
    }
}

const handleUpdateUser = async (req, res) => {
    let { email, password, firstName, lastName, address, phoneNumber, gender, roleId } = req.body
    if (!email || !password || !firstName || !lastName || !address || !phoneNumber || !gender || !roleId) {
        return res.status(200).json({
            errCode: 1,
            messageEN: 'Missing Information !!!',
            messageVI: 'Yêu cầu chưa có đủ thông tin để thực hiện !!!'
        })
    } else {
        const response = await userService.updateUser(req.body)
        return res.json(response)
    }
}

const handleDeleteUser = async (req, res) => {
    let id = req.query.id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            messageEN: 'Missing Information !!!',
            messageVI: 'Yêu cầu chưa có đủ thông tin để thực hiện !!!'
        })
    } else {
        const response = await userService.deleteUser(id)
        return res.status(200).json(response)
    }
}

module.exports = {
    handleLogin,
    handleRegister,
    getAllCode,
    handleGetAllUsers,
    handleCreateNewUser,
    handleUpdateUser,
    handleDeleteUser,
}