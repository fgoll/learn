import React, {render} from '../../react-mini/packages/react-mini'



console.log(React)
// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         <span>It is Work!</span>
//       </div>
//     )
//   }
// }

console.log((
  <div style={{width: '100px', height: '100px', background: 'red'}}>
  <span></span>
</div>
))

React.render(
    <div style={{width: '100px', height: '100px', background: 'red'}}>
      <span>It's work</span>
    </div>,
    document.getElementById('root')
);