const nodemailer = require("nodemailer");
const { codeOTPModel } = require("../model");

exports.sendEmail = async (req, res) => {
  try {
    const { user, codeOTP } = req;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: { name: "XVStore", address: process.env.EMAIL_USERNAME },
      to: user.email,
      subject: "Thiết lập lại mật khẩu đăng nhập XVStore",
      html:
        `<table width="100%">
      <tbody>
        <tr>
          <td align="center">
            <table width="60%">
              <tbody>
                <tr>
                  <td align="center">
                  <tr>
                    <img
                      alt=""
                      src="http://res.cloudinary.com/damahknfx/image/upload/v1706559426/avatar/jrazcv59uoqhvdey9evn.png"
                      width={"50"}
                      height={"auto"}
                    />
                    </tr>
                    <tr align="center" style="font-weight: bolder;color:#fd7e14;font-size:20px">XVStore</tr>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center">
            <table width="60%" style=" font-size: 13px" }}>
              <tbody>
                <tr>
                  <td>Xin chào buixuanvi_99</td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td>
                    Chúng tôi nhận được yêu cầu thiết lập lại mật khẩu cho tài
                    khoản XVStore của bạn.
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td>
                    Nhấn
                    <a
                      href="http://localhost:5173/auth/forgot_password/?code=` +
        encodeURIComponent(codeOTP) +
        `&email=` +
        encodeURIComponent(user.email) +
        `"
                      style="color: #fd7e14; margin: 0 5px "
                    >
                      tại đây
                    </a>
                    để thiết lập mật khẩu mới cho tài khoản XVStore của bạn.
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      Hoặc vui lòng copy và dán đường dẫn bên dưới lên trình
                      duyệt:
                    </p>
                    <p>
                      [
                      <a
                      href="http://localhost:5173/auth/forgot_password/?code=` +
        encodeURIComponent(codeOTP) +
        `&email=` +
        encodeURIComponent(user.email) +
        `"
                        style="color: #1414fd"
                      >
                      http://localhost:5173/auth/forgot_password/?code=` +
        encodeURIComponent(codeOTP) +
        `&email=` +
        encodeURIComponent(user.email) +
        `
                      </a>
                      ]
                    </p>
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                   Chú ý! email này chỉ sử dụng được 1 lần tạo lại mật khẩu và hết hạn sau 1h khi bạn nhận được email này
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr style="marginTop:50px">
                  <td>
                    <span>
                      <p>Trân trọng</p>
                      <p>Đội ngũ XVStore</p>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>`,
    };

    transporter.sendMail(mailOptions);
    await codeOTPModel.saveCodeOTP(user.email, codeOTP);
    res.status(200).json({ message: "Email sent code successfully." });
  } catch (error) {
    res.status(500).json({ errMessage: "server error" });
  }
};
