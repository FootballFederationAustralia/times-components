/* eslint-disable react/no-array-index-key */
import React from "react";
import { StyleSheet } from "react-native";
import { TextLink } from "@times-components/link";
import { renderTrees } from "@times-components/markup";
import { colours } from "@times-components/styleguide";

import {
  articleBylinePropTypes,
  articleBylineDefaultPropTypes
} from "./article-byline-proptypes";

const linkStyles = StyleSheet.create({
  link: {
    color: colours.functional.action
  }
});

const ArticleByline = ({ ast, style, onAuthorPress }) =>
  renderTrees(ast, {
    author(key, attributes, children) {
      const url = `/profile/${attributes.slug}`;
      return (
        <TextLink
          style={[linkStyles.link, style.link]}
          key={key}
          url={url}
          onPress={e => onAuthorPress(e, { slug: attributes.slug, url })}
        >
          {children}
        </TextLink>
      );
    }
  });

ArticleByline.propTypes = articleBylinePropTypes;
ArticleByline.defaultProps = articleBylineDefaultPropTypes;

export { articleBylinePropTypes };
export default ArticleByline;
