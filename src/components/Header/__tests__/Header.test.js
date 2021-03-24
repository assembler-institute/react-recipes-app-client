import userEvent from "@testing-library/user-event";
import React from "react";
import { renderWithReduxAndRouter } from "../../../utils/test-utils";

import Header from "..";

describe("<Header />", () => {
  const signOutCb = jest.fn();

  it("renders the unauthenticated user", () => {
    const { getByTestId, queryByTestId, getByText } = renderWithReduxAndRouter(
      <Header
        currentUserState={{
          isAuthenticated: false,
        }}
        signOut={signOutCb}
      />,
    );

    const homeLink = getByText("Assembler School Recipes");
    const signOutButton = queryByTestId("header-logout");
    const loginButton = getByText("Login");
    const signUpButton = getByText("Registrar");

    expect(homeLink).toHaveProperty("href");
    expect(getByTestId("header-project-name")).toBeInTheDocument();
    expect(signOutButton).not.toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
    expect(getByTestId("header-login")).toBeInTheDocument();
    expect(getByTestId("header-register")).toBeInTheDocument();
  });

  it("renders the authenticated user", () => {
    const {
      getByTestId,
      getByText,
      queryByText,
      queryByTestId,
    } = renderWithReduxAndRouter(
      <Header
        currentUserState={{
          isAuthenticated: true,
        }}
        signOut={signOutCb}
      />,
    );

    const signOutButton = getByTestId("header-logout");
    const loginButton = queryByText("Login");
    const signUpButton = queryByText("Registrar");

    expect(getByTestId("header-project-name")).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
    expect(queryByTestId("header-login")).not.toBeInTheDocument();
    expect(queryByTestId("header-register")).not.toBeInTheDocument();
  });

  it("calls the `signOut` cb when authenticated", () => {
    const { getByTestId } = renderWithReduxAndRouter(
      <Header
        currentUserState={{
          isAuthenticated: true,
        }}
        signOut={signOutCb}
      />,
    );

    const signOutButton = getByTestId("header-logout");

    userEvent.click(signOutButton);

    expect(signOutCb).toHaveBeenCalledTimes(1);
  });
});
