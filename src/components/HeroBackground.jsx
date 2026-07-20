export default function HeroBackground() {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-[130px] animate-float-slow" />
        <div className="absolute top-10 right-0 w-[26rem] h-[26rem] rounded-full bg-accent/15 blur-[130px] animate-float-slower" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-[100px] animate-float-slow" />
  
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1.5px)',
            backgroundSize: '38px 38px',
          }}
        />
  
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <g fill="none" stroke="white" strokeWidth="0.5">
            <ellipse cx="500" cy="300" rx="480" ry="240" />
            <ellipse cx="500" cy="300" rx="360" ry="180" />
            <ellipse cx="500" cy="300" rx="240" ry="120" />
            <line x1="20" y1="300" x2="980" y2="300" />
            <line x1="500" y1="20" x2="500" y2="580" />
            <line x1="120" y1="100" x2="880" y2="500" />
            <line x1="880" y1="100" x2="120" y2="500" />
          </g>
          <g fill="white">
            {[[200,180],[350,220],[480,160],[620,250],[750,190],[300,350],[550,380],[700,340],[420,420],[650,450]].map(([cx,cy],i)=>(
              <circle key={i} cx={cx} cy={cy} r="2.5" />
            ))}
          </g>
        </svg>
      </div>
    );
  }