import React from 'react'
import logo from "../assets/logo.png";

function Footer() {
    const footerNavs = [
        {
            href: 'javascript:void()',
            name: 'Terms'
        },
        {
            href: 'javascript:void()',
            name: 'License'
        },
        {
            href: 'javascript:void()',
            name: 'Privacy'
        },
        {
            href: 'javascript:void()',
            name: 'About us' 
        }
    ]
    return (
        <footer className="pt-10 bg-green-900">
            <div className="max-w-screen-xl mx-auto px-4 text-lime-600 md:px-8">
                
                <div className="mt-10 py-10 border-t md:text-center">
                    <p>© 2024 Surya V. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer