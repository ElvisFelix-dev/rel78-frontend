import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import { HiOutlineShoppingCart } from 'react-icons/hi'
import { GiCage } from 'react-icons/gi'
import { LuLogOut, LuSearch } from 'react-icons/lu'
import {
  RiDashboardLine,
  RiProfileLine,
  RiShoppingBag2Line,
} from 'react-icons/ri'
import { PiUsersThreeDuotone } from 'react-icons/pi'
import { TbReportSearch } from 'react-icons/tb'

import api from '../service/api'
import { Store } from '../service/store'
import { getError } from '../service/utils'

import imgProfile from '../assets/logo_rel.png'

export default function Sidebar() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { fullBox, cart, userInfo } = state

  const [name, setName] = useState(userInfo.name)
  const [email, setEmail] = useState(userInfo.email)

  const [collapsed, setCollapsed] = useState(false)

  const navigate = useNavigate()

  const submitProfile = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put(
        '/api/user/profile',
        {
          name,
          email,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      )

      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Usuário atualizado com sucesso')
    } catch (err) {
      toast.error(getError(err))
    }
  }

  function toggleMenu() {
    setMenuOpen(!isMenuOpen)
  }

  function toggleSidebar() {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <nav
        onSubmit={submitProfile}
        className="fixed top-0 z-50 w-full dark:bg-gray-800"
      >
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                title="Open and Close"
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link to="/admin/dashboard" className="flex md:mr-24">
                <img
                  src={imgProfile}
                  className="h-8 mr-3 rounded-full"
                  alt="Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Rel78 Store
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div className="relative">
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 mr-20"
                    aria-expanded={isMenuOpen ? 'true' : 'false'}
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src={imgProfile}
                      alt="Foto do usuario"
                    />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                      <div className="px-4 py-3 mr-28" role="none">
                        <p
                          className="text-sm text-gray-900 dark:text-white"
                          role="none"
                        >
                          {userInfo.name}
                        </p>
                        <p
                          className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                          role="none"
                        >
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Link
                    to="/admin/cart"
                    className="text-gray-200 hover:text-gray-300 relative group"
                  >
                    <HiOutlineShoppingCart size={25} />
                    {cart.cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 -mt-3 -mr-2 bg-red-500 text-white rounded-full text-xs px-1">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-36 h-screen pt-20 transition-transform -translate-x-full bg-blue-500 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-blue-500 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiDashboardLine color="#FFFFFF" size={22} />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/profile"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiProfileLine color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Perfil</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/customer"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <PiUsersThreeDuotone color="#FFFFFF" size={22} />

                <span className="flex-1 ml-3 whitespace-nowrap">Clientes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/product"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiShoppingBag2Line color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Produtos</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/placeorder/list"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <GiCage color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Vendas</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/go-search"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LuSearch color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Buscar</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/report"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <TbReportSearch color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Relatórios
                </span>
              </Link>
            </li>
            <li
              onClick={() => {
                localStorage.clear()
                navigate('/signin')
              }}
            >
              {!collapsed && (
                <Link
                  to="/signin"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <LuLogOut color="#FFFFFF" size={22} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Sair</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </aside>

      <aside
        className={`fixed top-0 left-0 z-40 w-36 h-screen pt-20 transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-blue-500 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiDashboardLine color="#FFFFFF" size={22} />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/profile"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiProfileLine color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Perfil</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/customer"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <PiUsersThreeDuotone color="#FFFFFF" size={22} />

                <span className="flex-1 ml-3 whitespace-nowrap">Clientes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/product"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiShoppingBag2Line color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Produtos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/placeorder/list"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <GiCage color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Vendas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/go-search"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LuSearch color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">Buscar</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/report"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <TbReportSearch color="#FFFFFF" size={22} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Relatórios
                </span>
              </Link>
            </li>
            <li
              onClick={() => {
                localStorage.clear()
                navigate('/signin')
              }}
            >
              {!collapsed && (
                <Link
                  to="/signin"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <LuLogOut color="#FFFFFF" size={22} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Sair</span>
                </Link>
              )}
            </li>{' '}
          </ul>
        </div>
      </aside>
    </>
  )
}
