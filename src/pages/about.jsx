import React from 'react'
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RedeemIcon from '@mui/icons-material/Redeem';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
export default function About() {
    return (
        <div className="flex flex-col w-full mt-10 mb-20">
            <div className="flex flex-row w-full">
                <div className="flex flex-col justify-center bg-white text-left p-12 w-1/2">
                    <h1 className="text-3xl font-bold mb-4">Our Story</h1>
                    <p>Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 million customers across the region.</p>
                    <p className="mt-2">Exclusive has more than 1 Million products to offer, growing at a very fast pace. Exclusive offers a diverse assortment in categories ranging from consumer.</p>
                </div>


                <div className="w-1/2 object-contain">
                    <img src="https://images.business.com/app/uploads/2022/03/23032729/shopper_Prostock-Studio_getty-3.jpg" alt="shoper" />
                </div>
            </div>


            <div className="flex justify-center items-center space-x-8 p-4 bg-white mt-40">

                <div className="bg-white p-4 shadow-md flex flex-col items-center justify-center w-1/5">
                    <div class="bg-gray-300 p-2 rounded-full mb-2">
                        <div class="bg-black text-white p-2 rounded-full">
                            <StorefrontIcon color='white' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">10.5k</div>
                    <div className="text-gray-600">Sellers active our site</div>
                </div>

                <div className="bg-red-500 p-4 shadow-md flex flex-col items-center justify-center text-white w-1/5">
                    <div class="bg-gray-300 p-2 rounded-full mb-2">
                        <div class="bg-white text-black p-2 rounded-full">
                            <AttachMoneyIcon color='black' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">33k</div>
                    <div>Monthly Product Sale</div>
                </div>


                <div className="bg-white p-4 shadow-md flex flex-col items-center justify-center w-1/5">
                    <div class="bg-gray-300 p-2 rounded-full mb-2">
                        <div class="bg-black text-white p-2 rounded-full">
                            <RedeemIcon color='white' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">45.5k</div>
                    <div className="text-gray-600">Customer active in our site</div>
                </div>


                <div className="bg-white p-4 shadow-md flex flex-col items-center justify-center w-1/5">
                    <div class="bg-gray-300 p-2 rounded-full mb-2">
                        <div class="bg-black text-white p-2 rounded-full">
                            <LocalAtmIcon color='white' />
                        </div>
                    </div>
                    <div className="text-3xl font-semibold">25k</div>
                    <div className="text-gray-600">Annual gross sale in our site</div>
                </div>
            </div>
        </div>


    )
}
