import { TOURS } from './mockData'

/**
 * Intelligent helper to find if a destination/hotspot has an available pre-packaged tour
 * in the system. If available, returns the matching tour object; otherwise returns null.
 */
export const findMatchingTour = (location, toursList = TOURS) => {
  if (!location) return null

  const name = (location.name || '').toLowerCase().trim()
  const cleanName = (location.name ? location.name.split(',')[0] : '').toLowerCase().trim()
  const city = (location.city || '').toLowerCase().trim()
  const country = (location.country || '').toLowerCase().trim()
  const slug = (location.slug || location.id || '').toLowerCase().trim()

  const list = Array.isArray(toursList) && toursList.length > 0 ? toursList : TOURS

  return (
    list.find((t) => {
      const tDest = (t.destination || '').toLowerCase().trim()
      const tDestSlug = (t.destinationSlug || '').toLowerCase().trim()
      const tSlug = (t.slug || t.id || '').toLowerCase().trim()
      const tTitle = (t.title || '').toLowerCase().trim()
      const tCountry = (t.country || '').toLowerCase().trim()

      // Exact match on destination name or slug
      if (cleanName && (tDest === cleanName || tDestSlug === cleanName)) return true
      if (slug && (tDestSlug === slug || tSlug === slug)) return true

      // Inclusions
      if (cleanName && (tDest.includes(cleanName) || cleanName.includes(tDest))) return true
      if (cleanName && tTitle.includes(cleanName)) return true
      if (city && (tDest.includes(city) || city.includes(tDest) || tTitle.includes(city))) return true

      // Special destination aliases and regional mappings:
      // Taj Mahal & Agra
      if ((name.includes('taj mahal') || name.includes('agra')) && (tDest.includes('agra') || tTitle.includes('taj') || tDestSlug.includes('agra'))) return true
      // Rajasthan cities: Udaipur, Jaipur, Jaisalmer, Jodhpur, Ranthambore
      if ((name.includes('udaipur') || name.includes('jaipur') || name.includes('jaisalmer') || name.includes('jodhpur') || name.includes('rajasthan')) && (tDest.includes('rajasthan') || tTitle.includes('rajasthan'))) return true
      // Kerala: Alleppey, Munnar, Kochi, Kumarakom, Backwaters
      if ((name.includes('kerala') || name.includes('alleppey') || name.includes('munnar') || name.includes('backwater')) && (tDest.includes('kerala') || tTitle.includes('kerala'))) return true
      // Himachal: Manali, Shimla, Rohtang, Spiti, Dharamshala, Solang
      if ((name.includes('himachal') || name.includes('manali') || name.includes('spiti') || name.includes('rohtang')) && (tDest.includes('himachal') || tTitle.includes('himachal'))) return true
      // Goa: North Goa, South Goa, Panaji, Calangute
      if (name.includes('goa') && (tDest.includes('goa') || tTitle.includes('goa'))) return true
      // Kashmir: Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake
      if ((name.includes('kashmir') || name.includes('srinagar') || name.includes('gulmarg') || name.includes('pahalgam')) && (tDest.includes('kashmir') || tTitle.includes('kashmir'))) return true
      // Ladakh: Leh, Pangong, Nubra, Khardung La
      if ((name.includes('ladakh') || name.includes('leh') || name.includes('pangong') || name.includes('nubra')) && (tDest.includes('ladakh') || tTitle.includes('ladakh'))) return true
      // Varanasi: Kashi, Ghats, Ganga
      if ((name.includes('varanasi') || name.includes('banaras') || name.includes('kashi')) && (tDest.includes('varanasi') || tTitle.includes('varanasi'))) return true
      // Andaman: Port Blair, Havelock, Neil Island
      if ((name.includes('andaman') || name.includes('havelock') || name.includes('radhanagar')) && (tDest.includes('andaman') || tTitle.includes('andaman'))) return true
      // Rishikesh / Haridwar
      if ((name.includes('rishikesh') || name.includes('haridwar')) && (tDest.includes('rishikesh') || tTitle.includes('rishikesh'))) return true
      // Meghalaya: Cherrapunji, Shillong, Dawki
      if ((name.includes('meghalaya') || name.includes('cherrapunji') || name.includes('shillong') || name.includes('dawki')) && (tDest.includes('meghalaya') || tTitle.includes('meghalaya'))) return true
      // Coorg / Hampi / Ranthambore / Sikkim
      if (name.includes('coorg') && (tDest.includes('coorg') || tTitle.includes('coorg'))) return true
      if (name.includes('hampi') && (tDest.includes('hampi') || tTitle.includes('hampi'))) return true
      if (name.includes('ranthambore') && (tDest.includes('ranthambore') || tTitle.includes('ranthambore'))) return true
      if (name.includes('sikkim') && (tDest.includes('sikkim') || tTitle.includes('sikkim'))) return true

      // Global Cities
      if (name.includes('paris') && (tDest.includes('paris') || tTitle.includes('paris'))) return true
      if (name.includes('switzerland') || name.includes('zurich') || name.includes('zermatt') || name.includes('matterhorn') || name.includes('lucerne') || name.includes('interlaken')) {
        if (tDest.includes('switzerland') || tTitle.includes('swiss')) return true
      }
      if (name.includes('dubai') && (tDest.includes('dubai') || tTitle.includes('dubai'))) return true
      if (name.includes('maldives') && (tDest.includes('maldives') || tTitle.includes('maldives'))) return true
      if (name.includes('bali') && (tDest.includes('bali') || tTitle.includes('bali'))) return true
      if (name.includes('tokyo') && (tDest.includes('tokyo') || tTitle.includes('tokyo'))) return true
      if (name.includes('kyoto') && (tDest.includes('kyoto') || tTitle.includes('kyoto') || tDest.includes('tokyo'))) return true
      if (name.includes('santorini') || name.includes('oia') || name.includes('fira')) {
        if (tDest.includes('santorini') || tTitle.includes('santorini')) return true
      }
      if (name.includes('amalfi') || name.includes('positano') || name.includes('capri') || name.includes('ravello')) {
        if (tDest.includes('amalfi') || tTitle.includes('amalfi')) return true
      }
      if (name.includes('iceland') || name.includes('reykjavik')) {
        if (tDest.includes('iceland') || tTitle.includes('iceland')) return true
      }
      if (name.includes('rome') || name.includes('vatican') || name.includes('colosseum')) {
        if (tDest.includes('rome') || tTitle.includes('rome')) return true
      }
      if (name.includes('london') && (tDest.includes('london') || tTitle.includes('london'))) return true
      if (name.includes('new york') || name.includes('manhattan')) {
        if (tDest.includes('new york') || tTitle.includes('new york')) return true
      }
      if (name.includes('egypt') || name.includes('cairo') || name.includes('pyramid') || name.includes('giza') || name.includes('luxor')) {
        if (tDest.includes('egypt') || tTitle.includes('egypt')) return true
      }
      if (name.includes('thailand') || name.includes('bangkok') || name.includes('phuket') || name.includes('krabi') || name.includes('phi phi')) {
        if (tDest.includes('thailand') || tTitle.includes('thailand')) return true
      }
      if (name.includes('singapore') || name.includes('sentosa') || name.includes('marina bay')) {
        if (tDest.includes('singapore') || tTitle.includes('singapore')) return true
      }
      if (name.includes('delhi') && (tDest.includes('agra') || tTitle.includes('taj') || tTitle.includes('delhi'))) return true
      if (name.includes('mumbai') && (tDest.includes('goa') || tTitle.includes('mumbai') || tTitle.includes('goa'))) return true

      return false
    }) || null
  )
}
