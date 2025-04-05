import { useEffect } from 'react';
import Footer from '~/components/Footer';
import HeaderComponent from '~/layouts/DefaultLayout/HeaderDefaultLayout';

function DefaultLayout({ children, title }) {
    useEffect(() => {
        document.title = title ?? 'Maquiz';
    });
    return (
        <main className="relative">
            <HeaderComponent></HeaderComponent>
            <div className="bg-background pb-10">
                <div className="container mx-auto">{children}</div>
            </div>
            <Footer />
        </main>
    );
}

export default DefaultLayout;
