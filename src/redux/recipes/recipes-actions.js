/* eslint-disable consistent-return */

import * as RecipesTypes from "./recipes-types";

import { normalizeRecipes } from "../../schema/recipes-schema";

export const fetchRecipesRequest = () => ({
  type: RecipesTypes.FETCH_RECIPES_REQUEST,
});

export const fetchRecipesError = (errorMessage) => ({
  type: RecipesTypes.FETCH_RECIPES_ERROR,
  payload: errorMessage,
});

export const fetchRecipesSuccess = ({ byID, ids }) => ({
  type: RecipesTypes.FETCH_RECIPES_SUCCESS,
  payload: {
    byID: byID,
    ids: ids,
  },
});

export const fetchRecipeRequest = () => ({
  type: RecipesTypes.FETCH_RECIPE_REQUEST,
});

export const fetchRecipeError = (errorMessage) => ({
  type: RecipesTypes.FETCH_RECIPE_ERROR,
  payload: errorMessage,
});

export const fetchRecipeSuccess = (recipe) => ({
  type: RecipesTypes.FETCH_RECIPE_SUCCESS,
  payload: recipe,
});

export const recipeUpdating = () => ({
  type: RecipesTypes.RECIPE_UPDATING,
});

export const recipeUpdatingError = (errorMessage) => ({
  type: RecipesTypes.RECIPE_UPDATING_ERROR,
  payload: errorMessage,
});

export const addLocalRecipeComment = (recipeID, comment) => ({
  type: RecipesTypes.ADD_LOCAL_RECIPE_COMMENT,
  payload: {
    recipeID: recipeID,
    comment: comment,
  },
});

export const upVoteRecipeSuccess = (recipeID) => ({
  type: RecipesTypes.UP_VOTE_RECIPE_SUCCESS,
  payload: {
    recipeID: recipeID,
  },
});

export const downVoteRecipeSuccess = (recipeID) => ({
  type: RecipesTypes.DOWN_VOTE_RECIPE_SUCCESS,
  payload: {
    recipeID: recipeID,
  },
});

export function fetchRecipes() {
  return async function fetchRecipesThunk(dispatch) {
    dispatch(fetchRecipesRequest());

    try {
      const res = await fetch("http://localhost:4000/recipes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const recipesJson = await res.json();

      if (!res.ok) {
        return dispatch(
          fetchRecipesError(`Error: ${res.status} ${res.statusText}`),
        );
      }

      const normalizedRecipes = normalizeRecipes(recipesJson.data);

      dispatch(
        fetchRecipesSuccess({
          byID: normalizedRecipes.entities.recipes,
          ids: normalizedRecipes.result,
        }),
      );
    } catch (error) {
      dispatch(fetchRecipesError(error.message));
    }
  };
}

export function fetchRecipe(recipeID) {
  return async function fetchRecipeThunk(dispatch) {
    dispatch(fetchRecipeRequest());

    try {
      const res = await fetch(`http://localhost:4000/recipes/${recipeID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const recipeJson = await res.json();

      if (!res.ok) {
        return dispatch(fetchRecipeError(recipeJson.error));
      }

      dispatch(fetchRecipeSuccess(recipeJson.data));
    } catch (error) {
      dispatch(fetchRecipeError(error.message));
    }
  };
}

export function addRecipeComment(recipeID, commentBody) {
  return async function addRecipeCommentThunk(dispatch, getState) {
    const token = getState().user.currentUser.token;

    if (!token) {
      return dispatch(recipeUpdatingError("Missing auth token"));
    }

    try {
      const res = await fetch(
        `http://localhost:4000/recipes/${recipeID}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commentBody: commentBody,
          }),
        },
      );

      const resJson = await res.json();

      if (!res.ok) {
        return dispatch(recipeUpdatingError(resJson.error));
      }

      dispatch(
        addLocalRecipeComment(recipeID, {
          _id: resJson.data._id,
          body: resJson.data.body,
          recipe: resJson.data.recipe,
          author: {
            _id: resJson.data.author._id,
            name: resJson.data.author.name,
            lastname: resJson.data.author.lastname,
          },
        }),
      );
    } catch (error) {
      dispatch(recipeUpdatingError(error.message));
    }
  };
}

export function upVoteRecipe(recipeID) {
  return async function upVoteRecipeThunk(dispatch, getState) {
    const token = getState().user.currentUser.token;
    dispatch(recipeUpdating());

    if (!token) {
      return dispatch(recipeUpdatingError("Missing auth token"));
    }

    try {
      const res = await fetch(
        `http://localhost:4000/recipes/${recipeID}/up-vote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const resJson = await res.json();

      if (!res.ok) {
        return dispatch(recipeUpdatingError(resJson.error));
      }

      dispatch(upVoteRecipeSuccess(recipeID));
    } catch (error) {
      dispatch(recipeUpdatingError(error.message));
    }
  };
}

export function downVoteRecipe(recipeID) {
  return async function upVoteRecipeThunk(dispatch, getState) {
    const token = getState().user.currentUser.token;
    dispatch(recipeUpdating());

    if (!token) {
      return dispatch(recipeUpdatingError("Missing auth token"));
    }

    try {
      const res = await fetch(
        `http://localhost:4000/recipes/${recipeID}/down-vote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const resJson = await res.json();

      if (!res.ok) {
        return dispatch(recipeUpdatingError(resJson.error));
      }

      dispatch(downVoteRecipeSuccess(recipeID));
    } catch (error) {
      dispatch(recipeUpdatingError(error.message));
    }
  };
}
