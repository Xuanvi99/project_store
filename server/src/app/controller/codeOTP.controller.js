const { codeOTPModel } = require("../model");
const { sendMail } = require("../../utils/sendMail");

exports.sendCodeEmail = async (req, res) => {
  try {
    const { user, codeOTP } = req;
    if (!user) {
      res.status(404).json({ errMessage: "Email not found!" });
    }
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
                <td>Xin chào ` +
        user.username +
        `</td>
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
    sendMail(mailOptions);
    await codeOTPModel.saveCodeOTP(user.email, codeOTP);
    res.status(200).json({ message: "Email sent code successfully." });
  } catch (error) {
    res.status(500).json({ errMessage: "server error" });
  }
};

exports.sendOTPEmail = async (req, res) => {
  try {
    const { user, OTP } = req;

    const mailOptions = {
      from: { name: "XVStore", address: process.env.EMAIL_USERNAME },
      to: user.email,
      subject: "Xác minh OTP ",
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
                  <td>Xin chào ` +
        user.username +
        `</td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td>
                    Chúng tôi nhận được yêu cầu xác minh email cho tài
                    khoản XVStore của bạn.
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                  Sử dụng mã này để hoàn tất việc thiết lập email khôi phục này:
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td width="100%" style="text-align:center;font-size:36px" height="5">
                  ` +
        OTP +
        `
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td width="100%" height="5">
                   Chú ý! email này chỉ sử dụng được 1 lần xác minh email và hết hạn sau 1h khi bạn nhận được email này
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
    sendMail(mailOptions);

    await codeOTPModel.saveCodeOTP(user.email, OTP);
    res.status(200).json({ message: "Email sent code successfully." });
  } catch (error) {
    res.status(500).json({ errMessage: "server error" });
  }
};

exports.notifyEmail = async (req, res) => {
  const { email, code, isExpired } = req;
  try {
    if (code.length === 6) {
      const checkUpdate = await codeOTPModel
        .findOneAndUpdate({ email, code }, { status: true })
        .exec();
      if (!checkUpdate) {
        return res.status(404).json({ errMessage: "Code email fail" });
      }
    }
    return res.status(200).json({
      expired: isExpired,
      message: isExpired ? "Email is expired" : "Verify email success",
    });
  } catch (error) {
    res.status(500).json({ errMessage: "Server error" });
  }
};
