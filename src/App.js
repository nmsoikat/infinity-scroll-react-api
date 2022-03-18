import './App.css';
import { useState, useRef, useCallback } from 'react';
import { Container, Row, Col, Form, Card, Spinner, Stack } from 'react-bootstrap';
import UserBookSearch from './UserBookSearch';

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { loading, error, books, hasMore } = UserBookSearch(query, pageNumber)
  
  //set IntersectionObserver
  const observer = useRef();
  
  // This allows us to isolate resource intensive functions so that they will not automatically run on every render.
  // The useCallback Hook only runs when one of its dependencies update.
  // This can improve performance.
  // The useCallback and useMemo Hooks are similar. The main difference is that useMemo returns a memoized value and useCallback returns a memoized function.
  const lastBookElementRef = useCallback(node => {
    if(loading) return;
    if(observer.current) observer.current.disconnect()

    // create IntersectionObserver
    observer.current = new IntersectionObserver((entires) => {
      // when element is visible callback will invoked
      if(entires[0].isIntersecting && hasMore){
        setPageNumber(prev => prev + 1)
      }
    })

    //OBSERVE the element
    if(node) observer.current.observe(node)

  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1) //reset
  }


  return (
    <Container fluid="md" className='my-5'>
      <Row>
        <Col md={{ span: 6, offset: 3 }} >
          <Form.Label htmlFor="search">Type something</Form.Label>
          <Form.Control
            type="text"
            id="search"
            value={query}
            onChange={handleSearch}
          />
          {
            books.map((book, index) => {
              if (books.length === index + 1) {
                return (<Card key={book} ref={lastBookElementRef} body>{book}</Card>)

              } else {
                return (<Card key={book} body>{book}</Card>)
              }
            })
          }


          {
            loading && (
              <Stack className="text-center mt-3">
                <Spinner className='mx-auto' animation="border" variant="primary" />
              </Stack>

            )
          }

          {error && "Error"}

        </Col>
      </Row>
    </Container>
  );
}

export default App;
