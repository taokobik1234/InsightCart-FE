import React from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import GppGoodIcon from '@mui/icons-material/GppGood';

export default function ServiceCard() {
    return (
        <div className="flex flex-wrap justify-center items-center gap-8 p-4 bg-white mt-40">
            {/* Card 1 */}
            <div className="flex flex-col items-center justify-center w-full sm:w-1/2 md:w-1/4">
                <div className="bg-gray-300 p-2 rounded-full mb-2">
                    <div className="bg-black text-white p-2 rounded-full">
                        <LocalShippingIcon />
                    </div>
                </div>
                <div className="text-xl md:text-3xl font-semibold text-center">
                    FREE AND FAST DELIVERY
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                    Free delivery for all orders over $140
                </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center justify-center w-full sm:w-1/2 md:w-1/4">
                <div className="bg-gray-300 p-2 rounded-full mb-2">
                    <div className="bg-black text-white p-2 rounded-full">
                        <HeadsetMicIcon />
                    </div>
                </div>
                <div className="text-xl md:text-3xl font-semibold text-center">
                    24/7 CUSTOMER SERVICE
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                    Friendly 24/7 customer support
                </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center justify-center w-full sm:w-1/2 md:w-1/4">
                <div className="bg-gray-300 p-2 rounded-full mb-2">
                    <div className="bg-black text-white p-2 rounded-full">
                        <GppGoodIcon />
                    </div>
                </div>
                <div className="text-xl md:text-3xl font-semibold text-center">
                    MONEY BACK GUARANTEE
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                    We return money within 30 days
                </div>
            </div>
        </div>
    );
}
