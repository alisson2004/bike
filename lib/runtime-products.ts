'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { products as baseProducts, categories as baseCategories } from './data'
import type { Product } from './types'

type StoredRuntimeProductsV1 = {
  version: 1
  overrides: Product[]
  deletedIds: string[]
}

const STORAGE_KEY = 'vinxs_products_runtime_v1'

function safeParseJson(value: string | null): unknown {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function normalizeStoredProduct(p: Product): Product {
  // When saved to localStorage, Date objects become strings.
  const createdAt = p.createdAt ? new Date(p.createdAt) : new Date()
  const updatedAt = p.updatedAt ? new Date(p.updatedAt) : createdAt

  return {
    ...p,
    createdAt,
    updatedAt,
    specs: Array.isArray(p.specs) ? p.specs : [],
    images: Array.isArray(p.images) ? p.images : [],
  }
}

function loadStoredState(): StoredRuntimeProductsV1 {
  if (typeof window === 'undefined') {
    return { version: 1, overrides: [], deletedIds: [] }
  }

  const parsed = safeParseJson(window.localStorage.getItem(STORAGE_KEY))
  if (!parsed || typeof parsed !== 'object') {
    return { version: 1, overrides: [], deletedIds: [] }
  }

  const state = parsed as Partial<StoredRuntimeProductsV1>
  return {
    version: 1,
    overrides: Array.isArray(state.overrides) ? state.overrides.map(normalizeStoredProduct) : [],
    deletedIds: Array.isArray(state.deletedIds) ? state.deletedIds : [],
  }
}

function saveStoredState(state: StoredRuntimeProductsV1) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function mergeRuntimeProducts(overrides: Product[], deletedIds: string[]): Product[] {
  const deleted = new Set(deletedIds)
  const base = baseProducts.filter(p => !deleted.has(p.id))

  const overrideById = new Map<string, Product>(overrides.map(p => [p.id, normalizeStoredProduct(p)]))
  const baseWithoutOverrides = base.filter(p => !overrideById.has(p.id))
  return [...baseWithoutOverrides, ...Array.from(overrideById.values())]
}

export function useRuntimeProducts() {
  const [runtimeProducts, setRuntimeProducts] = useState<Product[]>(baseProducts)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const { overrides, deletedIds } = loadStoredState()
    setRuntimeProducts(mergeRuntimeProducts(overrides, deletedIds))
    setIsLoaded(true)
  }, [])

  const upsertRuntimeProduct = useCallback((product: Product) => {
    const state = loadStoredState()
    const nextOverrides = state.overrides.some(p => p.id === product.id)
      ? state.overrides.map(p => (p.id === product.id ? normalizeStoredProduct(product) : p))
      : [...state.overrides, normalizeStoredProduct(product)]

    const nextDeletedIds = state.deletedIds.filter(id => id !== product.id)
    const nextState: StoredRuntimeProductsV1 = { version: 1, overrides: nextOverrides, deletedIds: nextDeletedIds }
    saveStoredState(nextState)
    setRuntimeProducts(mergeRuntimeProducts(nextOverrides, nextDeletedIds))
  }, [])

  const deleteRuntimeProduct = useCallback((productId: string) => {
    const state = loadStoredState()
    const nextOverrides = state.overrides.filter(p => p.id !== productId)
    const nextDeletedIds = Array.from(new Set([...state.deletedIds, productId]))
    const nextState: StoredRuntimeProductsV1 = { version: 1, overrides: nextOverrides, deletedIds: nextDeletedIds }
    saveStoredState(nextState)
    setRuntimeProducts(mergeRuntimeProducts(nextOverrides, nextDeletedIds))
  }, [])

  const clearAllRuntimeProducts = useCallback(() => {
    const nextState: StoredRuntimeProductsV1 = { version: 1, overrides: [], deletedIds: [] }
    saveStoredState(nextState)
    setRuntimeProducts(baseProducts)
  }, [])

  const runtimeCategories = useMemo(() => baseCategories, [])

  return {
    products: runtimeProducts,
    categories: runtimeCategories,
    isLoaded,
    upsertRuntimeProduct,
    deleteRuntimeProduct,
    clearAllRuntimeProducts,
  }
}

