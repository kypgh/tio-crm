// styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name: string;
    brand: string;
    primary: string;
    secondary: string;
    secondaryFaded: string;
    textSecondary: string;
    blue: string;
    textPrimary: string;
    screenTitleShadow: string;
    screenTitlePrimary: string;
    screenTitleStroke: string;
    navBarShadow: string;
    dropDownColor: string;
    white: string;
    errorMsg: string;
    disabled: string;
    black: string;
    edit: string;
    success: string;
    semi: string;
    pendingColor: string;
  }
}
