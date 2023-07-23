import { React, useState } from 'react';
import { useParams } from 'react-router-dom';

// Material UI imports
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';

// Imports for interacting with the db
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../utils/mutations/reviewMutations';

// Imports for other utilities
import { isEmptyInput } from '../utils/validation';

export function ReviewForm() {

    // Set default state values
  const inputDefaultValues = {
    value: '',
    isEmpty: false,
    isValid: true,
  };
//Is there a way to get the username from the logged-in information? do we have a context for a logged-in user?
  const [username, setUsername] = useState(inputDefaultValues);
  const [comment, setComment] = useState(inputDefaultValues);
  const [loggedOut, setLoggedOut] = useState(false);
  
   // Set up mutation to add the lesson to the db
  // Use the cache to add each new lesson to the bottom of the page upon saving
  const [addReview, { error: reviewError }] = useMutation(ADD_REVIEW, {
    update(cache, { data: { addReview } }) {
      try {
        const { tutorial } = cache.readQuery({
          query: GET_TUTORIAL,
          variables: { tutorialId },
        });
        const { lessons } = tutorial;

        cache.writeQuery({
          query: GET_TUTORIAL,
          variables: { tutorialId },
          data: {
            tutorial: {
              ...tutorial,
              lessons: [...lessons, addLesson],
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  // Get the logged in user's information
  const { data: userData } = useQuery(GET_USER);

  let user;
  if (userData) {
    user = userData.me;
  }
  // When form is submitted, add the tutorial to the db
  async function handleSubmit(e) {
    e.preventDefault();

    const variables = {
        comment: comment.value,
        
      };

    // If user is not logged in, set state to show error and exit submit function
    if (!user) {
      setLoggedOut(true);
      return;
    }
  // Get tutorial ID from URL wildcard
  const { tutorialId } = useParams();

};