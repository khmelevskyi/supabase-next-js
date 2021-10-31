import { Auth, Typography, Button, Modal } from '@supabase/ui'
import { supabase } from '../utils/supabaseClient'
import { useState } from "react";

const Container = (props) => {
  const { user } = Auth.useUser()
  if (user) {
    if (user.created_at == null) {
      user.created_at = new Date()
    }
  }
  if (user)
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    )
  return props.children
}

export default function AuthBasic() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Auth supabaseClient={supabase} magicLink={true} providers={['google']}/>
      </Container>
    </Auth.UserContextProvider>
  )
}











// import { useState } from 'react'
// import { supabase } from '../utils/supabaseClient'

// export default function Auth() {
//   const [loading, setLoading] = useState(false)
//   const [email, setEmail] = useState('')

//   const handleLogin = async (email) => {
//     try {
//       setLoading(true)
//       const { error } = await supabase.auth.signIn({ email })
//       if (error) throw error
//       alert('Check your email for the login link!')
//     } catch (error) {
//       alert(error.error_description || error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="row flex flex-center">
//       <div className="col-6 form-widget">
//         <h1 className="header">Supabase + Next.js</h1>
//         <p className="description">Sign in via magic link with your email below</p>
//         <div>
//           <input
//             className="inputField"
//             type="email"
//             placeholder="Your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <button
//             onClick={(e) => {
//               e.preventDefault()
//               handleLogin(email)
//             }}
//             className="button block"
//             disabled={loading}
//           >
//             <span>{loading ? 'Loading' : 'Send magic link'}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }