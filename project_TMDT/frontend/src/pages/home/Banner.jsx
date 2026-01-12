import React from 'react';
import bannerImg from "../../assets/header.png"
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <header className="section__container header__container">
      <div className="header__content z-30">
        <h4>GIẢM GIÁ LÊN ĐẾN 20%</h4>
        <h1>Thời trang nữ</h1>
        <p>
          Khám phá xu hướng mới nhất và thể hiện phong cách độc đáo của bạn với trang web Thời trang Nữ của chúng tôi. Khám phá bộ sưu tập quần áo, phụ kiện và giày dép được tuyển chọn phù hợp với mọi sở thích và dịp.
        </p>
        <button className="btn"><Link to="/shop">KHÁM PHÁ NGAY</Link></button>
      </div>
      <div className="header__image">
        <img src={bannerImg} alt="header" />
      </div>
    </header>
  );
};

export default Banner;
