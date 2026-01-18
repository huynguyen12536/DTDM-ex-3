import React, { useState } from 'react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Reset after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Liên hệ với chúng tôi</h2>
                <p className="section__subheader">
                    Nếu bạn có bất kỳ câu hỏi nào, vui lòng điền thông tin vào biểu mẫu bên dưới. 
                    Chúng tôi sẽ phản hồi bạn sớm nhất có thể!
                </p>
            </section>

            <section className="section__container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Information Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Thông tin liên hệ</h3>
                            <p className="text-gray-600">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                    <i className="ri-map-pin-line text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-medium">Địa chỉ</h4>
                                    <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                    <i className="ri-phone-line text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-medium">Điện thoại</h4>
                                    <p className="text-gray-600">+84 123 456 789</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                                    <i className="ri-mail-line text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-medium">Email</h4>
                                    <p className="text-gray-600">contact@lebaba.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <h3 className="text-xl font-semibold mb-4">Theo dõi chúng tôi</h3>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-full transition-all">
                                    <i className="ri-facebook-fill text-xl"></i>
                                </a>
                                <a href="#" className="p-2 bg-gray-100 hover:bg-pink-500 hover:text-white rounded-full transition-all">
                                    <i className="ri-instagram-line text-xl"></i>
                                </a>
                                <a href="#" className="p-2 bg-gray-100 hover:bg-blue-400 hover:text-white rounded-full transition-all">
                                    <i className="ri-twitter-fill text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-12 rounded-lg text-center">
                                <i className="ri-checkbox-circle-line text-5xl mb-4 block"></i>
                                <h3 className="text-xl font-semibold mb-2">Cảm ơn bạn!</h3>
                                <p>Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 text-sm underline hover:text-green-800"
                                >
                                    Gửi tin nhắn khác
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                                        placeholder="Nhập tên của bạn" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                                        placeholder="yourname@gmail.com" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                                    <textarea 
                                        rows="5" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                                        placeholder="Chúng tôi có thể giúp gì cho bạn?" 
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors font-semibold"
                                >
                                    Gửi yêu cầu
                                </button>
                            </form>
                        )}
                </div>
            </section>
        </>
    );
};

export default Contact;
