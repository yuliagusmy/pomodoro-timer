import { motion } from 'framer-motion'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.2rem;
  width: 100%;
`

const TimerDisplay = styled.div<{isBreak?: boolean}>`
  font-size: 3.2rem;
  font-family: 'Press Start 2P', cursive;
  color: #fffbe7;
  text-shadow: 4px 4px 0 #6b4f27, 8px 8px 0 #bfa16b;
  background: ${p => p.isBreak ? '#232946' : '#bfa16b'};
  padding: 1.5rem 2.5rem;
  border-radius: 18px;
  border: 6px solid #232946;
  min-width: 260px;
  text-align: center;
  margin-bottom: 0.5rem;
  transition: background 0.3s;
  @media (max-width: 600px) {
    font-size: 1.3rem;
    padding: 0.7rem 0.7rem;
    border-width: 3px;
    border-radius: 8px;
    min-width: 120px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 1.2rem;
  margin-bottom: 0.5rem;
  justify-content: center;
  width: 100%;
  @media (max-width: 600px) {
    gap: 0.5rem 0.5rem;
  }
`

const PixelButton = styled(motion.button)<{isBreak?: boolean}>`
  background: ${p => p.isBreak ? '#232946' : '#f7b267'};
  border: 4px solid #232946;
  border-radius: 12px;
  padding: 1.1rem 2.2rem;
  font-family: 'Press Start 2P', cursive;
  color: ${p => p.isBreak ? '#ffe066' : '#6b4f27'};
  cursor: pointer;
  text-transform: uppercase;
  font-size: 1.1rem;
  box-shadow: 0 4px 0 ${p => p.isBreak ? '#2a2d3a' : '#bfa16b'};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${p => p.isBreak ? '#ffe066' : '#f4845f'};
    color: ${p => p.isBreak ? '#232946' : '#ffe066'};
  }
  &:active {
    background: #232946;
    color: #ffe066;
  }
  &:disabled {
    background: #232946;
    color: #bfc9d1;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    font-size: 0.7rem;
    padding: 0.5rem 0.7rem;
    border-width: 2px;
    border-radius: 6px;
  }
`

const PixelProgress = styled.div`
  width: 100%;
  height: 28px;
  background: #232946;
  border: 4px solid #232946;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 0 #2a2d3a;
  .bar {
    height: 100%;
    transition: width 1s linear;
  }
  @media (max-width: 600px) {
    height: 16px;
    border-width: 2px;
    border-radius: 5px;
  }
`

const Label = styled.div<{isBreak?: boolean}>`
  font-family: 'Press Start 2P', cursive;
  font-size: 1.1rem;
  color: ${p => p.isBreak ? '#ffe066' : '#6b4f27'};
  text-shadow: 2px 2px 0 ${p => p.isBreak ? '#232946' : '#fffbe7'};
  margin-bottom: 0.2rem;
  transition: color 0.3s;
  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`

const soundUrl = 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b9b6b7.mp3';
const alarmUrl = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7b2.mp3';
const breakSongs = [
  'https://www.youtube.com/embed/aynkFJdXF_M?autoplay=1',
  'https://www.youtube.com/embed/gBm5CDF3pPc?autoplay=1',
  'https://www.youtube.com/embed/NQYR55EiKvs?autoplay=1',
  'https://www.youtube.com/embed/FsPwVOxp4y8?autoplay=1',
];
const longBreakSong = 'https://www.youtube.com/embed/sasjlpt7zWM?autoplay=1';

type PomodoroTimerProps = {
  onCountChange?: (pomodoro: number, breakCount: number) => void,
  onModeChange?: (isBreak: boolean) => void
}

const PomodoroTimer = forwardRef<{
  resetCount: () => void
}, PomodoroTimerProps>(({ onCountChange, onModeChange }, ref) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [breakCount, setBreakCount] = useState(0)
  const [progress, setProgress] = useState(100)
  const [showNotif, setShowNotif] = useState(false)
  const [ytSrc, setYtSrc] = useState<string | null>(null)
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null)

  useImperativeHandle(ref, () => ({
    resetCount: () => {
      setPomodoroCount(0)
      setBreakCount(0)
      if (onCountChange) onCountChange(0, 0)
    }
  }))

  useEffect(() => {
    if (onCountChange) onCountChange(pomodoroCount, breakCount)
  }, [pomodoroCount, breakCount, onCountChange])

  useEffect(() => {
    if (onModeChange) onModeChange(isBreak)
  }, [isBreak, onModeChange])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const playSound = () => {
    const audio = new Audio(soundUrl)
    audio.play()
  }

  const playAlarm = () => {
    const audio = new Audio(alarmUrl)
    audio.play()
  }

  const startTimer = useCallback(() => {
    setIsRunning(true)
    playSound()
  }, [])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
    playSound()
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(25 * 60)
    setProgress(100)
    setIsBreak(false)
    playSound()
  }, [])

  const skipBreak = useCallback(() => {
    setBreakCount(prev => {
      const newVal = prev + 1
      if (onCountChange) onCountChange(pomodoroCount, newVal)
      return newVal
    })
    setIsBreak(false)
    setTimeLeft(25 * 60)
    setProgress(100)
    setIsRunning(false)
    playSound()
  }, [onCountChange, pomodoroCount])

  useEffect(() => {
    let interval: number
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1
          setProgress((newTime / (isBreak ? (pomodoroCount % 4 === 0 && pomodoroCount !== 0 ? 15*60 : 5*60) : 25*60)) * 100)
          return newTime
        })
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      playSound()
      setShowNotif(true)
      setTimeout(() => setShowNotif(false), 2500)
      if (!isBreak) {
        setPomodoroCount(prev => prev + 1)
        setIsBreak(true)
        setTimeLeft((pomodoroCount + 1) % 4 === 0 ? 15 * 60 : 5 * 60)
        setProgress(100)
      } else {
        setBreakCount(prev => prev + 1)
        setIsBreak(false)
        setTimeLeft(25 * 60)
        setProgress(100)
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, pomodoroCount])

  useEffect(() => {
    if (isBreak) {
      if (pomodoroCount % 4 === 0 && pomodoroCount !== 0) {
        setYtSrc(longBreakSong)
      } else {
        const idx = Math.floor(Math.random() * breakSongs.length)
        setYtSrc(breakSongs[idx])
      }
    } else {
      setYtSrc(null)
    }
  }, [isBreak, pomodoroCount])

  useEffect(() => {
    if (showNotif && isBreak) {
      playAlarm()
    }
  }, [showNotif, isBreak])

  useEffect(() => {
    // update stats in parent
    const pom = document.getElementById('stat-pomodoro')
    const brk = document.getElementById('stat-break')
    if (pom) pom.innerHTML = `🍅 Pomodoro: ${pomodoroCount}`
    if (brk) brk.innerHTML = `☁️ Break: ${breakCount}`
  }, [pomodoroCount, breakCount])

  // Control YouTube play/pause
  const controlYouTube = (action: 'play' | 'pause') => {
    if (ytIframeRef.current) {
      ytIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: action === 'play' ? 'playVideo' : 'pauseVideo', args: [] }),
        '*'
      )
    }
  }

  // Otomatis start timer saat masuk break
  useEffect(() => {
    if (isBreak) {
      setIsRunning(true)
    }
  }, [isBreak])

  // Pause/play lagu YouTube saat timer di-pause/start
  useEffect(() => {
    if (isBreak && ytSrc) {
      if (isRunning) controlYouTube('play')
      else controlYouTube('pause')
    }
  }, [isRunning, isBreak, ytSrc])

  return (
    <TimerContainer>
      <Label isBreak={isBreak}>{isBreak ? (pomodoroCount % 4 === 0 && pomodoroCount !== 0 ? 'Long Break!' : 'Break!') : 'Focus!'}</Label>
      <TimerDisplay isBreak={isBreak}>{formatTime(timeLeft)}</TimerDisplay>
      <PixelProgress>
        <div className="bar" style={{ width: `${progress}%`, background: isBreak ? '#ffe066' : 'repeating-linear-gradient(135deg, #f4845f 0px, #f4845f 12px, #f7b267 12px, #f7b267 24px)' }} />
      </PixelProgress>
      {isBreak && ytSrc && (
        <div style={{ width: '100%', margin: '0.5rem 0', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <iframe
            ref={ytIframeRef}
            width="1"
            height="1"
            src={ytSrc + '&enablejsapi=1'}
            title="Break Song"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ opacity: 0, position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
          />
        </div>
      )}
      <ButtonContainer>
        {!isRunning ? (
          <PixelButton isBreak={isBreak}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={startTimer}
          >
            Start
          </PixelButton>
        ) : (
          <PixelButton isBreak={isBreak}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={pauseTimer}
          >
            Pause
          </PixelButton>
        )}
        <PixelButton isBreak={isBreak}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={resetTimer}
        >
          Reset
        </PixelButton>
        <PixelButton isBreak={isBreak}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={isBreak ? skipBreak : () => {
            setPomodoroCount(prev => {
              const newVal = prev + 1
              if (onCountChange) onCountChange(newVal, breakCount)
              return newVal
            })
            setIsBreak(true)
            setTimeLeft((pomodoroCount + 1) % 4 === 0 ? 15 * 60 : 5 * 60)
            setProgress(100)
            setIsRunning(false)
            playSound()
          }}
        >
          Skip
        </PixelButton>
      </ButtonContainer>
      {showNotif && (
        <div style={{
          background: '#fffbe7',
          color: '#6b4f27',
          border: '4px solid #bfa16b',
          borderRadius: 12,
          fontFamily: 'Press Start 2P',
          fontSize: '1rem',
          padding: '1rem 2rem',
          marginTop: 10,
          boxShadow: '0 4px 0 #bfa16b',
        zIndex: 10
        }}>
          {isBreak ? 'Break selesai! Saatnya fokus!' : 'Sesi fokus selesai! Saatnya break!'}
        </div>
      )}
    </TimerContainer>
  )
})

export default PomodoroTimer