import { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { Helmet } from 'react-helmet-async'

import Sidebar from '../../components/Sidebar'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

export default function Customer() {
  const navigate = useNavigate()
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const { state } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await api.get(`/api/customer`, {
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
    fetchData()
  }, [userInfo])
  return (
    <div>
      <Sidebar />
      <div className="flex flex-col items-center pt-20 ml-10">
        <Helmet>
          <title>Rel78 Store | Clientes</title>
        </Helmet>
        <div className="flex items-center justify-between mb-4 space-x-72">
          <h1 className="text-2xl font-semibold text-white mr-4">Clientes</h1>
          <Link to="/admin/customer/newcustomer">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-4">
              Cadastrar Clientes
            </button>
          </Link>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="mx-auto table-auto shadow-md rounded bg-gray-500">
              <thead>
                <tr className="text-gray-200">
                  <th className="py-1 px-2">Nome</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">CPF</th>
                  <th className="py-2 px-3">Rede Social</th>
                  <th className="py-2 px-3">Endereço</th>
                  <th className="py-2 px-3">Cidade</th>
                  <th className="py-2 px-3">Whatsapp</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="text-gray-200">
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.name}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.email}
                    </td>

                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.cpf}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.social}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.address}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.city}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {user.phone}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== users.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => navigate(`/admin/customer/${user._id}`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
