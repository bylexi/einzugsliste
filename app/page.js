'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WishlistPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [purchasedVisible, setPurchasedVisible] = useState(true)

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/items')
      if (!res.ok) {
        throw new Error('Fehler beim Laden der Liste.')
      }
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handlePurchase = async (id) => {
    if (window.confirm('Hast du diesen Artikel wirklich gekauft? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      try {
        const res = await fetch(`/api/items/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_purchased: true }),
        })
        if (!res.ok) {
          throw new Error('Fehler beim Markieren als gekauft.')
        }
        fetchItems()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const unpurchasedItems = items.filter(item => !item.is_purchased)
  const purchasedItems = items.filter(item => item.is_purchased)

  const renderError = () => (
    <div className="bg-red-500 text-white text-center p-4 fixed top-0 left-0 w-full z-50">
      {error}
      <button onClick={() => setError(null)} className="ml-4 font-bold">X</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFAF6] text-[#333]">
      {error && renderError()}
      <header className="relative text-center py-20 px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c0457d1d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}
        ></div>
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold text-[#D4724A] font-playfair-display">Liste für Einzug</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto font-lato">
            Herzlich Willkommen zu unserer Liste für unseren Einzug 🏡
          </p>
        </div>
        <Link href="/admin" className="absolute top-4 right-4 text-sm text-[#D4724A] hover:underline font-lato">
          Admin
        </Link>
      </header>

      <main className="p-4 md:p-8">
        {loading ? (
          <div className="text-center text-2xl font-playfair-display">Lade Liste...</div>
        ) : items.length === 0 && !error ? (
           <div className="text-center text-2xl text-gray-500 font-playfair-display">Noch keine Wünsche eingetragen 🏡</div>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-4xl font-bold mb-6 text-center font-playfair-display">Unsere Liste 🏠:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {unpurchasedItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-64 object-cover"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 font-playfair-display">{item.name}</h3>
                      {item.description && <p className="text-gray-600 mb-4 font-lato">{item.description}</p>}
                      <div className="flex justify-between items-center mt-4">
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#D4724A] hover:underline font-lato">
                            Zum Produkt →
                          </a>
                        )}
                        <button
                          onClick={() => handlePurchase(item.id)}
                          className="bg-[#D4724A] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-lato"
                        >
                          ✓ Als gekauft markieren
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {purchasedItems.length > 0 && (
              <section>
                <div className="text-center mb-6">
                  <button onClick={() => setPurchasedVisible(!purchasedVisible)} className="text-3xl font-bold text-gray-600 hover:text-black transition-colors font-playfair-display">
                    Bereits besorgt ✓ {purchasedVisible ? '▲' : '▼'}
                  </button>
                </div>
                {purchasedVisible && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {purchasedItems.map((item) => (
                      <div key={item.id} className="bg-green-50 rounded-lg shadow-sm overflow-hidden opacity-70">
                         {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-64 object-cover"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        )}
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-2 text-gray-500 line-through font-playfair-display">
                            {item.name} <span className="text-green-500">✓</span>
                          </h3>
                          {item.description && <p className="text-gray-500 mb-4 font-lato">{item.description}</p>}
                           {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 pointer-events-none font-lato">
                              Zum Produkt
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

