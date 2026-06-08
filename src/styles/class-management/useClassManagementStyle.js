import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  wrapContainer: {
    minHeight: "100vh",
    paddingTop: 96,
    paddingBottom: 24,
    background: 'linear-gradient(180deg, rgba(248,250,252,0.92), rgba(238,244,255,0.95))',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 84,
      paddingBottom: 16,
    },
  },
  pageCard: {
    borderRadius: 24,
    border: '1px solid rgba(148,163,184,0.18)',
    boxShadow: '0 18px 50px rgba(15,23,42,0.08)',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
  },
  sectionTitle: {
    fontWeight: 800,
    letterSpacing: 0.3,
  },
  tableWrap: {
    overflowX: 'auto',
  },
}));

export default useStyles;
