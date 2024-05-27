import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AdminRouter from './components/AdminRouter'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Customer from './pages/Customer'
import EditCustomer from './pages/EditCustomer'
import NewCustomer from './pages/NewCustomer'
import Product from './pages/Product'
import NewProduct from './pages/NewProduct'
import ProductProfile from './pages/ProductProfile'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import Report from './pages/Report'
import OrderList from './pages/OrderList'
// import Search from './pages/Search'
import EditProduct from './pages/EditProduct'
import GoSearch from './pages/GoSearch'
import RegisterCustomer from './pages/RegisterCustomer'

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRouter>
                <Dashboard />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <AdminRouter>
                <Profile />
              </AdminRouter>
            }
          />
          {/* Rotas de clientes */}
          <Route
            path="/admin/customer"
            element={
              <AdminRouter>
                <Customer />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/customer/:id"
            element={
              <AdminRouter>
                <EditCustomer />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/customer/newcustomer"
            element={
              <AdminRouter>
                <NewCustomer />
              </AdminRouter>
            }
          />

          {/* Rotas para produtos */}

          <Route
            path="/admin/product"
            element={
              <AdminRouter>
                <Product />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/product/:id"
            element={
              <AdminRouter>
                <NewProduct />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/product/edit/:id"
            element={
              <AdminRouter>
                <EditProduct />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/product/store/:slug"
            element={
              <AdminRouter>
                <ProductProfile />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/product/store/register-customer"
            element={
              <AdminRouter>
                <RegisterCustomer />
              </AdminRouter>
            }
          />

          {/* Carrinho */}

          <Route
            path="/admin/cart"
            element={
              <AdminRouter>
                <Cart />
              </AdminRouter>
            }
          />

          {/* Pagamento */}

          <Route
            path="/admin/payment"
            element={
              <AdminRouter>
                <Payment />
              </AdminRouter>
            }
          />

          {/* Pedidos */}

            <Route
            path="/admin/placeorder"
            element={
              <AdminRouter>
                <PlaceOrder />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/placeorder/:id"
            element={
              <AdminRouter>
                <Order />
              </AdminRouter>
            }
          />

          <Route
            path="/admin/placeorder/list"
            element={
              <AdminRouter>
                <OrderList />
              </AdminRouter>
            }
          />

          {/* Relatorio */}

          <Route
            path="/admin/report"
            element={
              <AdminRouter>
                <Report />
              </AdminRouter>
            }
          />

          {/* Busca de Prodtos */}

          {/* <Route
            path="/admin/search"
            element={
              <AdminRouter>
                <Search />
              </AdminRouter>
            }
          /> */}

          <Route
            path="/admin/go-search"
            element={
              <AdminRouter>
                <GoSearch />
              </AdminRouter>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </>
  )
}
