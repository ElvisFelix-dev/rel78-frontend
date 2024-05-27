import { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import { getError } from '../../service/utils'
import api from '../../service/api'

import { Store } from '../../service/store'
import Sidebar from '../../components/Sidebar'

const reducer = (state, action) => {
  switch (action.type) {
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

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false)
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const [name, setName] = useState(userInfo.name)
  const [email, setEmail] = useState(userInfo.email)
  const [password, setPassword] = useState('')

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put(
        '/api/user/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Usuário atualizado com sucesso')
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      })
      toast.error(getError(err))
    }
  }

  return (
    <>
      <Sidebar />
      <div className=" min-h-screen py-12">
        <Helmet>
          <title>Rel78 Store | Perfil do Usuário</title>
        </Helmet>
        <div className="max-w-2xl mx-auto p-6 bg-gray-500 shadow-md rounded-md mt-10">
          <h1 className="text-3xl font-semibold mb-6 text-white">
            Perfil do Usuário
          </h1>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <input
                placeholder="Nome"
                type="text"
                id="name"
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500 cursor-not-allowed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
              />
            </div>
            <div className="mb-4">
              <input
                placeholder="Email"
                type="email"
                id="email"
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500 cursor-not-allowed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
