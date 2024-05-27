import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import api from '../../service/api'

import { Store } from '../../service/store'
import { toast } from 'react-toastify'
import { getError } from '../../service/utils'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const { data } = await api.post('/api/user/signin', {
        email,
        password,
      })
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/admin/dashboard')
      toast.success(`Bem vindo`)
    } catch (err) {
      toast.error(getError(err))
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-4">
        <Helmet>
          <title>Rel78 Store | Conectar</title>
        </Helmet>

        <div>
          <div className="text-center p-10">
            <span className="text-9xl">Rel78</span>
            <span className="text-blue-700 text-9xl">.</span>
          </div>
        </div>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <input
              placeholder="Seu melhor email"
              type="email"
              id="email"
              className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 relative">
            <input
              placeholder="Digite sua senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible color="#111827" />
              ) : (
                <AiFillEye color="#111827" />
              )}
            </span>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
            >
              Conectar
            </button>
          </div>
          <div className="mb-4 text-sm text-white text-center">
            Não tem uma conta?{' '}
            <Link to={`/signup`} className="text-blue-500">
              Cadastrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
