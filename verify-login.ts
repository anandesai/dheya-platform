import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'superadmin@dheya.com'
    const password = 'SuperSecretPassword123!'

    console.log(`Verifying credentials for ${email}...`)

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        console.error('User not found!')
        return
    }

    console.log('User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        hashedPassword: user.hashedPassword
    })

    if (!user.hashedPassword) {
        console.error('User has no password hash!')
        return
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword)
    console.log(`Password valid: ${isValid}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
