import React, { useEffect, useState } from 'react'
import api from '../../service/api'

export default function Search() {
  const [codings, setCodings] = useState('')
  const [product, setProduct] = useState(null)

  const handleSearch = async () => {
    try {
      const response = await api.get(`/api/products/codings/${codings}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Erro ao buscar o produto pelo código:', error)
      setProduct(null) // Limpar o resultado em caso de erro
    }
  }

  useEffect(() => {
    // Você pode chamar handleSearch automaticamente aqui se desejar
  }, [])

  return (
    <div>
      <h2>Buscar Produto pelo Código</h2>
      <div>
        <input
          type="text"
          placeholder="Digite o código"
          value={codings}
          onChange={(e) => setCodings(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {product ? (
        <div>
          <h3>Nome do Produto: {product.name}</h3>
          {/* Adicione mais detalhes do produto aqui */}
        </div>
      ) : (
        <p>Código não encontrado.</p>
      )}
    </div>
  )
}
