import React from "react";
import { shape, string, number } from "prop-types";
import cn from "classnames";
import { Link } from "react-router-dom";

import "./RecipeCard.scss";
import CardTime from "../CardTime";
import Difficulty from "../Difficulty";
import Serves from "../Serves";
import ROUTES from "../../utils/routes";

function RecipeCard({
  recipe: {
    _id,
    name,
    difficulty,
    image,
    serves,
    hoursToPrep,
    minutesToPrep,
  } = {},
}) {
  const classes = cn("RecipeCard", "col");

  return (
    <div className={classes}>
      <div className="RecipeCard__ImgWrapper">
        <img src={image} alt="" className="RecipeCard__Img" />
      </div>
      <div className="RecipeCard__Content">
        <Link
          to={`${ROUTES.RECIPES}/${_id}`}
          data-testid={`recipe-card-${_id}`}
          className="card-link"
        >
          <h3 className="RecipeCard__Title">{name}</h3>
        </Link>
        <div className="RecipeCard__Info">
          <CardTime hoursToPrep={hoursToPrep} minutesToPrep={minutesToPrep} />
          <Difficulty difficulty={difficulty} />
          <Serves serves={serves} />
        </div>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: shape({
    _id: string.isRequired,
    name: string.isRequired,
    difficulty: string.isRequired,
    image: string.isRequired,
    serves: number.isRequired,
    hoursToPrep: number.isRequired,
    minutesToPrep: number.isRequired,
  }).isRequired,
};

export default RecipeCard;
