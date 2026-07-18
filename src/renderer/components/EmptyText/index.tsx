import { Typography } from "@mui/material";

function EmptyText() {
  return (
    <Typography
      sx={{ margin: 1, textAlign: "center", color: "text.secondary" }}
    >
      &lt; Empty &gt;
    </Typography>
  );
}

export default EmptyText;
