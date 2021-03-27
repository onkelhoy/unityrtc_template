import React from "react";

interface IProps {
  screen:Boolean;
}

function Loading(props:IProps) {
  const timer = React.useRef<undefined|number>(undefined);
  const [dots, setDots] = React.useState('..');

  React.useEffect(() => {
    timer.current = window.setTimeout(() => setDots(d => d === '...' ? '.' : d + '.'), 150);
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <div className={`loading ${props.screen ? 'screen' : ''}`}>
      <p>Loading{dots}</p>
    </div>
  );
}


export default Loading;