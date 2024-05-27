import { useContext, useEffect, useReducer } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { RiBallPenLine } from 'react-icons/ri'
import { IoTrashOutline } from 'react-icons/io5'

import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'

import LoadingBox from '../../components/LoadingBox'

import Sidebar from '../../components/Sidebar'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true }
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      }
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false }

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false }

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }

    default:
      return state
  }
}

export default function Product() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const page = sp.get('page') || 1

  const { state } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })

        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {}
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [page, userInfo, successDelete])

  const createHandler = async () => {
    if (window.confirm('Deseja cadastrar um produto?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' })
        const { data } = await api.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        )
        toast.success('Produto criado com sucesso')
        dispatch({ type: 'CREATE_SUCCESS' })
        navigate(`/admin/product/${data.product._id}`)
      } catch (err) {
        toast.error(getError(error))
        dispatch({
          type: 'CREATE_FAIL',
        })
      }
    }
  }

  const deleteHandler = async (product) => {
    if (window.confirm('Vai apagar mesmo?')) {
      try {
        console.log('Product ID to delete:', product._id) // Adicione esta linha
        await api.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        toast.success('Produto apagado com sucesso')
        dispatch({ type: 'DELETE_SUCCESS' })
      } catch (err) {
        toast.error(getError(err))
        console.log(err)
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
          <title>Rel78 Store | Produtos</title>
        </Helmet>
        <div className="flex items-center justify-between mb-4 space-x-72">
          <h1 className="text-2xl font-semibold text-white">Produtos</h1>
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={createHandler}
            >
              Criar Produto
            </button>
          </div>
        </div>

        {loadingCreate && <LoadingBox />}
        {loadingDelete && <LoadingBox />}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <h1>{error}</h1>
        ) : (
          <>
            <table className="mx-auto table-auto shadow-md rounded bg-gray-500">
              <thead>
                <tr className=" text-gray-200">
                  <th className="py-2 px-4">Código</th>
                  <th className="py-2 px-4">Nome</th>
                  <th className="py-2 px-4">Valor</th>
                  <th className="py-2 px-4">Tamanho</th>
                  <th className="py-2 px-4">Categoria</th>
                  <th className="py-2 px-4">Marca</th>
                  <th className="py-2 px-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} className="text-gray-200">
                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {product.codings}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {product.name}
                    </td>

                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {product.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>

                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {product.size}
                    </td>

                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {product.category}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      {product.brand}
                    </td>
                    <td
                      className={`py-2 px-3 ${
                        index !== products.length - 1 ? 'border-b-2' : ''
                      }`}
                    >
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                        onClick={() =>
                          navigate(`/admin/product/edit/${product._id}`)
                        }
                      >
                        <RiBallPenLine />
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => deleteHandler(product)}
                      >
                        <IoTrashOutline />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  className={
                    x + 1 === Number(page)
                      ? 'bg-blue-500 text-white py-1 px-3 rounded-full mr-2'
                      : 'bg-gray-300 text-blue-500 py-1 px-3 rounded-full mr-2'
                  }
                  key={x + 1}
                  to={`/admin/product?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
