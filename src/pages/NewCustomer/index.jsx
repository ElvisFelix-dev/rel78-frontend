import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Helmet } from 'react-helmet-async'

import api from '../../service/api'
import { Store } from '../../service/store'

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

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      }
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload }
    default:
      return state
  }
}

export default function NewCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    social: '',
    address: '',
    phone: '',
    city: '',
    cpf: '',
  })
  const { state } = useContext(Store)
  const { userInfo } = state

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post(
        '/api/customer/create-customer',
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      )
      console.log('Usuário criado:', response.data)
      // Aqui você pode fazer algo com a resposta, como redirecionar o usuário para outra página.
      toast.success('Cliente cadastrado com sucesso')
      navigate('/admin/customer')
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  return (
    <>
      <Sidebar />

      <div className="flex justify-center items-center h-screen ">
        <div className="container mx-auto p-4 w-1/3 bg-gray-500 shadow-md rounded-md">
          <Helmet>
            <title>Afrodite | Cadastrar Cliente</title>
          </Helmet>
          <h1 className="text-2xl font-semibold mb-4 text-white">
            Cadastrar Cliente
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Nome completo"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="CPF"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Endereço"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Cidade"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Email"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="social"
                value={formData.social}
                onChange={handleChange}
                className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Rede Social"
              />
            </div>

            <div className="mb-4">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full  rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Whatsapp"
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
