import { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import api from '../../service/api'
import { getError } from '../../service/utils'
import { Store } from '../../service/store'

import LoadingBox from '../../components/LoadingBox'

import Sidebar from '../../components/Sidebar'

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true }
    case 'CREATE_SUCCESS':
      return { ...state, loading: false }
    case 'CREATE_FAIL':
      return { ...state, loading: false }
    default:
      return state
  }
}

export default function PlaceOrder() {
  const navigate = useNavigate()

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  })

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0),
  )

  cart.totalPrice = cart.itemsPrice

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' })

      const { data } = await api.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,

          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      )
      ctxDispatch({ type: 'CART_CLEAR' })
      dispatch({ type: 'CREATE_SUCCESS' })
      localStorage.removeItem('cartItems')
      navigate(`/admin/placeorder/${data.order._id}`)
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' })
      toast.error(getError(err))
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/admin/payment')
    }
  }, [cart, navigate])

  return (
    <>
      <Sidebar />
      <div className=" min-h-screen py-12">
        <div className="max-w-2xl mx-auto p-6 bg-gray-500 shadow-md rounded-md mt-10">
          <div>
            <Helmet>
              <title>Rel78 Store | Ordem da Compra</title>
            </Helmet>
            <h1 className="my-3">Ordem da Compra</h1>
            <div className="md:flex">
              <div className="md:w-8/12 mb-3 md:mb-0">
                <div className="mb-3">
                  <div className="bg-gray-500 rounded-md p-4">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Dados do Cliente
                    </h2>
                    <p>
                      <strong>Nome: {cart.shippingAddress.fullName}</strong>
                      <br />
                      <strong>CPF: {cart.shippingAddress.cpf}</strong>
                      <br />
                      <strong>Endereço: {cart.shippingAddress.address}</strong>
                      <br />
                      <strong>Cidade: {cart.shippingAddress.city}</strong>
                      <br />
                      <strong>Email: {cart.shippingAddress.email}</strong>
                      <br />
                      <strong>Whatsapp: {cart.shippingAddress.phone}</strong>
                    </p>
                    <Link
                      to="/admin/product/store/register-customer"
                      className="text-green-300"
                    >
                      Editar
                    </Link>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="bg-gray-500 rounded-md p-4">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Pagamento
                    </h2>
                    <p>
                      <strong>Método:</strong> {cart.paymentMethod}
                    </p>
                    <Link to="/admin/payment" className="text-green-300">
                      Editar
                    </Link>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="bg-gray-500 rounded-md p-4">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Items
                    </h2>
                    <ul className="list-none">
                      {cart.cartItems.map((item) => (
                        <li
                          key={item._id}
                          className="mb-4 border-b border-gray-300 pb-4 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <div className="w-2/5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-32 h-32 rounded-md object-cover"
                              />
                            </div>
                            <div className="w-1/5 text-center">
                              <span className="text-lg font-semibold text-gray-200">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="w-2/5 text-right">
                              <span className="text-lg font-semibold text-gray-200">
                                R$ {item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-green-300">{item.name}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Link to="/admin/cart" className="text-green-300">
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:w-4/12">
                <div className="bg-gray-500 rounded-md p-4">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Resumo do Pedido
                  </h2>
                  <ul className="list-none">
                    <li className="mb-2">
                      <div className="flex justify-between">
                        <span>Items</span>
                        <span>R$ {cart.itemsPrice.toFixed(2)}</span>
                      </div>
                    </li>

                    <li className="mb-2">
                      <div className="flex justify-between">
                        <span>Total do Pedido</span>
                        <span className="font-semibold text-green-300">
                          R$ {cart.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={placeOrderHandler}
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                          disabled={cart.cartItems.length === 0}
                        >
                          Finalizar Comprar
                        </button>
                      </div>
                      {loading && <LoadingBox />}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
