import { useContext, useEffect, useReducer, useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'
import Sidebar from '../../components/Sidebar'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false }
    default:
      return state
  }
}
export default function EditCustomer() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const { state } = useContext(Store)
  const { userInfo } = state

  const params = useParams()
  const { id: userId } = params
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [social, setSocial] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await api.get(`/api/customer/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        setName(data.name)
        setEmail(data.email)
        setSocial(data.social)
        setAddress(data.address)
        setCity(data.city)
        setPhone(data.phone)

        dispatch({ type: 'FETCH_SUCCESS' })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    fetchData()
  }, [userId, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await api.put(
        `/api/customer/${userId}`,
        { _id: userId, name, email, social, address, city, phone },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      toast.success('Usuário atualizado com sucesso')
      navigate('/admin/customer')
    } catch (error) {
      toast.error(getError(error))
      dispatch({ type: 'UPDATE_FAIL' })
    }
  }

  return (
    <>
      <Sidebar />
      <div className="flex justify-center items-center h-screen ">
        <div className="container mx-auto p-4 w-1/3 bg-gray-500 shadow-md rounded-md">
          <Helmet>
            <title>Rel78 Store | Editar Cliente</title>
          </Helmet>
          <h1 className="text-2xl font-semibold mb-4 text-white">
            Editar Cliente | {name}
          </h1>

          {loading ? (
            <div className="text-center">Carregando...</div>
          ) : error ? (
            <div className="bg-red-500 text-white p-2 mb-4">{error}</div>
          ) : (
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500 cursor-not-allowed"
                  required
                  placeholder="Nome completo"
                />
              </div>
              <div className="mb-4">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <input
                  id="social"
                  type="social"
                  value={social}
                  onChange={(e) => setSocial(e.target.value)}
                  className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Rede Social"
                />
              </div>

              <div className="mb-4">
                <input
                  id="address"
                  type="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Endereço"
                />
              </div>

              <div className="mb-4">
                <input
                  id="phone"
                  type="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Whatsapp"
                />
              </div>

              <div className="mb-4">
                <input
                  id="city"
                  type="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Cidade"
                />
              </div>

              <div className="mb-4">
                <button
                  disabled={loadingUpdate}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
                >
                  Atualizar
                </button>
                {loadingUpdate && (
                  <div className="inline-block ml-4">Carregando...</div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
