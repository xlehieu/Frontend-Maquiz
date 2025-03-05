import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '~/components/Sidebar/Sidebar';
import AdminNavbar from '~/components/Navbars/AdminNavbar';
import FooterAdmin from '~/components/Footers/FooterAdmin';

const DashboardLayout = ({ children, title = 'Maquiz' }) => {
    document.title = title;
    const user = useSelector((state) => state.user); // dùng selector để lấy thông tin từ reducer
    return (
        // <div className="relative">
        //     <aside className="fixed h-screen z-10 bg-white w-56 shadow-md hidden md:block">
        //         <div className="flex justify-center py-3">
        //             <Link to={router.home} className={'w-2/3'}>
        //                 <MaquizLogo />
        //             </Link>
        //         </div>
        // <ul className="mt-4">
        //     {items.map((item, index) => (
        //         <li key={index}>
        //             <div className="text-sm pl-2 text-gray-400 py-2">{item.label}</div>
        //             <div>
        //                 <ul className="flex flex-col">
        //                     {item.children.map((child, i) => (
        //                         <li className="flex" key={i}>
        //                             <Link
        //                                 key={i}
        //                                 to={child.to}
        //                                 className="pl-8 text-gray-700 flex-1 text-base py-3 px-2 hover:text-primary ease-linear duration-200 transition-all hover:bg-opacity-10 hover:bg-slate-600 hover:rounded-3xl"
        //                             >
        //                                 <FontAwesomeIcon className="mr-2" icon={child.icon} />
        //                                 {child.label}
        //                             </Link>
        //                         </li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         </li>
        //     ))}
        // </ul>
        //     </aside>
        //     <header className="fixed right-0 z-20  w-full shadow-md">
        //         <div className="md:ml-56 px-5 py-3 bg-white flex justify-between">
        //             <div className="flex flex-shrink">
        //                 <div className="px-3 py-2 rounded-lg border-2 flex justify-between items-center focus-within:border-primary">
        //                     <input placeholder="Tìm kiếm đề thi" className="outline-none border-none caret-primary" />
        //                     <FontAwesomeIcon className="w-5 h-5 flex-shrink-0" icon={faSearch} />
        //                 </div>
        //             </div>
        //             <div className="flex flex-shrink justify-center content-center">
        //                 <Tippy
        //                     trigger="click"
        //                     interactive
        //                     placement="bottom-end"
        //                     content={
        //                         <div className="flex flex-col shadow bg-white" tabIndex="-1">
        //                             <Link
        //                                 className="text-gray-600 duration-200 px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
        //                                 to={router.profile}
        //                             >
        //                                 <FontAwesomeIcon icon={faUser} className="pr-2" />
        //                                 Thông tin tài khoản
        //                             </Link>
        //                             <Link
        //                                 to={userDashboardRouter.myDashboard}
        //                                 className="text-gray-600 duration-200 px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
        //                             >
        //                                 <FontAwesomeIcon icon={faGauge} className="pr-2" />
        //                                 Dashboard
        //                             </Link>
        //                             <button
        //                                 className="text-start px-2 py-2 text-gray-600 duration-200 hover:rounded hover:bg-black hover:bg-opacity-5"
        //                                 onClick={() => {}}
        //                             >
        //                                 <FontAwesomeIcon icon={faRightFromBracket} className="pr-2" />
        //                                 Đăng xuất
        //                             </button>
        //                         </div>
        //                     }
        //                 >
        //                     <div className="flex justify-between items-center">
        //                         {user?.avatar && (
        //                             <img className="rounded-full mr-1 w-8 h-8" src={user?.avatar} alt={user?.name} />
        //                         )}
        //                         <p className="text-lg text-primary ">{user?.name}</p>
        //                     </div>
        //                 </Tippy>
        //             </div>
        //         </div>
        //     </header>
        //     <main className="md:ml-56 h-full bg-[#fcfcfc]">
        //         <div className="md:mx-10 py-20">{children}</div>
        //     </main>
        // </div>
        <>
            <Sidebar />
            <AdminNavbar user={user} />
            <div className="absolute top-0 md:top-14 right-0 left-0 md:left-64 px-4 bg-background">
                <div className="w-full mt-40 md:mt-0">{children}</div>
                <div className="px-4 md:px-10 mx-auto w-full">
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
};
export default DashboardLayout;
