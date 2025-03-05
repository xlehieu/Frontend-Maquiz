import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ContactPage = () => {
    return (
        <section>
            <h1>LIÊN HỆ</h1>
            <p>
                <FontAwesomeIcon icon={faUser} />
                Lê Xuân Hiếu
            </p>
            <p>
                <FontAwesomeIcon icon={faPhone} /> 0355055556
            </p>
            <p>
                <FontAwesomeIcon icon={faEnvelope} /> xlehieu@gmail.com
            </p>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13771.631935991!2d105.75408247058199!3d21.02629819895223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134550a1216d58b%3A0x907e9b89ffe640be!2zQ8ahIFPhu58gQ2FpIE5naGnhu4duIE1hIFTDunkgU-G7kSA1IC0gSMOgIE7hu5lp!5e1!3m2!1svi!2s!4v1741078758336!5m2!1svi!2s"
                className="w-full h-[450px]"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
        </section>
    );
};

export default ContactPage;
