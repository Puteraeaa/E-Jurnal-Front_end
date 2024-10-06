import React from 'react';
import { useNavigate } from 'react-router-dom';
import FaceFrownIcon from '@heroicons/react/24/solid/FaceFrownIcon';

function ForbiddenPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); // Navigasi kembali ke halaman utama atau dashboard
    };

    return (
        <div className="hero h-full bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <FaceFrownIcon className="h-48 w-48 inline-block" />
                    <h1 className="text-5xl font-bold">403 - Forbidden</h1>
                    <p className="py-6">Anda tidak memiliki akses ke halaman ini.</p>
                    <button
                        onClick={handleGoBack}
                        className="btn btn-primary mt-4"
                    >
                        Kembali ke E-Jurnal
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForbiddenPage;
