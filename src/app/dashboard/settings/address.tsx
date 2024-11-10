'use client'

import { Input } from '@/components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { getCountries } from '@/data'
import { useState } from 'react'
import Image from 'next/image'
export function Address() {
  const countries = getCountries()
  const [country, setCountry] = useState(countries[1])

  return (
    <div className="grid grid-cols-2 gap-6">
      <Input
        aria-label="Street Address"
        name="address"
        placeholder="Street Address"
        defaultValue="Reforma 222"
        className="col-span-2"
      />
      <Input aria-label="City" name="city" placeholder="City" defaultValue="Ciudad de Mexico" className="col-span-2" />
      <Listbox aria-label="Region" name="region" placeholder="Region" defaultValue="Ciudad de Mexico">
        {country.regions.map((region) => (
          <ListboxOption key={region} value={region}>
            <ListboxLabel>{region}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
      <Input aria-label="Postal code" name="postal_code" placeholder="Postal Code" defaultValue="05600" />
      <Listbox
        aria-label="Country"
        name="country"
        placeholder="Country"
        by="code"
        value={country}
        onChange={(country) => setCountry(country)}
        className="col-span-2"
      >
        {countries.map((country) => (
          <ListboxOption key={country.code} value={country}>
            <Image className="w-5 sm:w-4" src={country.flagUrl} alt="" width={20} height={20} />
            <ListboxLabel>{country.name}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </div>
  )
}