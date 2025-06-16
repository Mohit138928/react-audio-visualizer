// import React from 'react';

// const VisualizationModes = ({ currentMode, setCurrentMode }) => {
//     const modes = [
//         { name: 'Waveform', value: 'waveform' },
//         { name: 'Bar Graph', value: 'bar' },
//     ];

//     return (
//         <div className="visualization-modes">
//             <h3>Select Visualization Mode</h3>
//             <div className="modes">
//                 {modes.map((mode) => (
//                     <button
//                         key={mode.value}
//                         className={currentMode === mode.value ? 'active' : ''}
//                         onClick={() => setCurrentMode(mode.value)}
//                     >
//                         {mode.name}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default VisualizationModes;