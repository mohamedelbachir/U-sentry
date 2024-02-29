import { createTheme, Button } from "@mantine/core";
const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        fw: "normal",
      },
    }),
  },
  activeClassName: "active-element",
});
export default theme;
