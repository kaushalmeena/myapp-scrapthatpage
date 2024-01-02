import { SvgIconComponent } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import { ActionButtonColor } from "./types";

type ActionButtonProps = {
  spinning: boolean;
  title: string;
  color: ActionButtonColor;
  Icon: SvgIconComponent;
  onClick: () => void;
};

function ActionButton({
  spinning,
  title,
  color,
  Icon,
  onClick
}: ActionButtonProps) {
  return (
    <Box position="relative">
      <Button
        variant="contained"
        title={title}
        color={color}
        onClick={onClick}
        sx={{
          padding: 0,
          minWidth: 0,
          height: 40,
          width: 40,
          borderRadius: 12,
          zIndex: 1
        }}
      >
        <Icon />
      </Button>
      {spinning && (
        <CircularProgress
          size={50}
          sx={{ position: "absolute", top: -5, left: -5 }}
        />
      )}
    </Box>
  );
}

export default ActionButton;
