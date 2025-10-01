"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useFarms() {
  const { data, error, mutate } = useSWR("/api/farms", fetcher)

  const createFarm = async (farmData: any) => {
    const response = await fetch("/api/farms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(farmData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la création")
    }

    const newFarm = await response.json()
    mutate()
    return newFarm
  }

  const updateFarm = async (id: string, farmData: any) => {
    const response = await fetch(`/api/farms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(farmData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la mise à jour")
    }

    const updatedFarm = await response.json()
    mutate()
    return updatedFarm
  }

  const deleteFarm = async (id: string) => {
    const response = await fetch(`/api/farms/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la suppression")
    }

    mutate()
  }

  return {
    farms: data || [],
    loading: !error && !data,
    error,
    createFarm,
    updateFarm,
    deleteFarm,
    mutate,
  }
}
