import { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import Chart from 'react-google-charts'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'

import LoadingBox from '../../components/LoadingBox'
import Sidebar from '../../components/Sidebar'

import './styles.css'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function Report() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })
  const { state } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    fetchData()
  }, [userInfo])

  return (
    <>
      <Sidebar />
      <div className="pt-20">
        <Helmet>
          <title>Rel78 Store | Relatorios</title>
        </Helmet>
        <h1 className="text-2xl font-semibold text-gray-200 pl-44">
          Relatorios
        </h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <h1 className="text-red-500">{error}</h1>
        ) : (
          <>
            <div className="flex flex-wrap w-2/3  items-center pl-40">
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="bg-gray-500 shadow-md p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">
                    {summary.users && summary.users[0]
                      ? summary.users[0].numCustomers
                      : 0}
                  </h2>
                  <p className="text-gray-200">Clientes</p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="bg-gray-500 shadow-md p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </h2>
                  <p className="text-gray-200">Vendas</p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="bg-gray-500 shadow-md p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">
                    R${' '}
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </h2>
                  <p className="text-gray-200">Valor Das Vendas</p>
                </div>
              </div>
            </div>
            <div className="my-3 w-2/3 pl-44">
              <h2 className="text-xl font-semibold text-gray-200">Vendas</h2>
              {summary.dailyOrders.length === 0 ? (
                <h1 className="text-red-500">Sem Venda</h1>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Carregando gráfico...</div>}
                  data={[
                    ['Data', 'Vendas'],
                    ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                  ]}
                  options={{
                    chartArea: {
                      backgroundColor: '#f0f0f0', // Define a cor de fundo desejada
                    },
                  }}
                />
              )}
            </div>
            <div className="my-3 w-2/3 pl-44">
              <h2 className="text-xl font-semibold text-gray-200">
                Categorias
              </h2>
              {summary.productCategories.length === 0 ? (
                <h1 className="text-red-500"> Sem Categoria</h1>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  loader={<div>Carregando gráfico...</div>}
                  data={[
                    ['Category', 'Products'],
                    ...summary.productCategories.map((x) => [x._id, x.count]),
                  ]}
                ></Chart>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
