'use client'

import { useState } from 'react'
import { Button, toast, useFormFields, useField } from '@payloadcms/ui'

export function GeocodeButton() {
  const [loading, setLoading] = useState(false)

  const street = useFormFields(([fields]) => fields['address.street']?.value as string | undefined)
  const city = useFormFields(([fields]) => fields['address.city']?.value as string | undefined)
  const state = useFormFields(([fields]) => fields['address.state']?.value as string | undefined)
  const zipCode = useFormFields(([fields]) => fields['address.zipCode']?.value as string | undefined)
  const country = useFormFields(([fields]) => fields['address.country']?.value as string | undefined)

  const { setValue: setLatitude } = useField<number>({ path: 'coordinates.latitude' })
  const { setValue: setLongitude } = useField<number>({ path: 'coordinates.longitude' })

  const hasMinimalAddress = Boolean(state)

  const handleGeocode = async () => {
    if (!hasMinimalAddress) {
      toast.error('Fill in at least a state before geocoding.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ street, city, state, zipCode, country }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'No results found for this address.')
        return
      }

      setLatitude(data.latitude)
      setLongitude(data.longitude)
      toast.success(`Geocoded: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`)
    } catch {
      toast.error('Geocoding request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 'calc(var(--base) * 0.5)', paddingBottom: 'calc(var(--base) * 0.5)' }}>
      <Button
        onClick={handleGeocode}
        disabled={loading || !hasMinimalAddress}
        buttonStyle="secondary"
        size="small"
        type="button"
      >
        {loading ? 'Geocoding…' : '📍 Geocode Address'}
      </Button>
      {!hasMinimalAddress && (
        <p style={{ marginTop: 4, fontSize: 11, color: 'var(--theme-text-subtle)' }}>
          Requires at least a state.
        </p>
      )}
    </div>
  )
}
