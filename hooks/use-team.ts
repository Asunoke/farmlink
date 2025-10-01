"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTeam() {
  const { data, error, mutate } = useSWR("/api/team", fetcher)

  const createTeamMember = async (memberData: any) => {
    const response = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la création")
    }

    const newMember = await response.json()
    mutate()
    return newMember
  }

  const updateTeamMember = async (id: string, memberData: any) => {
    const response = await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la mise à jour")
    }

    const updatedMember = await response.json()
    mutate()
    return updatedMember
  }

  const deleteTeamMember = async (id: string) => {
    const response = await fetch(`/api/team/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la suppression")
    }

    mutate()
  }

  return {
    teamMembers: data || [],
    loading: !error && !data,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    mutate,
  }
}
