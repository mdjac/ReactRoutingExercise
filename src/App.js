import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch, 
  NavLink,
  useLocation,
  Prompt,
  useHistory,
  Redirect
} from "react-router-dom";
import React from 'react';
import { useState } from 'react';
import {Details} from './components/details';
import {Modal, Container, Row, Col, Button, Form} from 'react-bootstrap';
import MyModal from './modal';

function PrivateRoute({component: Component, loggedIn, ...rest}){
  const {pathname} = useLocation();
  return (
    <Route {...rest}>
      {loggedIn === true ? (
        <Component {...rest}/>
      ) : (
        <Redirect to={{pathname: "/login-out",state: {from: pathname}}}/>
      )} 
    </Route>
  );
}


function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();
  const changeLoginStatus = (pageToGo) => {
    setLoggedIn(!loggedIn);
    history.push(pageToGo);
  }

  return (
    <div>
  <Header loggedIn={loggedIn} loginMsg={loggedIn ? "Logout" : "Login"}/>
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
    <PrivateRoute path="/add-book" loggedIn={loggedIn} component={AddBook} bookFacade={props.bookFacade}/>
    <PrivateRoute path="/find-book" loggedIn={loggedIn} component={FindBook} bookFacade={props.bookFacade}/>
    <Route path="/login-out">
      <Login loginMsg={loggedIn ? "Logout" : "Login"} login={changeLoginStatus}/>
    </Route>
    <Route path="*">
            <NoMatch />
    </Route>
  </Switch>
</div>

  );
}

const Header = (props) => {
  return( 
  <React.Fragment>
  <ul className="header">
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
  <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
  {props.loggedIn &&
  <React.Fragment>
    <li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>
    <li><NavLink activeClassName="active" to="/find-book">Find Book</NavLink></li>
  </React.Fragment>
  }
<li>
<li><NavLink activeClassName="active" to="/login-out">{props.loginMsg}</NavLink></li>
</li>
</ul>
</React.Fragment>
  );
};


const AddBook = (props) => {
  const initialState = {title:"",info:""};
  const [book, setBook] = useState(initialState);
  let [isBlocking,setIsBlocking] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    props.bookFacade.addBook(book);
    setBook(initialState);
    setIsBlocking(false);
  }

  const change = (evt) => {
    const target = evt.target;
    const changedValue = target.id;
    book[changedValue] = target.value;
    setBook({...book})
    setIsBlocking(target.value.length > 0);
  }
  return (<>
    <form onSubmit={submit}>
    <Prompt
        when={isBlocking}
        message="Are you sure you want to continue without saving?"
      />
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
  let { path, url } = useRouteMatch();
  return (
    <>
      <ul>
        {books.map(book =>{
          return (
          <li key={book.id}>
            {book.title}  <Link to={`${url}/${book.id}`}>Details</Link>
          </li>
          );
        })}
      </ul>
      <Switch>
        <Route path={`${path}/:bookId`}>
          <Details bookFacade={props.bookFacade}/>
        </Route>
      </Switch>
      {console.log(path,url)}
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

const FindBook = (props) => {
  let [book, setBook] = useState();
  console.log("BOOK",book);
  const [formModalShow, setFormModalShow] = useState(false);
  const submitAction = (evt) => {
    evt.preventDefault();
    const bookId = evt.target.id.value;
    let tempBook = props.bookFacade.findBook(bookId);
    tempBook ? setBook(tempBook) : alert("Book not found");
  }

  const getBook = () =>{
    return book;
  }
  return (
  <div>
    <div>
      <form onSubmit={submitAction}>
      <label>
        Book ID:<br/>
        <input type="number" name="id"/>
      </label>
      <input type="submit" value="Find" />
      </form>
    </div>
    {book && 
    <div>
      ID: {book.id}<br/>
      Title: {book.title}<br/>
      Info: {book.info}<br/>
      <button onClick={()=>{
        setBook();
        props.bookFacade.deleteBook(book.id);
      }}>
      Delete book
      </button>
      <button onClick={() => setFormModalShow(true)}>
      Edit book
      </button>
      <MyModal inputbook={getBook} setbook={setBook} bookfacade={props.bookFacade} show={formModalShow} onHide={() => setFormModalShow(false)} />
    </div>
    }
  </div>
  );
}

const Login = (props) => {
  //If redirected from a protected page
  const {state } = useLocation();
  const from = state ? state.from : "/";
  return(
  <React.Fragment>
    <h1>Welcome to login page</h1>
    <p>This a simulation of a login page</p>
    <button onClick={()=>{
      props.login(from);
    }}>
    {props.loginMsg}
    </button>
  </React.Fragment>
  );
}







export default App;
