import  { React, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  InputBase,
  Button,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../utils/queries/categoryQueries';
import LearnifyLogo from '../images/learnify.png';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      userSelect: 'none',
    },
    appBar: {
      backgroundColor: theme.palette.type === 'dark' ? 'gray' : 'white',
      color: 'black',
      opacity: '0.8',
    },
    logo: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: '50px',
      backgroundColor: '#fff',
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      width: '1300px',
      border: '2px solid black',
      [theme.breakpoints.down('sm')]: {
        width: '300px',
      },
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888888',
    },
    inputRoot: {
      width: '100%',
    },
    inputInput: {
      padding: theme.spacing(1),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      color: '#333333',
      fontSize: '16px',
      '&::placeholder': {
        color: '#888888',
      },
    },
    signUpButton: {
      marginRight: theme.spacing(2),
      height: 40,
      fontSize: 16,
      textTransform: 'none',
    },
    modeSwitch: {
      marginLeft: 'auto',
    },
    categoriesMenu: {
      marginTop: theme.spacing(6),
    },
    logo: {
      width: '100px',
      height: '80px',
      marginRight: theme.spacing(2),
      marginTop: theme.spacing(1),
      zoom: '1.2',
    },
  };
});

function Navbar({ darkMode, onDarkModeChange }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const { loading, data } = useQuery(GET_CATEGORIES);
  const categories = data?.categories || [];

  if (loading) {
    return <p>Loading...</p>;
  }

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  return (
    <AppBar position='static' className={classes.appBar}>
      <Toolbar>
        <NavLink to='/'>
          <Typography variant='h6' className={classes.title}>
            <img src={LearnifyLogo} alt='Learnify' className={classes.logo} />
          </Typography>
        </NavLink>
        <Button
          variant='contained'
          color='inherit'
          className={classes.signUpButton}
          onClick={handleMenuOpen}
        >
          Categories
        </Button>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder='Search…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {categories.map((category) => (
              <NavLink 
                to={'category/' + category.category} 
                style={linkStyle} 
                key={category.category}
              >
                <MenuItem onClick={handleMenuClose}>
                  {category.category}
                </MenuItem>
              </NavLink>
            ))}
          </Menu>
        </div>
        <NavLink to='/signup'>
          <Button variant='contained' className={classes.signUpButton}>
            Sign Up
          </Button>
        </NavLink>
        <NavLink to='/signin'>
          <Button variant='contained' className={classes.signUpButton}>
            Sign In
          </Button>
        </NavLink>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
