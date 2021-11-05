import {
    useParams
  } from "react-router-dom";
export const Details = (props) => {
    let { bookId } = useParams();
    const book = props.bookFacade.findBook(bookId);
    return <>
    ID: {book.id}<br/>
    Title: {book.title}<br/>
    Info: {book.info}
    </>;
  };