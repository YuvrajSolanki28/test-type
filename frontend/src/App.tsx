import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/Signup'
import { TypingTest } from './components/TypingTest'
import { MultiplayerRace } from './components/MultiplayerRace'
import { History } from './pages/History'
import { Leaderboard } from './pages/Leaderboard'
import { Settings } from './pages/Settings'
import { Profile } from './pages/Profile'
import { Achievements } from './pages/Achievements'
import { Friends } from './pages/Friends'
import { Lesson } from './components/Lesson'
import { Lessons } from './pages/Lessons'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test" element={<TypingTest />} />
          <Route path="/race" element={<MultiplayerRace />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/history" element={<History />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lesson/:id" element={<Lesson />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
