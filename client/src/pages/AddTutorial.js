import { React, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography 
} from '@mui/material';
import {
  Chip,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  useTheme,
} from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';
import { isEmptyInput } from '../utils/validation';
import { GET_CATEGORIES } from '../utils/queries/categoryQueries';
// import { QUERY_USER } from '../utils/queries/userQueries';
import { ADD_TUTORIAL } from '../utils/mutations/tutorialMutations';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: `100%`,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(category, selectedCategories, theme) {
  return {
    fontWeight:
      selectedCategories.indexOf(category) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
}

export function AddTutorial() {
  const classes = useStyles();
  const theme = useTheme();

  const inputDefaultValues = {
    value: '',
    isEmpty: false,
    isValid: true,
  };

  const [title, setTitle] = useState(inputDefaultValues);
  const [overview, setOverview] = useState(inputDefaultValues);
  const [thumbnail, setThumbnail] = useState(inputDefaultValues);
  const [selectedCategories, setSelectedCategories] = useState({...inputDefaultValues, value: []});

  const { loading: categoryLoading, data: categoryData } = useQuery(GET_CATEGORIES);
  const categories = categoryData?.categories || [];

  // const { loading, data } = useQuery(QUERY_USER);

  const [addTutorial, { error }] = useMutation(ADD_TUTORIAL);

  // let user;

  // if (userData) {
  //   user = userData.user;
  // }

  if (categoryLoading) {
    return <p>Loading...</p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const categoryIds = selectedCategories.value.map((category) => {
      return category._id;
    });

    const variables = {
      title: title.value,
      overview: overview.value,
      thumbnail: thumbnail.value,
      categories: categoryIds,
      // Temporarily hard-coding teacher ID
      teacher: '64b9507c3f91a8c86fec3503',
    }

    try {
      await addTutorial({ variables });
    } catch (error) {
      console.log(error);
    }
  }

  // set a new value to the state.value associated to the field that invokes this function
  function handleOnChange(inputValue, setState) {
    setState((otherValues) => ({
      ...otherValues,
      value: inputValue,
    }));
  }

  // verify that the input is non-blank
  // set the associated state to display the appropriate error message based on the validation result
  function handleOnBlur(inputValue, setState) {
    // ensure that the input is not empty
    if (isEmptyInput(inputValue)) {
      setState((otherValues) => ({
        ...otherValues,
        isEmpty: true,
      }));
      return;
    }
  }

  // update the state to clear the error when the user focuses on that field
  function handleOnFocus(state, setState) {
    // change state to remove the error message on Focus if previously input was empty
    if (state.isEmpty) {
      setState((otherValues) => ({
        ...otherValues,
        isEmpty: false,
      }));
      return;
    }
  }

  return (
    <div>
      <Typography component='h1' variant='h5'>
        Add a Tutorial
      </Typography>
      <Box
        component='form'
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        <TextField
          required
          fullWidth
          id='title'
          name='title'
          label='Title'
          margin='normal'
          onChange={(e) => handleOnChange(e.target.value.trim(), setTitle)}
          onBlur={(e) => handleOnBlur(e.target.value, setTitle)}
          error={title.isEmpty}
          helperText={title.isEmpty && 'Please enter a title for your tutorial'}
          onFocus={() => handleOnFocus(title, setTitle)}
        />
        <TextField
          required
          fullWidth
          id='overview'
          name='overview'
          label='Overview (1-2 sentences)'
          margin='normal'
          onChange={(e) => handleOnChange(e.target.value.trim(), setOverview)}
          onBlur={(e) => handleOnBlur(e.target.value, setOverview)}
          error={overview.isEmpty}
          helperText={
            overview.isEmpty && 'Please enter an overview of your tutorial'
          }
          onFocus={() => handleOnFocus(overview, setOverview)}
        />
        <TextField
          required
          fullWidth
          id='thumbnail'
          name='thumbnail'
          label='Thumbnail Image URL'
          margin='normal'
          onChange={(e) => {handleOnChange(e.target.value.trim(), setThumbnail)}}
          onBlur={(e) => handleOnBlur(e.target.value, setThumbnail)}
          error={thumbnail.isEmpty}
          helperText={
            thumbnail.isEmpty &&
            'Please enter the URL of a thumbnail for your tutorial'
          }
          onFocus={() => handleOnFocus(thumbnail, setThumbnail)}
        />
        <FormControl 
          required 
          className={classes.formControl} 
          error={selectedCategories.isEmpty} 
        >
          <InputLabel id='categories-label'>
            Categories (choose all that apply)
          </InputLabel>
          <Select
            labelId='categories-label'
            id='categories'
            name='categories'
            multiple
            value={selectedCategories.value}
            onChange={(e) => handleOnChange(e.target.value, setSelectedCategories)}
            onBlur={(e) => handleOnBlur(e.target.value, setSelectedCategories)}
            onFocus={() => handleOnFocus(selectedCategories, setSelectedCategories)}
            input={<Input id='categories-input' />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value._id} label={value.category} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {categories.map((category) => (
              <MenuItem
                key={category.category}
                value={category}
                style={getStyles(category.category, selectedCategories.value, theme)}
              >
                {category.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          type='submit' 
          variant='contained' 
          sx={{ mt: 3, mb: 2 }}
        >
          Save Your Tutorial
        </Button>
      </Box>
    </div>
  );
}

export default AddTutorial;
