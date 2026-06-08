import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  wrapContainer: {
    minHeight: "90vh",
    marginBottom: 20,
    paddingBottom: 12,
  },
  pagination: {
    "&.MuiPagination-root": {
      marginTop: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
}));

export default useStyles;
