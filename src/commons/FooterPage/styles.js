import Colors from "@/configs/Colors";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: Colors.Primary,
    color: "#ffffff",
    padding: "8px 0",
  },
  title: {
    marginBottom: "16px",
  },
  bottomText: {
    marginTop: "16px",
  },
}));

export default useStyles;
