import { AppBar, Box, Button, Toolbar, Typography } from '@material-ui/core';
import { NavLink, useLocation } from 'react-router-dom';

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


const NavBar = () => {

    const location = useLocation();

    return (
        <AppBar position="static" className="appbar">
            <Typography align="center" className="project-title">Visualizing U.S. Immigration and Economy</Typography>
            <Toolbar variant="dense">
                <Box display="flex" justifyContent="center" width="100%">
                    <Button color="inherit">
                        <NavLink to="/stackedbar" style={location.pathname === "/stackedbar" ? active : inactive} >Stacked Bar</NavLink>
                    </Button>
                    <Button color="inherit">
                        <NavLink to="/linechart" style={location.pathname === "/linechart" ? active : inactive} >Line Chart</NavLink>
                    </Button>
                    <Button color="inherit">
                        <NavLink to="/sankey" style={location.pathname === "/sankey" ? active : inactive} >Sankey</NavLink>
                    </Button>
                    {/* <Button color="inherit">
            <NavLink to="/fourth" activeStyle={activeStyle}>Fourth Component</NavLink>
          </Button> */}
                </Box>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar;
