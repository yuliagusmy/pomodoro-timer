import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PomodoroTimer from './components/PomodoroTimer'

const Bg = styled.div<{$isBreak?: boolean}>`
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({$isBreak}) => $isBreak
    ? 'linear-gradient(to top, #181c2f 70%, #232946 100%)'
    : 'linear-gradient(to top, #aee2f7 70%, #f7e6c4 100%)'};
  position: relative;
  z-index: 0;
  left: 0;
  top: 0;
  overflow: hidden;
`

const Cloud = styled.div<{$top: string, $left: string, $scale?: number, $isBreak?: boolean}>`
  position: absolute;
  top: ${p => p.$top};
  left: ${p => p.$left};
  transform: scale(${p => p.$scale || 1});
  width: 120px;
  height: 60px;
  background: ${({$isBreak}) => $isBreak ? '#232946' : '#fff'};
  border-radius: 60px 60px 40px 40px;
  box-shadow: 40px 10px 0 0 ${({$isBreak}) => $isBreak ? '#232946' : '#fff'}, 80px 20px 0 0 ${({$isBreak}) => $isBreak ? '#232946' : '#fff'}, 20px 30px 0 0 ${({$isBreak}) => $isBreak ? '#232946' : '#fff'};
  opacity: ${({$isBreak}) => $isBreak ? 0.3 : 0.8};
  @media (max-width: 600px) {
    width: 70px;
    height: 35px;
    border-radius: 35px 35px 20px 20px;
  }
`

const CloudAnimated = styled(Cloud)<{$x: number}>`
  left: ${p => p.$left};
  transform: translateX(${p => p.$x}px) scale(${p => p.$scale || 1});
  transition: none;
`

const GameFrame = styled.div<{$isBreak?: boolean}>`
  background: ${({$isBreak}) => $isBreak ? '#181c2f' : '#f7e6c4'};
  border: 8px solid ${({$isBreak}) => $isBreak ? '#232946' : '#6b4f27'};
  border-radius: 24px;
  box-shadow: 0 8px 0 ${({$isBreak}) => $isBreak ? '#2a2d3a' : '#bfa16b'}, 0 0 0 12px ${({$isBreak}) => $isBreak ? '#232946' : '#6b4f27'};
  max-width: 480px;
  width: 100%;
  padding: 3.5rem 1.5rem 2rem 1.5rem;
  padding-top: 3.5rem;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  transition: background 0.3s, border 0.3s, box-shadow 0.3s;
  @media (max-width: 600px) {
    max-width: 300px;
    padding: 0.7rem 0.1rem 0.7rem 0.1rem;
    padding-top: 1.2rem;
    border-width: 3px;
    border-radius: 10px;
    box-shadow: 0 2px 0 ${({$isBreak}) => $isBreak ? '#2a2d3a' : '#bfa16b'}, 0 0 0 3px ${({$isBreak}) => $isBreak ? '#232946' : '#6b4f27'};
    gap: 0.7rem;
  }
`

const Title = styled.h1<{$isBreak?: boolean}>`
  font-family: 'Press Start 2P', cursive;
  font-size: 3.2rem;
  font-weight: bold;
  color: ${({$isBreak}) => $isBreak ? '#ffe066' : '#fffbe7'};
  text-shadow: 3px 3px 0 ${({$isBreak}) => $isBreak ? '#232946' : '#6b4f27'}, 5px 5px 0 ${({$isBreak}) => $isBreak ? '#2a2d3a' : '#bfa16b'};
  letter-spacing: 1px;
  margin-bottom: 1rem;
  margin-top: 0.7rem;
  text-align: center;
  line-height: 1.1;
  transition: text-shadow 0.3s, color 0.3s;
  @media (max-width: 600px) {
    font-size: 2.0rem;
    margin-bottom: 0.3rem;
    margin-top: 2.2rem;
  }
`

const StatsBar = styled.div<{$isBreak?: boolean}>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.9rem;
  color: ${({$isBreak}) => $isBreak ? '#ffe066' : '#6b4f27'};
  text-shadow: 2px 2px 0 ${({$isBreak}) => $isBreak ? '#232946' : '#fffbe7'};
  transition: color 0.3s, text-shadow 0.3s;
  @media (max-width: 600px) {
    font-size: 0.6rem;
    margin-bottom: 0.5rem;
    gap: 0.6rem;
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const ResetMini = styled.button`
  background: #fffbe7;
  border: 2px solid #bfa16b;
  border-radius: 6px;
  color: #6b4f27;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  margin-left: 0.5rem;
  padding: 0.1rem 0.7rem;
  cursor: pointer;
  box-shadow: 0 2px 0 #bfa16b;
  transition: background 0.2s;
  &:hover {
    background: #f7b267;
  }
`

const ResetMiniAbsolute = styled(ResetMini)`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  @media (max-width: 600px) {
    left: 6px;
  }
`

const TutorialMini = styled(ResetMini)`
  position: absolute;
  top: 16px;
  right: 25px;
  z-index: 2;
  padding: 0.1rem 0.6rem;
  font-size: 0.8rem;
  @media (max-width: 600px) {
    right: 22px;
    font-size: 0.7rem;
    padding: 0.1rem 0.5rem;
  }
`

const TutorialNotif = styled.div`
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translate(-50%, 0);
  background: rgba(255,251,231,0.98);
  color: #232946;
  border: 6px solid #bfa16b;
  border-radius: 14px;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.85rem;
  padding: 2.1rem 1.5rem 1.2rem 1.5rem;
  box-shadow: 0 6px 0 #bfa16b;
  z-index: 100;
  max-width: 480px;
  width: 100vw;
  text-align: center;
  animation: fadeInNotif 0.3s;
  @media (max-width: 600px) {
    font-size: 0.65rem;
    max-width: 300px;
    width: 95vw;
    padding: 1.5rem 0.5rem 0.7rem 0.5rem;
    top: 30px;
  }
  @keyframes fadeInNotif {
    from { opacity: 0; transform: translate(-50%, -30px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`

const TutorialClose = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.7rem;
  background: none;
  border: none;
  color: #bfa16b;
  font-size: 1.3em;
  font-family: 'Press Start 2P', cursive;
  cursor: pointer;
  z-index: 101;
  &:hover {
    color: #f4845f;
  }
`

function getRandomClouds() {
  // Buat awan background dan foreground dengan posisi acak
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400
  // Awan belakang (z:0)
  const bgClouds = Array.from({length: 6}).map((_, i) => ({
    key: `bg${i}`,
    top: `${10 + Math.random()*60}%`,
    scale: 0.7 + Math.random()*0.7,
    y: Math.random() * vw,
    speed: (0.04 + Math.random()*0.06) * 2,
    z: 0,
    left: '0%'
  }))
  // Awan depan (z:1), lebih cepat
  const fgClouds = Array.from({length: 4}).map((_, i) => ({
    key: `fg${i}`,
    top: `${70 + Math.random()*25}%`,
    scale: 0.8 + Math.random()*0.7,
    y: Math.random() * vw,
    speed: (0.10 + Math.random()*0.10) * 2,
    z: 1,
    left: '0%'
  }))
  return [...bgClouds, ...fgClouds]
}

function App() {
  const timerRef = useRef<any>(null)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [breakCount, setBreakCount] = useState(0)
  const [isBreak, setIsBreak] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  // State untuk animasi awan
  const [clouds, setClouds] = useState(getRandomClouds())

  // Update posisi awan setiap frame
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds(prev => prev.map(cloud => {
        const vw = window.innerWidth
        const cloudW = 120 * (cloud.scale || 1)
        let nextY = cloud.y + cloud.speed
        if (nextY > vw + 40) nextY = -cloudW // reset ke kiri
        return { ...cloud, y: nextY }
      }))
    }, 40) // update setiap 40ms (~25fps)
    return () => clearInterval(interval)
  }, [])

  const handleResetCount = () => {
    if (timerRef.current) timerRef.current.resetCount()
    setPomodoroCount(0)
    setBreakCount(0)
  }

  return (
    <Bg $isBreak={isBreak}>
      {/* Awan belakang (z-index 0) */}
      {clouds.filter(c => c.z === 0).map(cloud => (
        <CloudAnimated
          key={cloud.key}
          $top={cloud.top}
          $left={cloud.left}
          $x={cloud.y}
          $scale={cloud.scale}
          $isBreak={isBreak}
          style={{ zIndex: 0, position: 'absolute' }}
        />
      ))}
      <GameFrame $isBreak={isBreak}>
        <ResetMiniAbsolute onClick={handleResetCount}>reset</ResetMiniAbsolute>
        <TutorialMini onClick={() => setShowTutorial(true)}>?</TutorialMini>
        <Title $isBreak={isBreak}>
          <span style={{display:'block'}}>POMODORO</span>
          <span style={{display:'block', marginTop:'0.2em'}}>TIMER</span>
        </Title>
        <StatsBar $isBreak={isBreak}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span id="stat-pomodoro">🍅 Pomodoro: {pomodoroCount}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span id="stat-break">☁️ Break: {breakCount}</span>
          </div>
        </StatsBar>
        <PomodoroTimer ref={timerRef} onCountChange={(pom, brk) => {setPomodoroCount(pom); setBreakCount(brk)}} onModeChange={setIsBreak} />
      </GameFrame>
      {/* Awan depan (z-index 2) */}
      {clouds.filter(c => c.z === 1).map(cloud => (
        <CloudAnimated
          key={cloud.key}
          $top={cloud.top}
          $left={cloud.left}
          $x={cloud.y}
          $scale={cloud.scale}
          $isBreak={isBreak}
          style={{ zIndex: 2, position: 'absolute', pointerEvents: 'none', touchAction: 'none' }}
        />
      ))}
      {showTutorial && (
        <TutorialNotif>
          <TutorialClose onClick={()=>setShowTutorial(false)} title="Tutup">✕</TutorialClose>
          <div style={{fontSize:'1.3em',marginBottom:'0.7em',lineHeight:1.2}}>
            <span role="img" aria-label="book">📖</span> <b>Pixel Pomodoro Tutorial</b> <span role="img" aria-label="joystick">🕹️</span>
          </div>
          <div style={{textAlign:'left',marginBottom:'0.7em',lineHeight:1.5}}>
            <b>Apa itu Pomodoro?</b><br/>
            Teknik Pomodoro adalah metode manajemen waktu dengan membagi kerja jadi 25 menit fokus (🍅), lalu 5 menit istirahat (☁️). Setelah 4 sesi, ambil istirahat panjang 15 menit.<br/><br/>
            <b>Cara Pakai:</b>
            <ul style={{textAlign:'left',margin:'0.5em 0 0 1.2em',padding:0}}>
              <li>Tekan <b>Start</b> untuk mulai sesi fokus.</li>
              <li>Setelah selesai, alarm & lagu break otomatis diputar.</li>
              <li>Gunakan <b>Pause</b>, <b>Reset</b>, atau <b>Skip</b> sesuai kebutuhan.</li>
              <li>Lihat statistik Pomodoro & Break di atas.</li>
              <li>Ganti tema, nikmati awan & musik, dan tetap produktif!</li>
            </ul>
            <br/>
            <b>Tips:</b> Jangan multitasking saat fokus, dan gunakan break untuk relaksasi.
          </div>
          <button style={{marginTop:'0.7em',fontFamily:'inherit',fontSize:'1em',background:'#f7b267',border:'2px solid #bfa16b',borderRadius:8,padding:'0.3em 1.2em',cursor:'pointer',boxShadow:'0 2px 0 #bfa16b'}} onClick={()=>setShowTutorial(false)}>Tutup</button>
        </TutorialNotif>
      )}
    </Bg>
  )
}

export default App