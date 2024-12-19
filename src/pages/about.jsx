import React from 'react'
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RedeemIcon from '@mui/icons-material/Redeem';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import neyMar from '../assets/neymar.jpg'
import ronaldo from '../assets/ronaldo.jpg'
import messi from '../assets/messi.jpg'
import kevin from '../assets/kevin.jpg'
import pogba from '../assets/pogba.jpg'
import ServiceCard from '../components/ServiceCard';
export default function About() {
    return (
        <div className="flex flex-col w-full pt-10 pb-10 bg-gray-100">
            <div className="flex flex-row w-full">
                <div className="flex flex-col justify-center bg-gray-100 text-left p-12 w-1/2">
                    <h1 className="text-3xl font-bold mb-4">Our Story</h1>
                    <p>Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 million customers across the region.</p>
                    <p className="mt-2">Exclusive has more than 1 Million products to offer, growing at a very fast pace. Exclusive offers a diverse assortment in categories ranging from consumer.</p>
                </div>


                <div className="w-1/2 object-contain">
                    <img src="https://images.business.com/app/uploads/2022/03/23032729/shopper_Prostock-Studio_getty-3.jpg" alt="shoper" />
                </div>
            </div>


            <div className="flex justify-center items-center space-x-8 p-4 bg-gray-100 mt-40">

                <div className="bg-white p-4 shadow-md flex flex-col items-center justify-center w-1/5">
                    <div className="bg-gray-300 p-2 rounded-full mb-2">
                        <div className="bg-black text-white p-2 rounded-full">
                            <StorefrontIcon color='white' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">10.5k</div>
                    <div className="text-gray-600">Sellers active our site</div>
                </div>

                <div className="bg-blue-500 p-4 shadow-md flex flex-col items-center justify-center text-white w-1/5">
                    <div className="bg-gray-300 p-2 rounded-full mb-2">
                        <div className="bg-white text-black p-2 rounded-full">
                            <AttachMoneyIcon color='black' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">33k</div>
                    <div>Monthly Product Sale</div>
                </div>


                <div className="bg-white p-4 shadow-md flex flex-col items-center justify-center w-1/5">
                    <div className="bg-gray-300 p-2 rounded-full mb-2">
                        <div className="bg-black text-white p-2 rounded-full">
                            <RedeemIcon color='white' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">45.5k</div>
                    <div className="text-gray-600">Customer active in our site</div>
                </div>


                <div className="bg-white p-4 shadow-md flex flex-col items-center justify-center w-1/5">
                    <div className="bg-gray-300 p-2 rounded-full mb-2">
                        <div className="bg-black text-white p-2 rounded-full">
                            <LocalAtmIcon color='white' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">25k</div>
                    <div className="text-gray-600">Annual gross sale in our site</div>
                </div>
            </div>

            <div className="flex flex-wrap-reverse justify-center gap-8 bg-gray-100 p-8 mt-20">

                <div className="max-w-xs text-center bg-white shadow-lg p-6 rounded-lg">
                    <img src={ronaldo} alt="Tom Cruise" className="mx-auto rounded-lg mb-4 w-60 h-60 object-contain transform transition duration-300 hover:scale-110" />
                    <h2 className="text-lg font-bold">Ro Nguyen</h2>
                    <p className="text-gray-600 text-sm">Co-founder</p>
                    <div className="flex justify-center space-x-4 mt-4">

                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>

                <div className="max-w-xs text-center bg-white shadow-lg p-6 rounded-lg">
                    <img src={messi} alt="Tom Cruise" className="mx-auto rounded-lg mb-4 w-60 h-60 object-contain transform transition duration-300 hover:scale-110" />
                    <h2 className="text-lg font-bold">Si Vo</h2>
                    <p className="text-gray-600 text-sm">Product designer</p>
                    <div className="flex justify-center space-x-4 mt-4">

                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>

                <div className="max-w-xs text-center bg-white shadow-lg p-6 rounded-lg">
                    <img src={kevin} alt="Tom Cruise" className="mx-auto rounded-lg mb-4 w-60 h-60 object-contain transform transition duration-300 hover:scale-110" />
                    <h2 className="text-lg font-bold">Duy Kevin</h2>
                    <p className="text-gray-600 text-sm">Founder & Chairman</p>
                    <div className="flex justify-center space-x-4 mt-4">

                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>


                <div className="max-w-xs text-center bg-white shadow-lg p-6 rounded-lg">
                    <img src={pogba} alt="Emma Watson" className="mx-auto rounded-lg mb-4 w-60 h-60 object-contain transform transition duration-300 hover:scale-110" />
                    <h2 className="text-lg font-bold">Dung Pogba</h2>
                    <p className="text-gray-600 text-sm">Managing Director</p>
                    <div className="flex justify-center space-x-4 mt-4">

                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>


                <div className="max-w-xs text-center bg-white shadow-lg p-6 rounded-lg">
                    <img src={neyMar} alt="Will Smith" className="mx-auto rounded-lg mb-4 w-60 h-60 object-contain transform transition duration-300 hover:scale-110" />
                    <h2 className="text-lg font-bold">Thinh Neymar</h2>
                    <p className="text-gray-600 text-sm">Founder & Chairman</p>
                    <div className="flex justify-center space-x-4 mt-4">

                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100009724477964" className="hover:text-black hover:scale-110">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <ServiceCard />
        </div>


    )
}
