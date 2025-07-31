'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react' // Added useEffect
import { useRouter } from 'next/navigation'
import { toast } from '@/components/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { User } from './types'
import { userFormSchema } from '@/schemas/userSchema'

type UserFormValues = z.infer<typeof userFormSchema>

interface UserDialogProps {
  user?: User
  children: React.ReactNode
}

export function UserDialog({ user, children }: UserDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const currentUser = session?.user as User | undefined
  const isAdmin = currentUser?.role === 'admin'

  const defaultValues: Partial<UserFormValues> = {
    username: user?.username || '',
    email: user?.email || '',
    position: user?.position || '',
    isAdmin: user?.isAdmin || false,
    isVerified: user?.isVerified || false,
    role: user?.role || 'user'
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues
  })

  // Reset form when user changes
  useEffect(() => {
    if (open) {
      form.reset({
        username: user?.username || '',
        email: user?.email || '',
        position: user?.position || "",
        isAdmin: user?.isAdmin || false,
        isVerified: user?.isVerified || false,
        role: user?.role || 'user'
      })
    }
  }, [user, open, form])

  async function onSubmit(data: UserFormValues) {
    try {
      const url = user ? `/api/users/${user._id}` : '/api/users'
      const method = user ? 'PUT' : 'POST'

      const payload = isAdmin ? data : { ...data, role: user?.role || 'user' }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save user')
      }

      toast({
        title: 'Success',
        description: user ? 'User updated successfully' : 'User created successfully',
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(`ERROR : ${error}`)
      toast({
        title: 'Error',
        description: 'Failed to save user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} key={user?._id || 'create'}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              disabled={!isAdmin}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              disabled={!isAdmin}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              disabled={!isAdmin}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="i.e. Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isAdmin && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isAdmin}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="admin-toggle"
                        disabled={!isAdmin}
                      />
                    </FormControl>
                    <Label htmlFor="admin-toggle">Admin</Label>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="verified-toggle"
                      />
                    </FormControl>
                    <Label htmlFor="verified-toggle">Verified</Label>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}