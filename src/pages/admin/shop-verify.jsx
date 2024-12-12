import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { FaCheck } from "react-icons/fa";
import { TbXboxXFilled } from "react-icons/tb";
export default function ShopVerify() {
    const [shopRequests, setShopRequests] = useState([])
    const {user} = useSelector(state => state.auth)
    const convertDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            weekday: 'long',  
            year: 'numeric', 
            month: 'long',    
            day: 'numeric', 
            hour: 'numeric',  
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'UTC',
            timeZoneName: 'short'
        };
        const formattedDate = date.toLocaleString('en-US', options);
        return formattedDate;
    }
    const handleAccept = async (id) => {
        await fetch('http://tancatest.me/api/v1/admin/verify-shop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': user.session_id,
                'Authorization': `Bearer ${user.token.AccessToken}`,
                'x-client-id': user.id
            },
            body: JSON.stringify({
                ids: [id]
            })
        })
    }
    const handleReject = async (id) => {
        console.log(id);
    }
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const shops = await fetch(`http://tancatest.me/api/v1/shops`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'session-id': user.session_id,
                        'Authorization': `Bearer ${user.token.AccessToken}`,
                        'x-client-id': user.id
                    },
                }).then(response => response.json())
                .then(response => response.data.items)
                const requests = shops.filter(shop => !shop.is_verified)
                setShopRequests(requests)
            } catch (error) {
                console.log(error);
            }
        }
        fetchShops()
    }, [])
    console.log(shopRequests);
    return (
        <div className="w-full p-10 flex flex-col gap-10">
            <h1 className="text-3xl font-semibold">Shops</h1>
            {shopRequests.length > 0 && <h1 className="text-xl font-semibold">{shopRequests.length} Requests</h1>}
            {shopRequests.map(request => (
                <div 
                    key={request.id}
                    className='flex flex-row items-center justify-between p-5 bg-slate-200 rounded-md hover:bg-slate-300'
                >   
                    <div className='flex flex-col gap-2'>
                        <p>{request.name}</p>
                        <p className='text-[8px] text-slate-500 font-light'>{convertDate(request.created_at)}</p>
                    </div>
                    <div className='flex flex-row items-center gap-3'>
                        <FaCheck color='green' size={25} className='cursor-pointer' onClick={() => handleAccept(request.id)}/>
                        <TbXboxXFilled color='red' size={25} className='cursor-pointer' onClick={() => handleReject(request.id)}/>
                    </div>
                </div>
            ))}
        </div>
    )
}
