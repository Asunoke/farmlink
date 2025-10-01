"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useExpenses(farmId?: string, category?: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (farmId) params.append("farmId", farmId)
  if (category) params.append("category", category)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)

  const { data, error, mutate } = useSWR(`/api/expenses?${params.toString()}`, fetcher)

  const createExpense = async (expenseData: any) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la création")
    }

    const newExpense = await response.json()
    mutate()
    return newExpense
  }

  const updateExpense = async (id: string, expenseData: any) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la mise à jour")
    }

    const updatedExpense = await response.json()
    mutate()
    return updatedExpense
  }

  const deleteExpense = async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la suppression")
    }

    mutate()
  }

  return {
    expenses: data || [],
    loading: !error && !data,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    mutate,
  }
}
