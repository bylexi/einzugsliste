'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', description: '', link: '' })
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items')
      if (!res.ok) throw new Error('Fehler beim Laden der Items.')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems()
    }
  }, [isAuthenticated])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Falsches Passwort')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setImageUrl(data.url)
      } else {
        throw new Error('Bild-Upload fehlgeschlagen.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItem.name) return

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, image_url: imageUrl }),
      })
      if (res.ok) {
        setNewItem({ name: '', description: '', link: '' })
        setImageUrl('')
        fetchItems()
      } else {
        throw new Error('Fehler beim Hinzufügen des Wunsches.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm('Diesen Eintrag wirklich löschen?')) {
      setError('')
      try {
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
        if (res.ok) {
          fetchItems()
        } else {
          throw new Error('Fehler beim Löschen.')
        }
      } catch (e) {
        setError(e.message)
      }
    }
  }

  const handleMarkAsUnpurchased = async (id) => {
     setError('')
     try {
        const res = await fetch(`/api/items/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_purchased: false }),
        })
        if (res.ok) {
            fetchItems()
        } else {
            throw new Error('Fehler beim Aktualisieren.')
        }
    } catch (e) {
        setError(e.message)
    }
  }

  const renderError = () => (
    <div className="bg-red-500 text-white text-center p-4 fixed top-0 left-0 w-full z-50">
      {error}
      <button onClick={() => setError(null)} className="ml-4 font-bold">X</button>
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center font-lato">
        {error && renderError()}
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center text-[#D4724A] font-playfair-display">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4724A]"
              required
              disabled={submitting}
            />
            <button
              type="submit"
              className="w-full bg-[#D4724A] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? 'Prüfe...' : 'Einloggen'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] p-8 font-lato text-[#333]">
      {error && renderError()}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-[#D4724A] font-playfair-display">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-[#D4724A] hover:underline">
            Abmelden
          </button>
        </div>

        {/* Neuen Wunsch hinzufügen */}
        <section className="mb-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 font-playfair-display">Neuen Wunsch hinzufügen</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <input
              type="text"
              placeholder="Name des Wunsches"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <textarea
              placeholder="Beschreibung (optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md h-24"
            />
            <input
              type="text"
              placeholder="Link zum Produkt (https://...)"
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Bild-Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4724A] file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
                disabled={uploading}
              />
              {uploading && <p>Wird hochgeladen...</p>}
              {imageUrl && <img src={imageUrl} alt="Vorschau" className="mt-4 h-32 w-auto rounded-md" />}
            </div>
            <button 
              type="submit" 
              className="bg-[#D4724A] text-white px-6 py-2 rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
              disabled={submitting || uploading}
            >
              {submitting ? 'Wird hinzugefügt...' : 'Wunsch hinzufügen'}
            </button>
          </form>
        </section>

        {/* Bestehende Items verwalten */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-playfair-display">Items verwalten</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <img src={item.image_url || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${item.is_purchased ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {item.is_purchased ? 'Gekauft' : 'Offen'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.is_purchased && (
                    <button onClick={() => handleMarkAsUnpurchased(item.id)} className="text-sm text-blue-500 hover:underline">
                      Als nicht gekauft markieren
                    </button>
                  )}
                  <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full bg-red-100">
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
