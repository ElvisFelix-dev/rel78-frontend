import { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'

import LoadingBox from '../../components/LoadingBox'
import { ProductCard } from '../../components/ProductCard'
import Sidebar from '../../components/Sidebar'

import api from '../../service/api'
import { Helmet } from 'react-helmet-async'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function Dashboard() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  })

  // const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })

      try {
        const result = await api.get('/api/products')
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message })
      }

      // setProducts(result.data)
    }
    fetchData()
  }, [])
  return (
    <div className="flex">
      <Helmet>
        <title>Rel78 Store | Home</title>
      </Helmet>
      <Sidebar />
      <div className="flex-1">
        <div className="flex justify-center items-center min-h-screen mx-auto pl-40 pb-10">
          <div className="products">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {products.map((product) => (
                  <div key={product.slug} className="mb-3">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
