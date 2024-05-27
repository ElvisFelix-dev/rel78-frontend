import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../service/api'

import { Store } from '../service/store'

export function ProductCard(props) {
  const { product } = props

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await api.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      toast.alert('Desculpa. Produto sem estoque.')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  return (
    <div>
      <div className="w-full  max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Link to={`/admin/product/store/${product.slug}`}>
          <img
            className="p-8 rounded-t-lg"
            src={product.image}
            alt={product.name}
          />
        </Link>
        <div className="px-5 pb-3">
          <Link to={`/admin/product/store/${product.slug}`}>
            <h5 className="text-xl  font-semibold tracking-tight text-gray-900 dark:text-white flex items-center flex-col justify-between pb-3">
              {product.name}
            </h5>
          </Link>
          <span className="text-sm font-semibold text-gray-500 pb-3">
            <span>Codigo:</span> {product.codings}
          </span>
          <div className="flex items-center flex-col justify-between">
            <span className="text-lg font-semibold text-gray-500 pb-3">
              {product.description}
            </span>

            <span className="text-3xl font-bold text-blue-500  pb-3">
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
                onClick={() => addToCartHandler(product)}
              >
                Adicionar a compra
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
