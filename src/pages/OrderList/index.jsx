import { useContext, useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { CgDetailsMore } from 'react-icons/cg'
import { IoTrashOutline } from 'react-icons/io5'

import LoadingBox from '../../components/LoadingBox'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'
import Sidebar from '../../components/Sidebar'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      return state
  }
}

export default function OrderList() {
  const navigate = useNavigate()
  const { state } = useContext(Store)
  const { userInfo } = state

  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await api.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [userInfo, successDelete])

  const deleteHandler = async (order) => {
    if (window.confirm('Tem certeza que deseja apagar este pedido?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' })
        await api.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        toast.success('Pedido apagado com sucesso')
        dispatch({ type: 'DELETE_SUCCESS' })
      } catch (err) {
        toast.error(getError(error))
        dispatch({
          type: 'DELETE_FAIL',
        })
      }
    }
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-center pt-20 ml-10">
        <Helmet>
          <title>Rel78 Store | Vendas</title>
        </Helmet>
        <h1 className="text-2xl font-semibold text-white pb-5">Vendas</h1>
        {loadingDelete && <LoadingBox />}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <h1 className="text-red-500">{error}</h1>
        ) : (
          <div className="">
            <table className="min-w-full table-auto shadow-md rounded bg-gray-500">
              <thead>
                <tr className="text-left text-gray-200">
                  <th className="px-4 py-2">Cliente</th>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Pago</th>
                  <th className="px-4 py-2">Entregue</th>
                  <th className="px-4 py-2">Ação</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200">
                    <td className="px-4 py-2">
                      {order.user ? order.user.name : 'Cliente'}
                    </td>
                    <td className="px-4 py-2">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-2">
                      {order.totalPrice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {order.isPaid
                        ? format(new Date(order.paidAt), 'dd/MM/yyyy')
                        : 'Não'}
                    </td>

                    <td className="px-4 py-2">
                      {order.isDelivered
                        ? format(new Date(order.deliveredAt), 'dd/MM/yyyy')
                        : 'Não'}
                    </td>

                    <td className="px-4 py-2 space-x-2">
                      <button
                        type="button"
                        className="bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => {
                          navigate(`/admin/placeorder/${order._id}`)
                        }}
                      >
                        <CgDetailsMore color="#FFFFFF" size={20} />
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => deleteHandler(order)}
                      >
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
