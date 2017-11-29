import React from "react";
import { Platform, Text, View } from "react-native";
import PropTypes from "prop-types";
import get from "lodash.get";
import { renderTrees } from "@times-components/markup";
import Image from "@times-components/image";
import ArticleImage from "@times-components/article-image";
import { AdComposer } from "@times-components/ad";
import { withTrackingContext } from "@times-components/tracking";

import ArticleError from "./article-error";
import ArticleLoading from "./article-loading";

import styles from "./styles/body";
import {
  ResponsiveWrapper,
  PrimaryContainer,
  SecondaryContainer,
  InlineContainer,
  LeadAsset,
  ArticleMainContainer,
  ArticleLeadAssetContainerMobile,
  ArticleMetaContainer,
  ArticleLAContainerDesktop,
  ArticleHeaderContainer,
  ArticleBodyContainer
} from "./styles/body/responsive";
import ArticleHeader from "./article-header";
import ArticleMeta from "./article-meta";


const withAdComposer = (children, section = "article") => (
  <AdComposer section={section}>{children}</AdComposer>
);

class ArticlePage extends React.Component {

  static renderArticle(articleData) {
    const [ratioWidth, ratioHeight] = articleData.leadAsset.crop.ratio.split(":");
    const aspectRatio = ratioWidth / ratioHeight;
    const LeadAssetMedia = articleData.leadAsset ?
      (<LeadAsset>
        <Image uri={articleData.leadAsset.crop.url} aspectRatio={aspectRatio} />
       </LeadAsset>): null;
    const contentArray = articleData.content.map((i, index) => ({
      data: i,
      index
    }));
    const BodyView = contentArray.map((i) => ArticlePage.renderBody(i));
    return (
      <ArticleMainContainer>
          <ArticleLeadAssetContainerMobile>
            {LeadAssetMedia}
          </ArticleLeadAssetContainerMobile>
          <ArticleHeaderContainer>
            <ArticleHeader
                headline={articleData.headline}
                flags={articleData.flags}
                standfirst={articleData.standfirst}
                label={articleData.label}
            />
          </ArticleHeaderContainer>
        <View>
          <ArticleMetaContainer>
            <ArticleMeta
              byline={articleData.byline}
              publishedTime={articleData.publishedTime}
              publicationName={articleData.publicationName}
            />
            </ArticleMetaContainer>
          <ArticleLAContainerDesktop>
            {LeadAssetMedia}
          </ArticleLAContainerDesktop>
          {BodyView}
        </View>
      </ArticleMainContainer>
    )
  }

  static renderBody(content){
    return (
      <View>
        {renderTrees([content.data], {
          paragraph(key, attributes, children) {
            return (
                <ArticleBodyContainer
                testID={`paragraph-${content.index}`}
                accessibilityLabel={`paragraph-${content.index}`}
                key={key}
                >
                <Text style={styles.articleTextElement}>{children}</Text>
              </ArticleBodyContainer>
            );
          },
          image(key, attributes) {
            const ImageContainer = ArticlePage.imageContainerChooser(
              attributes.display
            );
            return (
              <ImageContainer key={key}>
                <ArticleImage
                  key={key}
                  imageOptions={{
                    display: attributes.display,
                    ratio: attributes.ratio,
                    url: attributes.url
                  }}
                  captionOptions={{
                    caption: attributes.caption,
                    credits: attributes.credits
                  }}
                />
              </ImageContainer>
            );
          }
        })}
      </View>
    );
  }


  static renderRow(rowData) {
    if (rowData.type === "leadAsset") {
      const [ratioWidth, ratioHeight] = rowData.data.crop.ratio.split(":");
      const aspectRatio = ratioWidth / ratioHeight;
      return (
        <LeadAsset testID="leadAsset" key={rowData.type}>
          <Image uri={rowData.data.crop.url} aspectRatio={aspectRatio} />
        </LeadAsset>
      );
    } else if (rowData.type === "header") {
      const { headline, flags, standfirst, label } = rowData.data;
      return (
        <ResponsiveWrapper>
          <ArticleHeader
            key={rowData.type}
            headline={headline}
            flags={flags}
            standfirst={standfirst}
            label={label}
          />
        </ResponsiveWrapper>
      );
    } else if (rowData.type === "middleContainer") {
      const { byline, publishedTime, publicationName } = rowData.data;
      return (
        <ResponsiveWrapper>
          <ArticleMeta
            key={rowData.type}
            byline={byline}
            publishedTime={publishedTime}
            publicationName={publicationName}
          />
        </ResponsiveWrapper>
      );
    } else if (rowData.type === "articleBodyRow") {
      return (
        <View key={rowData.type + rowData.index}>
          {renderTrees([rowData.data], {
            paragraph(key, attributes, children) {
              return (
                <ResponsiveWrapper>
                  <View
                  testID={`paragraph-${rowData.index}`}
                  accessibilityLabel={`paragraph-${rowData.index}`}
                  key={key}
                  style={[styles.articleMainContentRow]}
                  >
                  <Text style={styles.articleTextElement}>{children}</Text>
                </View>
                </ResponsiveWrapper>
              );
            },
            image(key, attributes) {
              const ImageContainer = ArticlePage.imageContainerChooser(
                attributes.display
              );
              return (
                <ImageContainer key={key}>
                  <ArticleImage
                    key={key}
                    imageOptions={{
                      display: attributes.display,
                      ratio: attributes.ratio,
                      url: attributes.url
                    }}
                    captionOptions={{
                      caption: attributes.caption,
                      credits: attributes.credits
                    }}
                  />
                </ImageContainer>
              );
            }
          })}
        </View>
      );
    }

    return null;
  }

  static imageContainerChooser(imageType) {
    switch (imageType) {
      case "primary":
        return PrimaryContainer;
      case "secondary":
        return SecondaryContainer;
      case "inline":
        return InlineContainer;
      default:
        return null;
    }
  }

  render() {
    const { error, isLoading } = this.props;

    if (error) {
      return <ArticleError {...error} />;
    }

    if (isLoading) {
      return <ArticleLoading />;
    }

    const ArticleListView = ArticlePage.renderArticle(this.props.article);

    return Platform.OS === "web"
      ? withAdComposer(ArticleListView)
      : ArticleListView;
  }
}

ArticlePage.propTypes = {
  article: PropTypes.shape({
    ...ArticleHeader.propTypes,
    ...ArticleMeta.propTypes
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.shape({
    graphQLErrors: PropTypes.array,
    networkError: PropTypes.shape({
      message: PropTypes.string
    }),
    message: PropTypes.string
  })
};

ArticlePage.defaultProps = {
  article: null,
  isLoading: false,
  error: null
};

export default withTrackingContext(ArticlePage, {
  trackingObject: "Article",
  getAttrs: ({ article } = {}) => ({
    byline: get(article, "byline[0].children[0].attributes.value", ""),
    headline: get(article, "headline", ""),
    publishedTime: get(article, "publishedTime", "")
  })
});