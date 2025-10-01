"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Crown, ShoppingCart } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function UserNav() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "PREMIUM":
        return "bg-yellow-500 text-yellow-50"
      case "BASIC":
        return "bg-blue-500 text-blue-50"
      default:
        return "bg-gray-500 text-gray-50"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback>{getInitials(session.user.name || "U")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              {session.user.role === "ADMIN" && <Crown className="h-4 w-4 text-yellow-500" />}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            <Badge className={`w-fit text-xs ${getSubscriptionColor(session.user.subscription)}`}>
              {session.user.subscription}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/marketplace">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Marché Agricole</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          {session.user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Crown className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut({ callbackUrl: "/" })
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
