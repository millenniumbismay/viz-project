import { AppBar, Box, Button, Toolbar, Typography } from '@material-ui/core';
import { NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'; // import bootstrap css

const active = {
    width: 'inherit',
    height: 'inherit',
    color: 'black',
    textDecoration: 'none',
    backgroundColor: '#3498db',
    boxSizing: 'inherit',
    textTransform: 'none',
};

const inactive = {
    color: 'black',
    textDecoration: 'none',
    backgroundColor: 'white',
    padding: '5px',
    textTransform: 'none',
};

const activeClass = "btn btn-primary";
const inactiveClass = "btn btn-secondary";


const NavBar = () => {

    const location = useLocation();
    console.log(location.pathname);

    return (
        <AppBar position="static" className="appbar">
            <Typography align="center" className="project-title">Visualizing U.S. Immigration and Economy</Typography>
            <Toolbar variant="dense">
                <Box display="flex" justifyContent="center" width="100%">
                    <button color="inherit" style={{marginRight:'20px'}} className={location.pathname === "/stackedbar" ? activeClass : inactiveClass}>
                        <NavLink className="navlink" to="/stackedbar" >Stacked Bar</NavLink>
                    </button>
                    <button color="inherit" style={{marginRight:'20px'}} className={location.pathname === "/linechart" ? activeClass : inactiveClass}>
                        <NavLink className="navlink" to="/linechart" >Line Chart</NavLink>
                    </button>
                    <button color="inherit" className={location.pathname === "/sankey" ? activeClass : inactiveClass}>
                        <NavLink className="navlink" to="/sankey" >Sankey</NavLink>
                    </button>
                    {/* <Button color="inherit">
            <NavLink to="/fourth" activeStyle={activeStyle}>Fourth Component</NavLink>
          </Button> */}
                </Box>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar;
