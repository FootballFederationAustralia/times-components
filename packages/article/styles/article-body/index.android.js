import { StyleSheet } from "react-native";
import { fonts, spacing } from "@times-components/styleguide";
import sharedStyles from "./shared";
import globalStyle from "../shared";

const androidStyles = {
  ...sharedStyles,
  leadAsset: {
    marginBottom: 6
  },
  articleTextElement: {
    ...sharedStyles.articleTextElement,
    fontFamily: fonts.body,
    fontSize: 17,
    fontStyle: "normal",
    marginBottom: spacing.m
  }
};

const styles = StyleSheet.create({
  ...globalStyle,
  ...androidStyles
});

export default styles;
