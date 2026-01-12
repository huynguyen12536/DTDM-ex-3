import React from 'react'
import instaImg1 from "../assets/instagram-1.jpg"
import instaImg2 from "../assets/instagram-2.jpg"
import instaImg3 from "../assets/instagram-3.jpg"
import instaImg4 from "../assets/instagram-4.jpg"
import instaImg5 from "../assets/instagram-5.jpg"
import instaImg6 from "../assets/instagram-6.jpg"

const Footer = () => {
    return (
        <>
            <footer className="section__container footer__container">
                <div className="footer__col">
                    <h4>THÔNG TIN LIÊN HỆ</h4>
                    <p>
                        <span><i className="ri-map-pin-2-fill"></i></span>
                        123, Đường London Bridge, London
                    </p>
                    <p>
                        <span><i className="ri-mail-fill"></i></span>
                        support@Lebaba.com
                    </p>
                    <p>
                        <span><i className="ri-phone-fill"></i></span>
                        (+012) 3456 789
                    </p>
                </div>
                <div className="footer__col">
                    <h4>CÔNG TY</h4>
                    <a href="#">Trang chủ</a>
                    <a href="#">Về chúng tôi</a>
                    <a href="#">Làm việc với chúng tôi</a>
                    <a href="#">Blog của chúng tôi</a>
                    <a href="#">Điều khoản & Điều kiện</a>
                </div>
                <div className="footer__col">
                    <h4>LIÊN KẾT HỮU ÍCH</h4>
                    <a href="#">Trợ giúp</a>
                    <a href="#">Theo dõi đơn hàng</a>
                    <a href="#">Nam</a>
                    <a href="#">Nữ</a>
                    <a href="#">Váy</a>
                </div>
                <div className="footer__col">
                    <h4>INSTAGRAM</h4>
                    <div className="instagram__grid">
                        <img src={instaImg1} alt="instagram" />
                        <img src={instaImg2} alt="instagram" />
                        <img src={instaImg3} alt="instagram" />
                        <img src={instaImg4} alt="instagram" />
                        <img src={instaImg5} alt="instagram" />
                        <img src={instaImg6} alt="instagram" />
                    </div>
                </div>
            </footer>
            <div className="footer__bar">
                Bản quyền © 2025 Web Design Mastery. Tất cả các quyền được bảo lưu.
            </div>
        </>
    )
}

export default Footer