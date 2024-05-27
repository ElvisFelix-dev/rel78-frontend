/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { isDate, format } from 'date-fns'
import { FaMoneyBill } from 'react-icons/fa'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

import LoadingBox from '../../components/LoadingBox'
import Sidebar from '../../components/Sidebar'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true }
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true }
    case 'PAY_FAIL':
      return { ...state, loadingPay: false }
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false }

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true }
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true }
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false }
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      }

    default:
      return state
  }
}

export default function Order() {
  const [orderIsPaid, setOrderIsPaid] = useState(false);

  const { state } = useContext(Store)
  const { userInfo } = state

  const params = useParams()
  const { id: orderId } = params
  const navigate = useNavigate()

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  })

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  const date = new Date()

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  const formattedDate = date.toLocaleString('pt-BR', options)

  const formattedPaidAt = isDate(order.paidAt)
    ? format(order.paidAt, 'dd/MM/yyyy HH:mm')
    : (formattedDate)

  const formattedDeliveredAt = isDate(order.paidAt)
    ? format(order.deliveredAt, 'dd/MM/yyyy HH:mm')
    : (formattedDate)

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await api.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          },
        )
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        toast.success('Pedido Pago')
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) })
        toast.error(getError(err))
      }
    })
  }
  function onError(err) {
    toast.error(getError(err))
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await api.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    if (!userInfo) {
      return navigate('/signin')
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder()

      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }

      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await api.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'BRL',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ])

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' })
      const { data } = await api.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      )
      dispatch({ type: 'DELIVER_SUCCESS', payload: data })
      toast.success('Compra Finalizada')
    } catch (err) {
      toast.error(getError(err))
      dispatch({ type: 'DELIVER_FAIL' })
    }
  }

  async function payWithCashHandler() {
    try {
      dispatch({ type: 'PAY_REQUEST' });

      // Simular pagamento com dinheiro
      // Você pode ajustar esta parte de acordo com sua lógica de pagamento com dinheiro

      const { data } = await api.put(`/api/orders/${order._id}/pay`, null, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setOrderIsPaid(true);
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Pedido Pago com Dinheiro');
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <h1 className="text-red-500">{error}</h1>
  ) : (
    <>
      <Sidebar/>
      <div className=" min-h-screen py-12">
      <div className="max-w-2xl mx-auto p-6 bg-gray-500 shadow-md rounded-md mt-10">
      <Helmet>
        <title>Rel78 Store | Compra</title>
      </Helmet>
      <h1 className="my-3">Compra</h1>
      <div className="md:flex">
        <div className="md:w-8/12 mb-3 md:mb-0">
          <div className="mb-3">
            <div className="bg-gray-500 rounded-md p-4">
              <h2 className="text-xl font-semibold text-neutral-900">Entrega</h2>
              <p>
                <strong>Nome: {order.shippingAddress.fullName}</strong>
                <br />
                <strong>CPF: {order.shippingAddress.cpf}</strong>
                <br />
                <strong>Endereço: {order.shippingAddress.address}</strong>
                <br />
                <strong>Cidade: {order.shippingAddress.city}</strong>
                <br />
                <strong>Email: {order.shippingAddress.email}</strong>
                <br />
                <strong>Whatsapp: {order.shippingAddress.phone}</strong>
                <br />
                <strong>Instagram: {order.shippingAddress.social}</strong>
              </p>
              {order.isDelivered ? (
                <h1 className="text-green-500">
                  Entregue {formattedDeliveredAt}
                </h1>
              ) : (
                <h1 className="text-red-500">Não Entregue</h1>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-gray-500 rounded-md p-4">
              <h2 className="text-xl font-semibold text-neutral-900">Pagamento</h2>
              <p>
                <strong>Método:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <h1 className="text-green-500"> Pago em {formattedPaidAt}</h1>
              ) : (
                <h1 className="text-red-500">Não Pagou</h1>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-gray-500 rounded-md p-4">
              <h2 className="text-xl font-semibold text-neutral-900">Items</h2>
              <ul className="list-none">
                {order.orderItems.map((item) => (
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
                          {item.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Link
                        to={`/admin/product/store/${item.slug}`}
                        className="text-green-300"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="md:w-4/12">
          <div className="bg-gray-500 rounded-md p-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              Resumo da Compra
            </h2>
            <ul className="list-none">
              <li className="mb-2">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{order.itemsPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>

                </div>
              </li>

              <li className="mb-2">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-green-300">
                    {order.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </li>
              {!order.isPaid && (
                <li className="mb-2">
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                  {loadingPay && <LoadingBox />}
                </li>
              )}

                <div>
                  <button
                    className="w-full flex items-center justify-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    type="button"
                    onClick={payWithCashHandler}
                    disabled={order.isPaid || loading}
                  >
                    <FaMoneyBill className="mr-2" /> {/* Adiciona margem à direita para espaçamento */}
                    Pagar com Dinheiro
                  </button>
                </div>



              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingBox />}
                  <div className="d-grid">
                    <button
                      type="button"
                      onClick={deliverOrderHandler}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  )
}
