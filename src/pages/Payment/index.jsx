import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

import { Store } from '../../service/store'

import Sidebar from '../../components/Sidebar'

export default function Payment() {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { paymentMethod },
  } = state

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Cartão Débito / Crédito' || 'Dinheiro' || 'Consignado',
  )

  const submitHandler = (e) => {
    e.preventDefault()
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
    localStorage.setItem('paymentMethod', paymentMethodName)
    navigate('/admin/placeorder')
  }

  return (
    <>
      <Sidebar />
      <div className="flex justify-center items-center h-screen pl-80">
        <div className="container small-container">
          <Helmet>
            <title>Rel78 Store | Pagamento</title>
          </Helmet>
          <h1 className="my-3 text-gray-200">Método de Pagamento</h1>
          <form onSubmit={submitHandler} className="mb-3">
            <div className="mb-3">
              <label className="block mb-2 text-gray-200">
                <input
                  type="radio"
                  id="Cartão Débito / Crédito"
                  value="Cartão Débito / Crédito"
                  checked={paymentMethodName === 'Cartão Débito / Crédito'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Cartão Débito / Crédito
              </label>
            </div>

            <div className="mb-3">
              <label className="block mb-2 text-gray-200">
                <input
                  type="radio"
                  id="Dinheiro"
                  value="Dinheiro"
                  checked={paymentMethodName === 'Dinheiro'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Dinheiro
              </label>
            </div>

            <div className="mb-3">
              <label className="block mb-2 text-gray-200">
                <input
                  type="radio"
                  id="Consignado"
                  value="Consignado"
                  checked={paymentMethodName === 'Consignado'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Consignado
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
