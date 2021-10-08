/** @format */
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './pages/Home';
import NewRoom from './pages/NewRoom';
import AuthContextProvider from './context/AuthContext';
import Room from './pages/Room';

function App() {
	return (
		<div className='App'>
			<AuthContextProvider>
				<BrowserRouter>
					<Switch>
						<Route path='/' exact component={Home} />
						<Route path='/rooms/new' component={NewRoom} />
						<Route path='/rooms/:id' component={Room} />
					</Switch>
				</BrowserRouter>
			</AuthContextProvider>
		</div>
	);
}

export default App;
