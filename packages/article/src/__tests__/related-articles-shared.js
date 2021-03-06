/* global context */
import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import mockDate from "mockdate";
import { shallow } from "enzyme";

import RelatedArticles from "../related-articles/related-articles";
import RelatedArticleItem from "../related-articles/related-article-item";

import standard1ArticleFixture from "../../fixtures/related-articles/standard/1-article.json";
import standard2ArticlesFixture from "../../fixtures/related-articles/standard/2-articles.json";
import standard3ArticlesFixture from "../../fixtures/related-articles/standard/3-articles.json";
import leadAndTwo1ArticleFixture from "../../fixtures/related-articles/leadandtwo/1-article.json";
import leadAndTwo2ArticlesFixture from "../../fixtures/related-articles/leadandtwo/2-articles.json";
import leadAndTwo3ArticlesFixture from "../../fixtures/related-articles/leadandtwo/3-articles.json";
import opinionAndTwo1ArticleFixture from "../../fixtures/related-articles/opinionandtwo/1-article.json";
import opinionAndTwo2ArticlesFixture from "../../fixtures/related-articles/opinionandtwo/2-articles.json";
import opinionAndTwo3ArticlesFixture from "../../fixtures/related-articles/opinionandtwo/3-articles.json";

const createRelatedArticlesProps = (
  fixtureData,
  action = () => {},
  onPress = () => {}
) => ({
  analyticsStream: action,
  articles: fixtureData.relatedArticles,
  template: fixtureData.relatedArticlesLayout.template,
  mainId: fixtureData.relatedArticlesLayout.main,
  onPress
});

export default () => {
  const realIntl = Intl;

  beforeEach(() => {
    mockDate.set("1/1/2018");
    global.Intl = {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ timeZone: "Europe/London" })
      })
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    mockDate.reset();
    global.Intl = realIntl;
  });

  it("callback triggered on related article press", () => {
    const onRelatedArticlePress = jest.fn();
    const article = standard1ArticleFixture.data.relatedArticles[0];

    const component = shallow(
      <RelatedArticleItem article={article} onPress={onRelatedArticlePress} />
    );

    const eventMock = {};
    component
      .find("Link")
      .at(0)
      .simulate("press", eventMock);

    expect(onRelatedArticlePress).toHaveBeenCalledWith(eventMock, {
      url: article.url
    });
  });

  context("Standard template", () => {
    it("should handle no related articles", () => {
      const events = jest.fn();
      const data = {
        relatedArticles: [],
        relatedArticlesLayout: {
          template: "DEFAULT"
        }
      };
      const tree = renderer
        .create(
          <RelatedArticles {...createRelatedArticlesProps(data, events)} />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics even when no related articles"
      );
    });

    it("should render one related article", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              standard1ArticleFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for a single related article"
      );
    });

    it("should render two related articles", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              standard2ArticlesFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for two related articles"
      );
    });

    it("should render three related articles", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              standard3ArticlesFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for three related articles"
      );
    });
  });

  context("Lead and two template", () => {
    it("should render one lead related article", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              leadAndTwo1ArticleFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for a lead related article"
      );
    });

    it("should render one lead and one support related article", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              leadAndTwo2ArticlesFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for lead and support related articles"
      );
    });

    it("should render one lead and two support related articles", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              leadAndTwo3ArticlesFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for lead and two support related articles"
      );
    });
  });

  context("Opinion and two template", () => {
    it("should render one opinion related article", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              opinionAndTwo1ArticleFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for a opinion related article"
      );
    });

    it("should render one opinion and one support related article", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              opinionAndTwo2ArticlesFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for opinion and support related articles"
      );
    });

    it("should render one opinion and two support related articles", () => {
      const events = jest.fn();
      const tree = renderer
        .create(
          <RelatedArticles
            {...createRelatedArticlesProps(
              opinionAndTwo3ArticlesFixture.data,
              events
            )}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
      expect(events.mock.calls).toMatchSnapshot(
        "should send analytics for opinion and two support related articles"
      );
    });
  });
};
