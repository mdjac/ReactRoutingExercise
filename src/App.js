import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch, 
  NavLink,
  useLocation
} from "react-router-dom";
import { useState } from 'react';


function App(props) {
  return (
    <div>
  <Header />
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/products">
      <Products bookFacade={props.bookFacade}/>
    </Route>
    <Route path="/company">
      <Company />
    </Route>
    <Route path="/add-book">
      <AddBook bookFacade={props.bookFacade}/>
    </Route>
    <Route path="*">
            <NoMatch />
    </Route>
  </Switch>
</div>

  );
}

const Header = () => {
  return( <ul className="header">
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
  <li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>
  <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
</ul>
  );
};


const AddBook = (props) => {
  const initialState = {title:"",info:""};
  const [book, setBook] = useState(initialState);

  const submit = (event) => {
    event.preventDefault();
    props.bookFacade.addBook(book);
    setBook(initialState);
  }

  const change = (evt) => {
    const target = evt.target;
    const changedValue = target.id;
    book[changedValue] = target.value;
    setBook({...book})
  }
  return (<>
    <form onSubmit={submit}>
      <label>
      Title:
      <input id="title" value={book.title} type="text" name="title" onChange={change}/>
      </label>
      <label>
      info:
      <input id="info" value={book.info} type="text" name="info" onChange={change} />
      </label>
      <input type="submit" value="Save" />
    </form>
</>
  );
}

const Home = () => {
  return <p>HomeText</p>
};


const Products = (props) => {
  const books = props.bookFacade.getBooks();
  return (
    <>
      <ul>
        {books.map(book =>{
          return <li key={book.id}>{book.title}</li>
        })}
      </ul>
    </>
  );
};

const Company = () => {
  return <p>Company text</p>
};

const NoMatch = () => {
  let location = useLocation();
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}





export default App;
