import {useSelector} from 'react-redux';
import  Home  from '../src/pages/home'

function App() {
  
  const people = useSelector(state => state.people.list);

  return (
    
    <>
      <Home />
    </>
    
  );
}

export default App
