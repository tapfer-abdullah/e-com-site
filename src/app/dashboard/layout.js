import DashboardNavbar from "@/Components/Pages/Dashboard/DashboardNavbar/DashboardNavbar";
import DashboardSidebar from "@/Components/Pages/Dashboard/DashboardSidebar/DashboardSidebar";
import { ToastContainer } from "react-toastify";

export default function layout({ children }) {
    return <div>
        <div>
            <div className="grid grid-cols-12 relative w-full">
                <div className="col-span-2 col-start-1 min-h-screen bg-[#6AB187] shadow-xl"><DashboardSidebar /></div>
                <div className="col-span-10 col-start-3 relative ">
                    <DashboardNavbar />
                    <div className=" pt-20 bg-[#F1F1F1] h-full">
                        {children}
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>

    </div>
}