import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string
    JWT_SECRET : string
  }
}>()

app.use("/*",cors())
app.route("/api/v1/user", userRouter)
app.route("api/v1/blog", blogRouter)



app.post('/api/v1/user/signup',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  try{
    const user = await prisma.user.create({
      data: {
        email : body.email,
        password : body.password
      }
    })

    if(!user){
      c.status(403)
      return c.text("Incorrect Credentials")
    }
    const token = await sign({id : user.id}, c.env.JWT_SECRET)
    return c.json({
      jwt : token
    })
  }catch(e){
    c.status(411)
    return c.text("Invalid")
  }
})

app.post('/api/v1/user/signin',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  const user = await prisma.user.findUnique({
    where : {
      email : body.email,
      password: body.password
    }
  })

  if(!user){
    c.status(403)
    return c.json({
      error : "User not found"
    })
  }

  const jwt = await sign({ id : user.id}, c.env.JWT_SECRET)
  return c.json({ jwt })
})



export default app
