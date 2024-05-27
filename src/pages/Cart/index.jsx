import { useContext } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BiChevronLeft, BiChevronRight, BiTrash } from 'react-icons/bi'

import api from '../../service/api'
import { Store } from '../../service/store'

import Sidebar from '../../components/Sidebar'

export default function Cart() {
  const navigate = useNavigate()

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const updateCartHandler = async (item, quantity) => {
    const { data } = await api.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      toast.alert('Desculpe, não temos esse produto em stock')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const checkoutHandler = () => {
    navigate('/admin/product/store/register-customer')
  }

  return (
    <>
      <Sidebar />
      <div>
        <Helmet>
          <title>Rel78 Store | Carrinho de compras</title>
        </Helmet>

        <div className="md:flex">
          <div className="md:w-8/12">
            {cartItems.length === 0 ? (
              <div className="mt-4">
                <div className="flex items-center justify-between pl-28 pt-8">
                  <p className="text-red-500 pl-48 pt-40">
                    Carrinho está vazio.{' '}
                  </p>
                </div>
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {cartItems.map((item) => (
                  <li key={item._id}>
                    <div className="flex items-center space-x-4 pl-40 pt-20">
                      <div className="w-1/4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full rounded-lg"
                        />
                      </div>
                      <div>
                        <span>Descrição:</span> {item.description}
                        <br />
                        <br />
                        <span>Codigo:</span> {item.codings}
                      </div>
                      <div className="w-3/12">
                        <button
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          className={`px-2 py-1 rounded ${
                            item.quantity === 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                          }`}
                          disabled={item.quantity === 1}
                        >
                          <BiChevronLeft />
                        </button>
                        <span className="mx-2 text-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          className={`px-2 py-1 rounded ${
                            item.quantity === item.countInStock
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                          }`}
                          disabled={item.quantity === item.countInStock}
                        >
                          <BiChevronRight />
                        </button>
                      </div>
                      <div className="w-3/12 text-gray-200">
                        {' '}
                        {item.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </div>
                      <div className="w-1/12">
                        <button
                          onClick={() => removeItemHandler(item)}
                          className="px-2 py-1 text-red-500 hover:text-red-700"
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:w-1/4 pt-32 pr-10">
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-200">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items){' '}
                :{' '}
                {cartItems
                  .reduce((a, c) => a + c.price * c.quantity, 0)
                  .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
              </h3>
            </div>
            <div className="mt-4">
              <button
                onClick={checkoutHandler}
                className={`w-full px-4 py-2 text-white rounded ${
                  cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={cartItems.length === 0}
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
