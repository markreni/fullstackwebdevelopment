import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { ALL_AUTHORS, ALL_BOOKS, ME } from './queries'
import { useQuery, useApolloClient, useLazyQuery } from '@apollo/client'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const resultLoggedInUser = useQuery(ME, {
    skip: !token
  })
  const [getMe, meResults] = useLazyQuery(ME)
  const client = useApolloClient()

  if (resultAuthors.loading || resultBooks.loading || meResults.loading)  {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    window.location.reload(false)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token &&
          <button onClick={() => setPage('add')}>add book</button>
        }

        {token &&
          <button onClick={() => setPage('recommend')}>recommend</button>
        }

        {token &&
          <button onClick={logout}>logout</button>
        }

        {!token &&
          <button onClick={() => setPage('login')}>login</button>
        } 
        
      </div>

      <Authors token={token} authors={resultAuthors.data.allAuthors} show={page === 'authors'} />

      <Books books={resultBooks.data.allBooks} show={page === 'books'} />

      <NewBook show={page === 'add'} />

      {
        token && meResults.data &&
          <Recommend favorite={meResults.data.me} books={resultBooks.data.allBooks} show={page === 'recommend'} />
      }

      {
        token && resultLoggedInUser.data && !meResults.data &&
          <Recommend favorite={resultLoggedInUser.data.me} books={resultBooks.data.allBooks} show={page === 'recommend'} />
      }
  
      <LoginForm getMe={getMe} setToken={setToken} show={page === 'login'} />

    </div>
  )
}

export default App
