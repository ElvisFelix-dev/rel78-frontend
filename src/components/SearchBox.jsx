import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuSearch } from 'react-icons/lu'

export default function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(query ? `/admin/search/?query=${query}` : '/admin/search')
  }

  return (
    <form
      className="flex items-center space-x-2 me-auto"
      onSubmit={submitSearch}
    >
      <input
        type="text"
        name="q"
        id="q"
        className="w-full border rounded px-3 py-2 placeholder-gray-400 bg-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar"
      />
      <button
        type="submit"
        className="w-7 rounded px-3 py-2 placeholder-gray-400 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
      >
        <LuSearch />
      </button>
    </form>
  )
}
