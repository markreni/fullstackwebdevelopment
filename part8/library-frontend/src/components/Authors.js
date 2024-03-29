import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')

  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS} ],
  })

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log('author not found')
    }
  }, [result.data])

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo } })

    //setName('')
    setBorn('')
  }

  const authors = props.authors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        props.token &&
        <div>
          <h2>Set birthyear</h2>

          <form onSubmit={submit}>
            <select onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
            {/* <div>
              name <input
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </div> */}
            <div>
              born <input
                type='number'
                value={setBornTo}
                onChange={({ target }) => setBorn(target.valueAsNumber)}
              />
            </div>
            <button type='submit'>update author</button>
          </form>
        </div>
      }
    
    </div>
  )
}

export default Authors
