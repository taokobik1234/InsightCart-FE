import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsClipboardCheck } from "react-icons/bs";

const sideBarItems = [
    {name: "Shop Verify", icon: BsClipboardCheck, to: "/admin/shop-verify"},
]
export default function Sidebar() {
  return (
    <div className="w-1/5 flex flex-col items-center gap-2 shadow-2xl p-3">
        <div className="flex flex-row items-center gap-2">
            <MdAdminPanelSettings size={50}/>
            <h1 className="text-3xl font-bold text-blue-800">Admin Panel</h1>
        </div>
        <div className="w-full h-[1px] bg-slate-300"/>
        {sideBarItems.map((item) => (
            <Link 
                key={item.name}  
                to={item.to} 
                className="flex flex-row items-center gap-2 w-full hover:bg-slate-200 p-2 rounded-md"
            >
                <item.icon size={30}/>
                <h1 className="text-xl font-bold">{item.name}</h1>
            </Link>
        ))}
    </div>
  )
}
