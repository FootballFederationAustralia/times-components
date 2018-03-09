import React from "react";
import { Text, View, Button } from "react-native";
import PropTypes from "prop-types";
import withResponsiveStyles from "@times-components/responsive-styles";
import { colours, spacing } from "@times-components/styleguide";

const ListingError = withResponsiveStyles(View, {
  base: () => `
    margin-top: 10%;
    flex-basis: 50%;
    max-width: 548px;
    align-self: center;
  `
});

const Heading = withResponsiveStyles(Text, {
  base: () => `
    font-family: TimesModern-Bold;
    font-size: 35px;
    text-align: center;
    color: ${colours.functional.brandColour};
    margin-bottom: 12px;
  `
});

const Message = withResponsiveStyles(Text, {
  base: () => `
    font-family: TimesDigitalW04-Regular;
    font-size: 18px;
    line-height: 1.44;
    text-align: center;
    color: ${colours.functional.secondary};
  `
});

const ButtonContainer = withResponsiveStyles(View, {
  base: () => `
    align-self: center;
    padding-top: ${spacing.xl}px;
    max-width: 300px;
    width: 200px;
    padding-bottom: 10px;
  `
});

const AuthorProfileListingError = ({ refetch }) => (
  <ListingError>
    <Heading>Something&apos;s gone wrong</Heading>
    <Message>
      We can&apos;t load the page you have requested. Please check your network
      connection and retry to continue
    </Message>
    <ButtonContainer>
      <Button
        onPress={refetch}
        title="Retry"
        color={colours.functional.action}
        accessibilityLabel="Refresh the page"
      />
    </ButtonContainer>
  </ListingError>
);

AuthorProfileListingError.propTypes = {
  refetch: PropTypes.func.isRequired
};

export default AuthorProfileListingError;
