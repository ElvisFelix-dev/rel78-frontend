import { useContext, useEffect, useReducer } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Helmet } from 'react-helmet-async'

import LoadingBox from '../../components/LoadingBox'

import api from '../../service/api'
import { getError } from '../../service/utils'
import { Store } from '../../service/store'

import Sidebar from '../../components/Sidebar'

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload }
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true }
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false }
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false }

    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function ProductProfile() {
  const navigate = useNavigate()
  const params = useParams()
  const { slug } = params

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  })

  // const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })

      try {
        const result = await api.get(`/api/products/slug/${slug}`)
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }

      // setProducts(result.data)
    }
    fetchData()
  }, [slug])

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await api.get(`/api/products/${product._id}`)
    if (data.countInStock < quantity) {
      window.alert('Desculpa. Esse produto acabou no estoque')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    })

    navigate('/admin/cart')
  }

  return loading ? (
    <div className="py-8">
      <LoadingBox />
    </div>
  ) : error ? (
    <div className="py-8">
      <h1 className="text-red-500">{error}</h1>
    </div>
  ) : (
    <div>
      <Sidebar />
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            className="w-full md:w-3/4 mx-auto pl-24 pt-20"
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className="md:w-1/2">
          <div>
            <Helmet>
              <title>Rel78 Store | {product.name}</title>
            </Helmet>
            <h1 className="text-xl font-semibold">{product.name}</h1>
          </div>

          <div className="mb-4 pt-20 text-gray-200">
            <p>
              Valor:{' '}
              {product.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
          <div className="mb-4 pt-20 text-gray-200">
            <p>Descrição: {product.description}</p>
          </div>
        </div>
        <div className="md:w-1/3 pt-20">
          <div className="border border-gray-200 rounded-lg shadow p-4">
            <div className="mb-4">
              <p className="font-semibold text-gray-200">
                Valor:{' '}
                {product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-gray-200">Status:</p>
              {product.countInStock > 0 ? (
                <span className="bg-green-500 text-white py-1 px-2 rounded">
                  Tem no estoque
                </span>
              ) : (
                <span className="bg-red-500 text-white py-1 px-2 rounded">
                  Indisponível no estoque
                </span>
              )}
            </div>
            {product.countInStock > 0 && (
              <div className="mb-4">
                <button
                  onClick={addToCartHandler}
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
                >
                  Adicionar no carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
