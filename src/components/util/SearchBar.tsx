'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

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
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      )
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

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Campgrounds..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 transition"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              Searching...
            </div>
          )}

          {!isLoading && results.length === 0 && query.trim() && (
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              No campgrounds found
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/campgrounds/${result.slug}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {result.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
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