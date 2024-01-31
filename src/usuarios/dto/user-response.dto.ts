export class UserResponseDto {
  id: number
  nombre: string
  apellidos: string
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  roles: string[]
}
