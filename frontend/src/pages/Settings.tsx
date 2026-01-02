import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Volume2, VolumeX, Keyboard, Eye, RotateCcw, Target } from 'lucide-react'
import { clearAllData } from '../utils/statsManager'
import { getSettings, updateSetting, resetSettings, type SettingsConfig } from '../utils/settingsManager'
import { Loading } from '../components/Loading'
import { soundManager } from '../utils/soundManager'

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-500' : 'bg-white/20'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
  </button>
)

export function Settings() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading] = useState(false)
  const [settings, setSettings] = useState<SettingsConfig>(getSettings())

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled)
  }, [settings.soundEnabled])

  const handleSettingChange = <K extends keyof SettingsConfig>(key: K, value: SettingsConfig[K]) => {
    updateSetting(key, value)
    setSettings(prev => ({ ...prev, [key]: value }))

    if (key === 'soundEnabled') {
      soundManager.setEnabled(value as boolean)
    }
  }

  const handleClearData = () => {
    if (showConfirm) {
      clearAllData()
      window.location.reload()
    } else {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 3000)
    }
  }

  if (loading) return <Loading variant='fullscreen' />

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-white/60 mb-12">Customize your typing experience</p>
        </motion.div>

        {/* Typing Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Keyboard className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">Typing</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <div>
                  <div className="font-medium">Sound Effects</div>
                  <div className="text-sm text-white/60">Enable typing sound effects</div>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.soundEnabled}
                onChange={() => {
                  const newValue = !settings.soundEnabled
                  handleSettingChange('soundEnabled', newValue)
                  if (newValue) {
                    soundManager.keyPress()
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5" />
                <div>
                  <div className="font-medium">Show Live WPM</div>
                  <div className="text-sm text-white/60">Display WPM while typing</div>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.showWPM}
                onChange={() => handleSettingChange('showWPM', !settings.showWPM)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5" />
                <div>
                  <div className="font-medium">Highlight Errors</div>
                  <div className="text-sm text-white/60">Highlight typing mistakes</div>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.highlightErrors}
                onChange={() => handleSettingChange('highlightErrors', !settings.highlightErrors)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Keyboard className="w-5 h-5" />
                <div>
                  <div className="font-medium">Keyboard Layout</div>
                  <div className="text-sm text-white/60">Select your keyboard layout</div>
                </div>
              </div>
              <select
                value={settings.keyboardLayout}
                onChange={(e) => handleSettingChange('keyboardLayout', e.target.value as SettingsConfig['keyboardLayout'])}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              >
                <option value="qwerty" className="bg-gray-800 text-white">QWERTY</option>
                <option value="dvorak" className="bg-gray-800 text-white">Dvorak</option>
                <option value="colemak" className="bg-gray-800 text-white">Colemak</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Data Management</h2>

          <div className="space-y-4">
            <button
              onClick={() => {
                resetSettings()
                setSettings(getSettings())
              }}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-orange-400" />
              <span>Reset to Defaults</span>
            </button>

            <button
              onClick={handleClearData}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${showConfirm
                ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <div className="font-medium">
                    {showConfirm ? 'Click again to confirm' : 'Clear All Data'}
                  </div>
                  <div className="text-sm text-white/60">
                    Delete all test history and stats
                  </div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
