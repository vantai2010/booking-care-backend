const nodemailer = require('nodemailer');
require('dotenv').config()

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Công ty sức khỏe zephyous" <chuvantai2002@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'en' ? 'Register for medical appointment' : 'Đăng ký đặt lịch khám bệnh',
        html: getBodyHtmlEmail(dataSend)

    })

}

let getBodyHtmlEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên trang web: booking-care.com</p>
        <p>Thông tin đặt lịch khám bệnh: <p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <div>lý do thăm khám là: ${dataSend.reason}</div>
        <p>Nếu các thông tin trên chính xác , vui lòng nhấn vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Chân thành cảm ơn quý khách đã sử dịch dịch vụ của chúng tôi</div>
    `
    } else {
        result = `<h3>hello ${dataSend.patientName}</h3>
        <p>You received this email because you booked an appointment on the website: booking-care.com</p>
        <p>Medical appointment booking information: <p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <div>reason for visit is: ${dataSend.reason}</div>
        <p>If the above information is correct, please click on the link below to complete the procedure to book an appointment</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Thank you very much for using our service</div>
        `
    }

    return result
}


let getBodyHtmlSendRemedyEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên trang web: booking-care.com</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm. <p>

        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
    `
    } else {
        result = `
        <h3>hello</h3>
        <p>You received this email because you booked an appointment on the website: booking-care.com</p>
        <p>Prescription/invoice information is sent in the attached file. <p>

        <div>Thank you very much for trusting our service</div>
        `
    }

    return result
}

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Công ty sức khỏe zephyous" <chuvantai2002@gmail.com>',
        to: dataSend.email,
        subject: dataSend.language === 'en' ? 'The Result of appointment appointment' : 'Kết quả đặt lịch khám bệnh',
        html: getBodyHtmlSendRemedyEmail(dataSend),
        attachments: [
            {
                filename: 'hoadon.png',
                content: dataSend.image.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    })
}

module.exports = {
    sendSimpleEmail,
    sendAttachment,
}