import axios from 'axios'
import { useEffect, useState } from 'react';

export default function UserBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  // reset each search changes
  useEffect(() => {
    setBooks([])
  }, [query])

  // search and append
  useEffect(() => {
    setLoading(true);
    setError(false)

    let cancel;

    axios({
      method: "GET",
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then(res =>{
        setBooks(prev => {
          // only book title
          // combine with previous result
          // unique using Set
          // back to array from Set
          return [...new Set([...prev, ...res.data.docs.map(b => b.title)])]
        })

        setHasMore(res.data.docs.length > 0)
        setLoading(false)
      })
      .catch(e => {

        //ignore if axios cancel error
        if (axios.isCancel(e)) return;

        setError(true)
      })

    // useEffect return function
    return () => cancel();
  }, [query, pageNumber])

  return {loading, error, books, hasMore};
}
