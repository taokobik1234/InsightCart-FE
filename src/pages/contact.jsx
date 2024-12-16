import React from 'react'
import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
export default function Contact() {
    return (
        <div className="flex flex-wrap w-full p-20">
            {/* <!-- Left Section: Contact Information --> */}
            <div className="w-full md:w-1/3 bg-black text-white p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="mb-8 text-gray-400">Say something to start a live chat!</p>

                <div className="space-y-6">
                    {/* <!-- Phone --> */}
                    <div className="flex items-center space-x-4">
                        <span>&#128222;</span>
                        <p>+999999999</p>
                    </div>

                    {/* <!-- Email --> */}
                    <div className="flex items-center space-x-4">
                        <span>&#9993;</span>
                        <p>demo@gmail.com</p>
                    </div>

                    {/* <!-- Address --> */}
                    <div className="flex items-center space-x-4">
                        <span>&#128205;</span>
                        <p>227 Nguyen Van Cu Street, Ward 4, District 5, Ho Chi Minh</p>
                    </div>
                </div>

                {/* <!-- Social Media Icons --> */}
                <div className="flex space-x-4 mt-8">
                    <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:scale-110">
                        <FaTwitter size={20} />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:scale-110">
                        <FaInstagram size={20} />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:scale-110">
                        <FaLinkedinIn size={20} />
                    </a>
                </div>
            </div>

            {/* <!-- Right Section: Contact Form --> */}
            <div className="w-full md:w-2/3 p-8">
                <form className="space-y-6">
                    {/* <!-- Name Fields --> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold mb-2">First Name</label>
                            <input type="text" placeholder="Enter your first name" className="w-full border-b border-gray-300 focus:outline-none p-2" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Last Name</label>
                            <input type="text" placeholder="Enter your last name" className="w-full border-b border-gray-300 focus:outline-none p-2" />
                        </div>
                    </div>

                    {/* <!-- Email & Phone --> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold mb-2">Email</label>
                            <input type="email" placeholder="Enter your email" className="w-full border-b border-gray-300 focus:outline-none p-2" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Phone Number</label>
                            <input type="text" placeholder="Enter your phone number" className="w-full border-b border-gray-300 focus:outline-none p-2" />
                        </div>
                    </div>

                    {/* <!-- Message --> */}
                    <div>
                        <label className="block font-semibold mb-2">Message</label>
                        <textarea
                            placeholder="Write your message.."
                            className="w-full border-b border-gray-300 focus:outline-none p-2"
                            rows="4"
                        ></textarea>
                    </div>

                    {/* <!-- Submit Button --> */}
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}
