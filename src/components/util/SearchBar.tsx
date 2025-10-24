'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, X } from 'lucide-react'

interface CampgroundResult {
  id: number
  slug: string
  title: string
  location: string
  price: number | null
}

interface SearchBarProps {
  onResultClick?: () => void
}

export function SearchBar({ onResultClick }: SearchBarProps = {}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CampgroundResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)

      // Clear existing debounce timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Set new debounce timeout
      debounceRef.current = setTimeout(() => {
        performSearch(value)
      }, 300) // 300ms debounce
    },
    [performSearch]
  )

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
    // Clear any pending debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }

  const handleResultClick = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    onResultClick?.()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full mx-auto xl:max-w-2xl 2xl:max-w-3xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-2 lg:p-3">
          <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-slate-400 ml-2 lg:ml-3 mr-2 lg:mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Where do you want to camp?"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setIsOpen(true)}
            className="flex-1 outline-none text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-400 text-sm lg:text-base min-w-0 w-full py-2 lg:py-1 bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 transition flex-shrink-0"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          )}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold px-4 sm:px-6 lg:px-8 py-2 lg:py-3 rounded-2xl cursor-pointer transition-colors flex-shrink-0 whitespace-nowrap ml-2"
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </span>
          </button>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-80 sm:max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-3 sm:p-4 text-center text-sm text-gray-500 dark:text-slate-400">
              Searching...
            </div>
          )}

          {!isLoading && results.length === 0 && query.trim() && (
            <div className="p-3 sm:p-4 text-center text-sm text-gray-500 dark:text-slate-400">
              No campgrounds found
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/campgrounds/${result.slug}`}
                    onClick={handleResultClick}
                    className="block px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <div className="font-medium text-gray-900 dark:text-slate-100 text-sm sm:text-base">
                      {result.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {result.location}
                      {result.price && ` • $${result.price}/night`}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
