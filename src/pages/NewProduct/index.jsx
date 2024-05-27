import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../../components/LoadingBox'

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

export default function NewProduct() {
  const navigate = useNavigate()
  const params = useParams()
  const { id: productId } = params

  const { state } = useContext(Store)
  const { userInfo } = state
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    })

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('')
  const [codings, setCodings] = useState('')
  const [percent, setPercent] = useState(0)
  const [priceIncome, setPriceIncome] = useState(0)
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await api.get(`/api/products/${productId}`)
        setName(data.name)
        setSlug(data.slug)
        setPrice(data.price)
        setSize(data.size)
        setCodings(data.codings)
        setImage(data.image)
        setCategory(data.category)
        setCountInStock(data.countInStock)
        setBrand(data.brand)
        setDescription(data.description)
        dispatch({ type: 'FETCH_SUCCESS' })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    fetchData()
  }, [productId])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await api.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          size,
          codings,
          image,
          category,
          brand,
          countInStock,
          description,
          priceIncome,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      toast.success('Produto atualizado com sucesso')
      navigate('/admin/product')
    } catch (err) {
      toast.error(getError(err))
      dispatch({ type: 'UPDATE_FAIL' })
    }
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    try {
      dispatch({ type: 'UPLOAD_REQUEST' })
      const { data } = await api.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      dispatch({ type: 'UPLOAD_SUCCESS' })

      toast.success('Imagem enviada com sucesso')
      setImage(data.secure_url)
    } catch (err) {
      toast.error(getError(err))
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) })
    }
  }

  // Função para calcular o preço de saída com base no preço de entrada e na porcentagem
  const calculatePriceOutcome = () => {
    const priceIncomeFloat = parseFloat(priceIncome)
    const percentFloat = parseFloat(percent)

    // Verifique se os valores são válidos
    if (!isNaN(priceIncomeFloat) && !isNaN(percentFloat)) {
      // Converta a porcentagem em fração
      const fraction = percentFloat / 100

      // Calcule o preço de saída
      const calculatedPriceOutcome =
        priceIncomeFloat * priceIncomeFloat * fraction

      // Atualize o estado do preço de saída
      setPrice(calculatedPriceOutcome.toFixed(2)) // Formate para duas casas decimais
    } else {
      // Se os valores não forem válidos, defina o preço de saída como 0
      setPrice(0)
    }
  }

  return (
    <>
      <Sidebar />
      <div className="container mx-auto w-1/3 pt-16">
        <Helmet>
          <title>Rel78 Store | Cadastrar Produto</title>
        </Helmet>
        <h1 className="my-5 text-2xl font-semibold text-gray-200">
          Cadastro de Produto
        </h1>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <h1 className="text-red-500">{error}</h1>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Tamanho
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Codigo do Produto
              </label>
              <input
                type="text"
                value={codings}
                onChange={(e) => setCodings(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Valor de Saída
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Imagem do Arquivo
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Upload do Arquivo
              </label>
              <input
                type="file"
                onChange={uploadFileHandler}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {loadingUpload && <LoadingBox />}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Categoria
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Marca
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Stock
              </label>
              <input
                type="text"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-200">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className={`bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600 ${
                  loadingUpdate ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loadingUpdate}
              >
                Cadastrar
              </button>
              {loadingUpdate && <LoadingBox />}
            </div>
          </form>
        )}
      </div>
    </>
  )
}
