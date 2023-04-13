import express, { Request, Response } from 'express'
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const app = express()

const port = process.env.PORT || 3001

app.use(express.json())

app.get('/customers', async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customers.findMany({
      include: {
        orders: {
          select: {
            orderNumber: true,
            orderDate: true,
            requiredDate: true,
            shippedDate: true,
            status: true,
            comments: true
          }
        }
      }
    })
    //console.log(customers)
    res.json(customers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    await prisma.$disconnect()
    process.exit(1)
  }
})

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}/customers
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)