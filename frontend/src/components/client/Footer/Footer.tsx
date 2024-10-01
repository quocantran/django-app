import React from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/Footer.module.scss";
import Link from "next/link";

const cx = classnames.bind(styles);

const Footer = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("footer-company")}>
          <Link href="/">
            <img src="/images/logo-light.png" alt="logo" />
          </Link>
          <h4>Glints Asia Pacific</h4>
          <p>
            Glints là một trong những hệ sinh thái nhân sự hàng đầu tại khu vực
            Đông Nam Á. Sứ mệnh của chúng tôi là hỗ trợ cho 120 triệu nhân tài
            trong khu vực phát triển sự nghiệp của họ, cũng như giúp cho tổ chức
            tuyển được nhân sự phù hợp ở bất kỳ nơi đâu tại khu vực Đông Nam Á.
            Được chính thức thành lập tại Singapore vào năm 2015, Glints đã hỗ
            trợ hơn 5 triệu nhân tài và hơn 60.000 tổ chức thành công trong việc
            phát huy tối đa tiềm năng nhân lực của họ. Chúng tôi dẫn đầu trong
            lĩnh vực phát triển nguồn vốn nhân lực với tư cách là startup phát
            triển nhanh nhất trong thị trường phát triển sự nghiệp và tuyển dụng
            nhân tài. Cho đến thời điểm hiện tại, Glints đã có mặt tại
            Indonesia, Malaysia, Singapore, Việt Nam và Đài Loan.
          </p>
          <div className={cx("footer-address")}>
            © 2024 CÔNG TY TNHH GLINTS VIỆT NAM
            <br></br>
            <span>
              Mã số Doanh nghiệp: 0316168834 theo Giấy chứng nhận đăng ký doanh
              nghiệp do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp lần đầu
              ngày 27/02/2020.
            </span>
            <br></br>
            <span>
              Địa chỉ: Tầng 6, Số 100, Đường Nguyễn Thị Minh Khai, Phường 06,
              Quận 3, Thành phố Hồ Chí Minh, Việt Nam
            </span>
          </div>
        </div>
        <div className={cx("footer-section")}>
          <div className={cx("section-item")}>
            <p>CÔNG TY</p>
            <ul>
              <li>
                <a href="">
                  <span>Về chúng tôi</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Đội ngũ lãnh đạo</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Những điều thú vị tại Glints</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Tech Blog</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Cơ hội nghề nghiệp</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Report Vulnerability</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Thoả thuận người dùng</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Chính sách bảo mật</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Điều khoản dịch vụ</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>
                    Quy Chế Hoạt Động Website Cung Cấp Dịch vụ TMĐT
                    Glints.com/vn
                  </span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Cơ Chế Giải Quyết Các Tranh Chấp</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={cx("section-item")}>
            <p>DÀNH CHO NGƯỜI TÌM VIỆC</p>
            <ul>
              <li>
                <a href="">
                  <span>Help Center</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Việc làm theo Địa điểm</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Việc làm theo Tên công ty tuyển dụng</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Việc làm theo Ngành nghề</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Các việc làm phổ biến khác</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
