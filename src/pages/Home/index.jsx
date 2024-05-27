import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'

export default function Home() {
  return (
    <>
      <section className="bg-gray-900 text-white">
        <Helmet>
          <title>Rel78 Store</title>
        </Helmet>
        <div className="flex flex-wrap">
          <div className="w-full sm:w-8/12 mb-10">
            <div className="container mx-auto h-full sm:p-10">
              <nav className="flex px-4 justify-between items-center">
                <div className="text-4xl font-bold">
                  Rel78<span className="text-blue-700">.</span>
                </div>
                <div>
                  <img
                    src="https://image.flaticon.com/icons/svg/497/497348.svg"
                    alt=""
                    className="w-8"
                  />
                </div>
              </nav>
              <header className="container px-4 lg:flex mt-10 items-center h-full lg:mt-0">
                <div className="w-full">
                  <h1 className="text-4xl lg:text-6xl font-bold">
                    Nossa loja <span className="text-blue-700">Rel78</span>{' '}
                    sempre seguindo as tendências
                  </h1>
                  <div className="w-20 h-2 bg-blue-700 my-4"></div>
                  <p className="text-xl mb-10">
                    <span className="text-blue-700">Rel78</span> : Onde Estilo e
                    Exclusividade se Encontram. Descubra uma Curadoria Única de
                    Produtos de Qualidade, Projetados para Transformar o Seu Dia
                    a Dia com Elegância e Sofisticação.
                  </p>
                  <Link
                    className="bg-blue-600 text-white text-2xl font-medium px-4 py-2 rounded shadow hover:bg-blue-800 hover:text-white"
                    to="/admin/dashboard"
                  >
                    Ir para o Dashboard
                  </Link>
                </div>
              </header>
            </div>
          </div>
          <div className="w-full h-full object-cover sm:h-screen sm:w-4/12">
            <img
              src="https://i.pinimg.com/originals/21/ae/f6/21aef609b23ffe468a44209d5b69dd21.jpg"
              alt="Leafs"
            />
          </div>
        </div>
        <Footer />
      </section>
    </>
  )
}
