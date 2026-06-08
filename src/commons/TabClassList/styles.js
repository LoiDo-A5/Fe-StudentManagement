import { makeStyles } from "@mui/styles";

import Colors from "../../configs/Colors";

const useStyles = makeStyles((theme) => ({
  background: {
    "&.MuiContainer-root": {
      height: "90vh",
      width: "100%",
    },
  },
  boxList: {
    width: "100%",
    backgroundColor: '#ffffff',
    border: `1px solid ${Colors.Grey4}`,
    paddingBottom: 25,
    maxHeight: "calc(90vh - 150px)",
    overflowY: "auto",
  },
  titleRoom: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 0.4,
    lineHeight: 1.2,
    marginBottom: 12,
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
  },
  listItemStyle: {
    backgroundColor: "#e1f5fe",
    marginTop: 16,
    height: "70px",
    border: `1px solid ${Colors.Grey4}`,
    cursor: "pointer",
  },
  pagination: {
    '&.MuiPagination-root': {
      marginTop: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.down('sm')]: {
        marginTop: 18,
      },
    },
  },
}));

export default useStyles;
