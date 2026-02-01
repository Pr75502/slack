import { signUpUser } from "../features/authSlice"
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
const SignUp = () => {

    const dispatch=useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const {loading,error}=useSelector(state=>state.auth)

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(signUpUser({email,password}))
    }
    return (
      <div>
        <h2>SignUp</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>setEmail( e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
                <button type="submit" disabled={loading}>{loading ? "creating..." :"create Account"}</button>
                
                {error && <p>{error}</p>}
        </form>
      </div>
    );
}

export default SignUp