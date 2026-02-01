
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginUser } from "../features/authSlice"
const Login = () => {
    const dispatch = useDispatch()
    const {loading,error}=useSelector(state=>state.auth)
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
  const handleSubmit = (e) => {
      e.preventDefault()
      dispatch(loginUser({email,password}))
  }

    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? "Logging in ..." : "Login"}</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    );
}

export default Login