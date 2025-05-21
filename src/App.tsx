import React, { useRef } from 'react'
import styled from 'styled-components'
import PomodoroTimer from './components/PomodoroTimer'

const Bg = styled.div<{isBreak?: boolean}>`
  min-height: 100vh;
  width: 100vw;
  background: ${({isBreak}) => isBreak
    ? 'linear-gradient(to top, #181c2f 70%, #232946 100%)'
    : 'linear-gradient(to top, #aee2f7 70%, #f7e6c4 100%)'};
  position: fixed;
  z-index: 0;
  left: 0;
  top: 0;
  overflow: hidden;
`

const Cloud = styled.div<{top: string, left: string, scale?: number, isBreak?: boolean}>`
  position: absolute;
  top: ${p => p.top};
  left: ${p => p.left};
  transform: scale(${p => p.scale || 1});
  width: 120px;
  height: 60px;
  background: ${({isBreak}) => isBreak ? '#232946' : '#fff'};
  border-radius: 60px 60px 40px 40px;
  box-shadow: 40px 10px 0 0 ${({isBreak}) => isBreak ? '#232946' : '#fff'}, 80px 20px 0 0 ${({isBreak}) => isBreak ? '#232946' : '#fff'}, 20px 30px 0 0 ${({isBreak}) => isBreak ? '#232946' : '#fff'};
  opacity: ${({isBreak}) => isBreak ? 0.3 : 0.8};
`

const GameFrame = styled.div<{isBreak?: boolean}>`
  background: ${({isBreak}) => isBreak ? '#181c2f' : '#f7e6c4'};
  border: 8px solid ${({isBreak}) => isBreak ? '#232946' : '#6b4f27'};
  border-radius: 24px;
  box-shadow: 0 8px 0 ${({isBreak}) => isBreak ? '#2a2d3a' : '#bfa16b'}, 0 0 0 12px ${({isBreak}) => isBreak ? '#232946' : '#6b4f27'};
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  margin-top: 80px;
  padding: 3.5rem 1.5rem 2rem 1.5rem;
  padding-top: 3.5rem;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.3s, border 0.3s, box-shadow 0.3s;
  @media (max-width: 600px) {
    max-width: 100vw;
    padding: 1.7rem 0.2rem 1rem 0.2rem;
    padding-top: 2.2rem;
    margin-top: 16px;
    border-width: 3px;
    border-radius: 10px;
    box-shadow: 0 2px 0 ${({isBreak}) => isBreak ? '#2a2d3a' : '#bfa16b'}, 0 0 0 3px ${({isBreak}) => isBreak ? '#232946' : '#6b4f27'};
  }
`

const Title = styled.h1<{isBreak?: boolean}>`
  font-family: 'Press Start 2P', cursive;
  font-size: 3.2rem;
  font-weight: bold;
  color: ${({isBreak}) => isBreak ? '#ffe066' : '#fffbe7'};
  text-shadow: 3px 3px 0 ${({isBreak}) => isBreak ? '#232946' : '#6b4f27'}, 5px 5px 0 ${({isBreak}) => isBreak ? '#2a2d3a' : '#bfa16b'};
  letter-spacing: 1px;
  margin-bottom: 1rem;
  margin-top: 0.7rem;
  text-align: center;
  line-height: 1.1;
  transition: text-shadow 0.3s, color 0.3s;
  @media (max-width: 600px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    margin-top: 0.3rem;
  }
`

const StatsBar = styled.div<{isBreak?: boolean}>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.9rem;
  color: ${({isBreak}) => isBreak ? '#ffe066' : '#6b4f27'};
  text-shadow: 2px 2px 0 ${({isBreak}) => isBreak ? '#232946' : '#fffbe7'};
  transition: color 0.3s, text-shadow 0.3s;
  @media (max-width: 600px) {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
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
`

function App() {
  const timerRef = useRef<any>(null)
  const [pomodoroCount, setPomodoroCount] = React.useState(0)
  const [breakCount, setBreakCount] = React.useState(0)
  const [isBreak, setIsBreak] = React.useState(false)
  const handleResetCount = () => {
    if (timerRef.current) timerRef.current.resetCount()
    setPomodoroCount(0)
    setBreakCount(0)
  }
  return (
    <>
      <Bg isBreak={isBreak}>
        <Cloud top="10%" left="5%" scale={1.2} isBreak={isBreak}/>
        <Cloud top="20%" left="60%" scale={1} isBreak={isBreak}/>
        <Cloud top="40%" left="30%" scale={0.8} isBreak={isBreak}/>
        <Cloud top="60%" left="80%" scale={1.1} isBreak={isBreak}/>
      </Bg>
      <GameFrame isBreak={isBreak}>
        <ResetMiniAbsolute onClick={handleResetCount}>reset</ResetMiniAbsolute>
        <Title isBreak={isBreak}>
          <span style={{display:'block'}}>POMODORO</span>
          <span style={{display:'block', marginTop:'0.2em'}}>TIMER</span>
        </Title>
        <StatsBar isBreak={isBreak}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span id="stat-pomodoro">🍅 Pomodoro: {pomodoroCount}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span id="stat-break">☁️ Break: {breakCount}</span>
          </div>
        </StatsBar>
        <PomodoroTimer ref={timerRef} onCountChange={(pom, brk) => {setPomodoroCount(pom); setBreakCount(brk)}} onModeChange={setIsBreak} />
      </GameFrame>
    </>
  )
}

export default App