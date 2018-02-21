import PropTypes from "prop-types";
import { Text } from "react-native";
import { treePropType } from "@times-components/markup";

export const articleBylinePropTypes = {
  ast: PropTypes.arrayOf(treePropType).isRequired,
  section: PropTypes.string,
  style: PropTypes.shape({
    link: Text.propTypes.style
  })
};

export const articleBylineDefaultPropTypes = {
  ast: {},
  section: "",
  style: {}
};
