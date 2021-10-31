import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Avatar from './Avatar'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState(null)
  const [first_name, setFirstName] = useState(null)
  const [last_name, setLastName] = useState(null)
  const [country, setCountry] = useState(null)
  const [city, setCity] = useState(null)
  const [doc_url, setDocUrl] = useState(null)
  const [created_at, setCreatedAt] = useState(null)
  const [updated_at, setUpdatedAt] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`phone, first_name, last_name, country, city, doc_url, created_at, updated_at`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setPhone(data.phone)
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setCountry(data.country)
        setCity(data.city)
        setDocUrl(data.doc_url)
        setCreatedAt(data.created_at)
        setUpdatedAt(data.updated_at)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ phone, first_name, last_name, country, city, doc_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const avatarFile = doc_url
      const { data, error_e } = await supabase.storage
        .from('docs')
        .upload('public/doc1.png', avatarFile, {
          cacheControl: '3600',
          upsert: false
        })

      const updates = {
        id: user.id,
        phone,
        first_name,
        last_name,
        country,
        city,
        doc_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone || ''}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="first_name">First name</label>
        <input
          id="first_name"
          type="text"
          value={first_name || ''}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="first_name">Last name</label>
        <input
          id="last_name"
          type="text"
          value={last_name || ''}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country || ''}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city || ''}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="form-widget">
      {/* Add to the body */}
      <Avatar
        url={doc_url}
        size={150}
        onUpload={(url) => {
          setDocUrl(url)
          updateProfile({ phone, first_name, last_name, country, city, doc_url: url })
        }}
      />
      </div>


      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ phone, first_name, last_name, country, city, doc_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
