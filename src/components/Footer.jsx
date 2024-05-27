import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 px-3 mt-16">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full md:w-1/2 md:text-center md:mb-0 mb-8">
          <p className="text-xs text-gray-400 md:text-sm">
            Copyright 2024 &copy; All Rights Reserved
          </p>
        </div>
        <div className="w-full md:w-1/2 md:text-center md:mb-0 mb-4">
          <ul className="list-reset flex justify-center flex-wrap text-xs md:text-sm gap-1">
            <li>
              <a
                href="https://www.instagram.com/2system_dev/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={20} />
              </a>
            </li>
            <li className="mx-4">
              <a
                href="https://wa.me/5516996318063"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaWhatsapp size={20} />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/ElvisFelix-dev"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={20} />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/elvis-felix/"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
