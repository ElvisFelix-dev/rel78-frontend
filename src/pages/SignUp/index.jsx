import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import api from '../../service/api'

import { Store } from '../../service/store'
import { toast } from 'react-toastify'
import { getError } from '../../service/utils'

import imgBruna from '../../assets/imgBruna.png'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Senha não está batendo')
      return
    }
    try {
      const { data } = await api.post('/api/user/signup', {
        name,
        email,
        password,
      })
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/')
      toast.success('Usuário criado com sucesso')
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
          <title>Rel78 Store | Cadastrar</title>
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
              placeholder="Como deseja ser chamado"
              type="text"
              id="name"
              className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="mb-4 relative">
            <input
              placeholder="Confirmar senha"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Cadastrar
            </button>
          </div>

          <div className="mb-4 text-sm text-white text-center">
            Já tem uma conta?{' '}
            <Link to={`/`} className="text-blue-500">
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
