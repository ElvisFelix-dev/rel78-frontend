import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import { Store } from '../../service/store'

import Sidebar from '../../components/Sidebar'

export default function RegisterCustomer() {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state
  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [phone, setPhone] = useState(shippingAddress.phone || '')
  const [email, setEmail] = useState(shippingAddress.email || '')
  const [social, setSocial] = useState(shippingAddress.social || '')
  const [cpf, setCpf] = useState(shippingAddress.cpf || '')
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping')
    }
  }, [userInfo, navigate])
  const submitHandler = (e) => {
    e.preventDefault()
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        phone,
        social,
        email,
        cpf,
      },
    })
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        phone,
        social,
        email,
        cpf,
      }),
    )
    navigate('/admin/payment')
  }
  return (
    <>
      <Sidebar />
      <div className="pt-20 align-middle">
        <Helmet>
          <title>Rel78 Store | Dados do Cliente</title>
        </Helmet>
        <div className="max-w-md mx-auto bg-gray-500 shadow-md rounded-md">
          <div className="flex flex-col items-center ">
            <h1 className="my-3 text-3xl font-semibold">Dados do Cliente</h1>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <input
                  placeholder="Nome Completo"
                  type="text"
                  id="fullName"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="CPF"
                  type="text"
                  id="cpf"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  placeholder="Endereço"
                  type="text"
                  id="address"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  placeholder="Melhor email do cliente"
                  type="email"
                  id="email"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  placeholder="Cidade"
                  type="text"
                  id="city"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="Whatsapp"
                  type="text"
                  id="phone"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="Instagram"
                  type="text"
                  id="social"
                  className="w-96 border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  value={social}
                  onChange={(e) => setSocial(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
