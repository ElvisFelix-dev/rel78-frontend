import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Helmet } from 'react-helmet-async'

import { LuSearch } from 'react-icons/lu'

import api from '../../service/api'
import { Store } from '../../service/store'

import Sidebar from '../../components/Sidebar'

export default function GoSearch(props) {
  const [codings, setCodings] = useState('')
  const [product, setProduct] = useState(null)
  const { products } = props

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const submitSearch = async (e) => {
    e.preventDefault()
    try {
      const response = await api.get(`/api/products/codings/${codings}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Erro ao buscar o produto pelo código:', error)
      setProduct(null) // Limpar o resultado em caso de erro
    }
  }

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === products._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await api.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      toast.error('Produto sem estoque')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  const addProductToCart = async (item) => {
    // Verifique se o produto já está no carrinho
    const existingItem = cartItems.find((x) => x._id === item._id)

    if (existingItem) {
      // Se o produto já está no carrinho, aumente a quantidade
      if (existingItem.quantity + 1 <= item.countInStock) {
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          },
        })
      } else {
        toast.error('Produto sem estoque suficiente')
      }
    } else {
      // Se o produto não está no carrinho, adicione com quantidade 1
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity: 1 },
      })
    }
  }

  return (
    <>
      <Sidebar />
      <div className=" min-h-screen py-12">
        <Helmet>
          <title>Rel78 Store | Buscar Produto</title>
        </Helmet>
        <div className="max-w-xs mx-auto p-6 bg-gray-500 shadow-md rounded-md mt-10">
          <form
            className="flex items-center space-x-2 me-auto"
            onSubmit={submitSearch}
          >
            <input
              type="text"
              name="q"
              id="q"
              className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setCodings(e.target.value)}
              placeholder="Buscar"
            />
            <button
              type="submit"
              className="w-7 rounded px-3 py-2 placeholder-gray-400 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            >
              <LuSearch />
            </button>
          </form>
        </div>
        {product ? (
          <div className="max-w-xs mx-auto p-1 bg-gray-500 shadow-md rounded-md mt-10">
            <img
              className="p-8 rounded-t-lg"
              src={product.image}
              alt={product.name}
            />
            <div className="px-5 pb-5">
              <Link to={`/admin/product/store/${product.slug}`}>
                <h5 className="text-xl  font-semibold tracking-tight text-gray-900 dark:text-white flex items-center flex-col justify-between pb-3">
                  {product.name}
                </h5>
              </Link>
              <div className="flex items-center flex-col justify-between">
                <span className="text-lg font-semibold text-white">
                  <span>Codigo :</span> {product.codings}
                </span>
              </div>

              <div className="flex items-center flex-col justify-between">
                <span className="text-lg font-semibold text-white pb-3">
                  {product.description}
                </span>

                <span className="text-3xl font-bold text-gray-200 dark:text-white pb-3">
                  {product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
                {product.countInStock === 0 ? (
                  <button
                    className="text-gray-600 py-2 px-4 rounded cursor-not-allowed"
                    disabled
                  >
                    Sem stock
                  </button>
                ) : (
                  <button
                    className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white"
                    onClick={() => addProductToCart(product)}
                  >
                    Adicionar ao carrinho
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xs mx-auto p-6 bg-gray-500 shadow-md rounded-md mt-10">
            <p className="text-red-500">Código não encontrado.</p>
          </div>
        )}
      </div>
    </>
  )
}
