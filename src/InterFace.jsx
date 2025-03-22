
import { useState } from "react";

const InterFace = () => {

    const [play, setPlay] = useState(false);


    return (
        <div id="InterFace">
            <p>W A S D 移動(move)</p>
            <p>↑ ↓ ← → 側翻(flip)</p>
            <p>R 重新開始(restart)</p>
            <p>K 切換視角(camera)</p>
            {/* <p onClick={()=>{
  setPlay(!play);
  playSound("engine",!play)
  }}>  {(play) ?"引擎音效♪":"靜音"}</p> */}
        </div>
    )
}

export default InterFace
