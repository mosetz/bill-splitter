import {useSelector} from 'react-redux';

function App() {
  
  const people = useSelector(state => state.people.list);


  return (
    
      <div className='p-4'>
        <h1 className='text-5xl font-bold text-purple-800'>Bill Splitter App</h1>
        <p className='text-blue-500'>People Count: {people.length}</p>
      </div>
    
  );
}

export default App
