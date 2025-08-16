import React, {useState} from 'react'

function SearchBox({onSearch}) {
  
    const [keyword, setKeyword] = useState("")
  
    const handleChange = (e) => {
        const value = e.target.value;
        setKeyword(value)
        onSearch(value)
    }
    
    return (
     <form className='flex items-center justify-center mb-5'>
          <input 
            type="text" 
            name='search' 
            onChange={handleChange} 
            value={keyword}
            placeholder='Search Books...'
            className='p-2 border border-orange-300 rounded-2xl focus:outline-none focus:ring-secondary w-70'
            />
     </form>
  )
}

export default SearchBox;
