// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import toast from 'react-hot-toast'
// import { api } from '@/src/lib/api'
// import { Card } from '@/src/components/ui/Card'
// import { Input } from '@/src/components/ui/Input'
// import { Button } from '@/src/components/ui/Button'

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [sent, setSent] = useState(false)

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()

//     if (!email.trim()) {
//       toast.error('Informe seu e-mail.')
//       return
//     }

//     setLoading(true)
//     try {
//       await api.post('/api/auth/forgot-password', { email })
//       setSent(true)
//     } catch {
//       // Mesmo em caso de erro mostramos sucesso por segurança
//       setSent(true)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">✂️ Noblecut</h1>
//           <p className="text-zinc-500 dark:text-zinc-400 mt-2">Recuperação de senha</p>
//         </div>

//         <Card>
//           {sent ? (
//             <div className="text-center flex flex-col gap-4">
//               <div className="text-4xl">📧</div>
//               <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
//                 Verifique seu e-mail
//               </h2>
//               <p className="text-sm text-zinc-500 dark:text-zinc-400">
//                 Se o e-mail <strong className="text-zinc-700 dark:text-zinc-300">{email}</strong> estiver
//                 cadastrado, você receberá um link para redefinir sua senha. Verifique também a caixa de spam.
//               </p>
//               <Link href="/login">
//                 <Button variant="secondary" className="w-full">Voltar ao login</Button>
//               </Link>
//             </div>
//           ) : (
//             <>
//               <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
//                 Informe seu e-mail e enviaremos um link para redefinir sua senha.
//               </p>
//               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                 <Input
//                   label="E-mail"
//                   type="email"
//                   placeholder="seu@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <Button type="submit" loading={loading} className="w-full">
//                   Enviar link de recuperação
//                 </Button>
//               </form>

//               <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
//                 Lembrou a senha?{' '}
//                 <Link href="/login" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline">
//                   Voltar ao login
//                 </Link>
//               </p>
//             </>
//           )}
//         </Card>
//       </div>
//     </div>
//   )
// }